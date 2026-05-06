import { MessagingClient, Lobby } from "@tailuge/messaging"
import { Session } from "../network/client/session"
import { Rules } from "../controller/rules/rules"
import { id } from "../utils/dom"
import { LOBBY_URL } from "../utils/gameover"

export class LobbyIndicator {
  private readonly element: HTMLElement | null
  private readonly countElement: HTMLSpanElement | null
  private readonly challengePill: HTMLElement | null
  private messagingClient: MessagingClient | null = null
  private lobby: Lobby | null = null
  private count = 0
  private challenger: { userId: string; userName: string } | null = null
  private readonly rules: Rules
  private readonly ruleType: string
  private static readonly NCHAN_URL = "https://billiards-network.onrender.com"
  private currentTableId: string | null = null
  private readonly replayMode: boolean
  private opponentOnline: boolean | null = null
  constructor(botMode: boolean, replayMode: boolean, rules: Rules) {
    this.rules = rules
    this.replayMode = replayMode
    if (botMode) {
      this.ruleType = "bot"
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
      this.element.addEventListener("click", () => {
        if (typeof globalThis.open === "function") {
          globalThis.open(this.getLobbyUrl(), "_self")
        }
      })
      this.element.style.cursor = "pointer"
    }

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

    const userId = Session.getInstance().clientId
    const userName = Session.getInstance().playername

    this.messagingClient = new MessagingClient({
      baseUrl: LobbyIndicator.NCHAN_URL,
    })
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
    } = {
      messageType: "presence",
      type: "join",
      userId,
      userName,
      ruleType: this.ruleType,
    }
    if (this.currentTableId) {
      presence.tableId = this.currentTableId
    }

    this.lobby = await this.messagingClient.joinLobby(presence)

    this.lobby.onUsersChange((users) => {
      this.count = users.length
      const session = Session.getInstance()
      const opponentId = session.opponentClientId
      if (opponentId) {
        this.opponentOnline = users.some(
          (u) =>
            u.userId === opponentId &&
            u.tableId === (this.currentTableId || session.tableId)
        )
      } else {
        this.opponentOnline = null
      }
      this.updateDisplay()
    })

    this.lobby.onChallenge((challenge) => {
      if (challenge.type === "offer") {
        this.challenger = {
          userId: challenge.challengerId,
          userName: challenge.challengerName,
        }
      } else if (challenge.type === "decline" || challenge.type === "cancel") {
        this.challenger = null
      }
      this.updateDisplay()
    })

    this.updateDisplay()
  }

  setTableId(tableId: string | null): void {
    this.currentTableId = tableId
    if (this.lobby) {
      if (tableId) {
        this.lobby.updatePresence({ tableId })
      } else {
        this.lobby.updatePresence({})
      }
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

    let statusEmoji = ""
    if (isTwoPlayer) {
      if (this.opponentOnline === true) {
        statusEmoji = " 🟢"
      } else if (this.opponentOnline === false) {
        statusEmoji = " 🔴"
      }
    }
    this.countElement.textContent = `${this.count} 👥${statusEmoji}`
  }

  private updateChallengePill(challenged: boolean): void {
    if (!this.challengePill) return

    this.challengePill.hidden = !challenged
    if (challenged) {
      const textNode = this.challengePill.childNodes[0]
      const msg = `Challenge from ${this.challenger!.userName} `
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

    url.searchParams.set("userName", session.playername)
    url.searchParams.set("userId", session.clientId)

    if (!this.challenger) {
      return url.toString()
    }

    url.searchParams.set("action", "join")
    url.searchParams.set("ruletype", this.ruleType)
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
