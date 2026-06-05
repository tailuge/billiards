import {
  MessagingClient,
  Lobby,
  PresenceMessage,
  ChatMessage,
} from "@tailuge/messaging"
import { Session } from "../network/client/session"
import { Rules } from "../controller/rules/rules"
import { id } from "../utils/dom"
import { LOBBY_URL } from "../network/client/constants"
import { VERSION } from "../utils/version"
import { NetworkLogger } from "../utils/network-logger"

export class LobbyIndicator {
  private readonly element: HTMLElement | null
  private readonly countElement: HTMLSpanElement | null
  private readonly challengePill: HTMLElement | null
  private messagingClient: MessagingClient | null = null
  private lobby: Lobby | null = null
  private count = 0
  private challenger: {
    userId: string
    userName: string
    ruleType: string
  } | null = null
  private readonly rules: Rules
  private readonly ruleType: string
  private static readonly NCHAN_URL = "https://billiards-network.onrender.com"
  private readonly messagingUrl: string
  private currentTableId: string | null = null
  private readonly replayMode: boolean
  private readonly isSpectator: boolean
  private opponentOnline: boolean | null = null
  private users: PresenceMessage[] = []
  private readonly onChatMessage: ((msg: string) => void) | undefined
  private readonly onShowOverlay: ((url: string) => void) | undefined

  constructor(
    botMode: boolean,
    replayMode: boolean,
    rules: Rules,
    onChatMessage?: (msg: string) => void,
    messagingUrl?: string,
    onShowOverlay?: (url: string) => void
  ) {
    this.rules = rules
    this.replayMode = replayMode
    this.onChatMessage = onChatMessage
    this.onShowOverlay = onShowOverlay
    const isInsecure =
      messagingUrl?.startsWith("ws://") || messagingUrl?.startsWith("http://")
    const httpProtocol = isInsecure ? "http" : "https"
    this.messagingUrl = messagingUrl
      ? `${httpProtocol}://${messagingUrl.replace(/^(https?|wss?):\/\//, "")}`
      : LobbyIndicator.NCHAN_URL
    this.isSpectator = Session.getInstance().spectator
    if (botMode) {
      this.ruleType = `${this.rules.rulename}-bot`
    } else if (replayMode) {
      this.ruleType = "replay"
    } else if (Session.getInstance().spectator) {
      this.ruleType = "spectator"
    } else {
      this.ruleType = this.rules.rulename
    }
    this.element = id("lobbyOverlay")
    this.countElement = this.element?.querySelector(
      ".lobby-count"
    ) as HTMLSpanElement
    this.challengePill = id("challengePill")
    this.setupElement()
  }

  private setupElement(): void {
    if (!this.element) return

    if (this.element instanceof HTMLAnchorElement) {
      this.element.setAttribute("target", "_self")
      this.element.setAttribute("rel", "noopener")
    } else {
      this.element.style.cursor = "pointer"
    }

    this.element.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest(".status-emoji")) {
        e.preventDefault()
        e.stopPropagation()
        const game = encodeURIComponent(
          JSON.stringify(NetworkLogger.getGameLogs())
        )
        const lobby = encodeURIComponent(
          JSON.stringify(NetworkLogger.getLobbyLogs())
        )
        const url = `net.html?game=${game}&lobby=${lobby}`
        if (this.onShowOverlay) {
          this.onShowOverlay(url)
        } else {
          globalThis.open(url, "_blank")
        }
        return
      }

      if (!(this.element instanceof HTMLAnchorElement)) {
        if (typeof globalThis.open === "function") {
          globalThis.open(this.getLobbyUrl(), "_self")
        }
      }
    })

    id("challengeDecline")?.addEventListener("click", (e) => {
      e.stopPropagation()
      if (this.lobby && this.challenger) {
        this.lobby.declineChallenge(this.challenger.userId, this.ruleType)
      }
      this.challenger = null
      this.updateDisplay()
    })

    id("challengeAccept")?.addEventListener("click", () => {
      if (typeof globalThis.open === "function") {
        globalThis.open(this.getLobbyUrl(), "_self")
      }
    })
  }

  async init(): Promise<void> {
    if (!this.element) return
    NetworkLogger.logLobby("init")

    const userId = Session.getInstance().clientId
    const userName = Session.getInstance().playername

    this.messagingClient = new MessagingClient({
      baseUrl: this.messagingUrl,
    })
    this.messagingClient.setVersion(VERSION + `-${Session.getInstance().lod}`)
    this.messagingClient.start()

    const params = new URLSearchParams(globalThis.location?.search ?? "")
    this.currentTableId = params.get("tableId")

    const presence: {
      messageType: "presence"
      type: "join"
      userId: string
      userName: string
      ruleType: string
      tableId?: string
      isSpectator?: boolean
    } = {
      messageType: "presence",
      type: "join",
      userId,
      userName,
      ruleType: this.ruleType,
      ...(this.isSpectator && { isSpectator: true }),
    }
    if (this.currentTableId) {
      presence.tableId = this.currentTableId
    }

    this.lobby = await this.messagingClient.joinLobby(presence)
    NetworkLogger.logLobby("joined")

    this.lobby.onUsersChange((users) => {
      NetworkLogger.logLobby(`users: ${users.length}`)
      this.users = users
      this.count = users.length
      const session = Session.getInstance()
      const opponentId = session.opponentClientId
      if (opponentId) {
        const wasOnline = this.opponentOnline
        this.opponentOnline = users.some(
          (u) =>
            u.userId === opponentId &&
            u.tableId === (this.currentTableId || session.tableId)
        )
        if (wasOnline !== false && this.opponentOnline === false) {
          NetworkLogger.logLobby(`opponent offline: ${opponentId}`)
        }
      } else {
        this.opponentOnline = null
      }
      this.updateDisplay()
    })

    this.lobby.onChat((chat: ChatMessage) => {
      NetworkLogger.logLobby("chat")
      const sender = this.users.find((u) => u.userId === chat.senderId)
      const senderName = sender ? sender.userName : "Unknown"
      this.onChatMessage?.(`${senderName}: ${chat.text}`)
    })

    this.lobby.onChallenge((challenge) => {
      NetworkLogger.logLobby(`challenge: ${challenge.type}`)
      if (challenge.type === "offer") {
        this.challenger = {
          userId: challenge.challengerId,
          userName: challenge.challengerName,
          ruleType: challenge.ruleType,
        }
      } else if (challenge.type === "decline" || challenge.type === "cancel") {
        this.challenger = null
      }
      this.updateDisplay()
    })

    this.updateDisplay()
  }

  setTableId(tableId: string | null | undefined): void {
    this.currentTableId = tableId ?? null
    if (this.lobby) {
      this.lobby.updatePresence({ tableId: tableId ?? undefined } as any)
    }
  }

  private updateDisplay(): void {
    if (!this.element) return
    const challenged = this.challenger !== null

    this.updateCountDisplay()
    this.updateChallengePill(challenged)

    this.element.setAttribute(
      "aria-label",
      challenged
        ? `Multiplayer Lobby - CHALLENGE FROM ${this.challenger!.userName}!`
        : `Multiplayer Lobby - ${this.count} online`
    )

    if (this.element instanceof HTMLAnchorElement) {
      this.element.setAttribute("href", this.getLobbyUrl())
    }
  }

  private updateCountDisplay(): void {
    if (!this.countElement) return

    const session = Session.getInstance()
    const opponentId = session.opponentClientId
    const isTwoPlayer =
      !!opponentId &&
      opponentId !== "bot" &&
      !session.botMode &&
      !session.practiceMode &&
      !this.replayMode

    let status = "⚪"
    if (isTwoPlayer) {
      if (this.opponentOnline === true) {
        status = "🟢"
      } else if (this.opponentOnline === false) {
        status = "🔴"
      }
    }
    const statusEmoji = ` <span class='status-emoji' title='Network Logs'>${status}</span>`

    // if replay mode then set name from queryparam userName
    const params = new URLSearchParams(globalThis.location?.search ?? "")
    const name = this.replayMode
      ? (params.get("userName") ?? "Anon")
      : session.playername
    this.countElement.innerHTML = `${name} ${this.isSpectator ? "👀" : "👥"}${this.count}${statusEmoji}`

    const otherUsers = Array.from(
      new Set(
        this.users
          .filter((u) => u.userId !== session.clientId)
          .map((u) => u.userName)
      )
    ).sort()

    if (otherUsers.length > 0) {
      this.countElement.title = `Online:\n${otherUsers.join("\n")}`
    } else {
      this.countElement.removeAttribute("title")
    }
  }

  private updateChallengePill(challenged: boolean): void {
    if (!this.challengePill) return

    this.challengePill.hidden = !challenged
    if (challenged) {
      const textNode = this.challengePill.childNodes[0]
      const msg = `Challenge of ${this.challenger!.ruleType} from ${this.challenger!.userName} `
      if (textNode?.nodeType === Node.TEXT_NODE) {
        textNode.textContent = msg
      } else {
        this.challengePill.prepend(msg)
      }
    }
  }

  private getLobbyUrl(): string {
    const url = new URL(LOBBY_URL)
    const session = Session.getInstance()

    if (this.replayMode) {
      return url.toString()
    }

    // if this page was loaded with query param test then set the user name
    const params = new URLSearchParams(globalThis.location?.search ?? "")
    if (params.get("test")) {
      url.searchParams.set("userName", session.playername)
      url.searchParams.set("userId", session.clientId)
    }

    // if the userName is Anon set userId in search params. Allows for challenges
    if (session.playername == "Anon") {
      url.searchParams.set("userId", session.clientId)
    }

    if (!this.challenger) {
      return url.toString()
    }

    url.searchParams.set("action", "join")
    url.searchParams.set("ruletype", this.challenger.ruleType)
    url.searchParams.set("opponentId", this.challenger.userId)
    url.searchParams.set("opponentName", this.challenger.userName)

    return url.toString()
  }

  async stop(): Promise<void> {
    try {
      if (this.lobby) {
        await this.lobby.leave()
      }
      if (this.messagingClient) {
        await this.messagingClient.stop()
      }
    } catch {
      // Ignore shutdown failures.
    }
  }
}
