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
import { getRuleEmoji, ruleTypeMap } from "../utils/utils"

export class LobbyIndicator {
  private readonly element: HTMLElement | null
  private readonly countElement: HTMLSpanElement | null
  private readonly challengePill: HTMLElement | null
  private messagingClient: MessagingClient | null = null
  private initPromise: Promise<void> | null = null
  private lobby: Lobby | null = null
  private count = 0
  private challenger: {
    userId: string
    userName: string
    ruleType: string
    options?: Record<string, string>
    tournamentId?: string
    // Carried so the Accept redirect can name the table the player accepted;
    // without it the lobby has to invent a new one (see getLobbyUrl).
    tableId?: string
    nextTurnId?: string
  } | null = null
  private readonly rules: Rules
  private readonly ruleType: string
  private readonly tableSize: number
  private readonly freeAim: boolean
  private static readonly NCHAN_URL = "https://billiards-network.onrender.com"
  private readonly messagingUrl: string
  private currentTableId: string | null = null
  private readonly replayMode: boolean
  private readonly isSpectator: boolean
  /**
   * The session's own name — the URL-seeded `?userName=`, or "Anon" — captured
   * once at construction. `BrowserContainer.startReplay()` later overwrites
   * `Session.playername` with the replay footage's player 1, and this indicator
   * re-renders on every presence change, so reading the session at render time
   * would label the watcher with the recorded player's name.
   */
  private readonly userName: string
  private opponentOnline: boolean | null = null
  /** Set once the opponent has been seen at our table, so their first
   * appearance reads as "joined", not "reconnected". */
  private opponentSeen = false
  private users: PresenceMessage[] = []
  private readonly onChatMessage: ((msg: string) => void) | undefined
  private readonly offlineHandler: () => void
  private lobbyLeaveTimer: ReturnType<typeof setTimeout> | null = null

  constructor(
    botMode: boolean,
    replayMode: boolean,
    rules: Rules,
    onChatMessage?: (msg: string) => void,
    messagingUrl?: string
  ) {
    this.offlineHandler = () => {
      this.onChatMessage?.("🚫")
    }
    this.rules = rules
    this.replayMode = replayMode
    this.onChatMessage = onChatMessage
    const isInsecure =
      messagingUrl?.startsWith("ws://") || messagingUrl?.startsWith("http://")
    const httpProtocol = isInsecure ? "http" : "https"
    this.messagingUrl = messagingUrl
      ? `${httpProtocol}://${messagingUrl.replace(/^(https?|wss?):\/\//, "")}`
      : LobbyIndicator.NCHAN_URL
    this.isSpectator = Session.getInstance().spectator
    this.userName = Session.getInstance().playername || "Anon"
    this.tableSize = parseFloat(
      new URLSearchParams(globalThis.location?.search ?? "").get("tableSize") ||
        "10"
    )
    this.freeAim =
      new URLSearchParams(globalThis.location?.search ?? "").get("freeaim") ===
      "true"
    if (botMode) {
      this.ruleType = `${this.rules.rulename}-bot`
    } else if (Session.isExamMode()) {
      this.ruleType = `${this.rules.rulename}-exam`
    } else if (Session.isSpeedrunMode()) {
      this.ruleType = `${this.rules.rulename}-speedrun`
    } else if (replayMode) {
      this.ruleType = "replay"
    } else if (Session.getInstance().spectator) {
      this.ruleType = "spectator"
    } else {
      this.ruleType = this.rules.rulename
    }
    const clubName = new URLSearchParams(globalThis.location?.search ?? "").get(
      "clubName"
    )
    if (clubName) {
      this.ruleType = `${this.ruleType}-club`
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
      // Two-player games stay put; only the status emoji (above) is clickable.
      if (this.isTwoPlayerGame()) {
        e.preventDefault()
        e.stopPropagation()
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
        globalThis.open(this.getLobbyUrl(true), "_self")
      }
    })
  }

  async init(): Promise<void> {
    if (!this.element) return
    if (this.initPromise) return this.initPromise
    this.initPromise = this.doInit()
    return this.initPromise
  }

  private async doInit(): Promise<void> {
    if (!this.element) return
    NetworkLogger.logLobby("init")

    const userId = Session.getInstance().clientId

    this.messagingClient = new MessagingClient({
      baseUrl: this.messagingUrl,
    })
    this.messagingClient.setVersion(VERSION + `-${Session.getInstance().lod}`)
    this.messagingClient.start()

    const params = new URLSearchParams(globalThis.location?.search ?? "")
    this.currentTableId = params.get("tableId")

    const tournamentId = Session.getInstance().tournamentId
    const presence: {
      messageType: "presence"
      type: "join"
      userId: string
      userName: string
      ruleType: string
      tableId?: string
      arenaId?: string
      isSpectator?: boolean
      options?: Record<string, string>
    } = {
      messageType: "presence",
      type: "join",
      userId,
      userName: this.userName,
      ruleType: this.ruleType,
      options: {
        ...(this.tableSize !== 10 && { tableSize: String(this.tableSize) }),
        ...(this.freeAim && { freeaim: "true" }),
      },
      ...(this.isSpectator && { isSpectator: true }),
      ...(tournamentId && { arenaId: tournamentId }),
    }
    if (this.currentTableId) {
      presence.tableId = this.currentTableId
    }

    this.lobby = await this.messagingClient.joinLobby(presence, {
      onReconnect: () => {
        NetworkLogger.logLobby("lobby reconnect")
        NetworkLogger.logGame("lobby reconnect")
        this.onChatMessage?.("📶")
      },
    })
    NetworkLogger.logLobby("joined")
    globalThis.addEventListener?.("offline", this.offlineHandler)

    this.lobby.onUsersChange((users) => {
      this.users = users
      this.count = users.length
      const opponentId = Session.getInstance().opponentClientId
      if (opponentId) {
        const wasOnline = this.opponentOnline
        this.opponentOnline = this.isOpponentPresent(users, opponentId)
        this.handleOpponentStatusChange(wasOnline, opponentId)
      } else {
        this.opponentOnline = null
      }
      this.updateDisplay()
    })

    this.lobby.onChat((chat: ChatMessage) => {
      const sender = this.users.find((u) => u.userId === chat.senderId)
      const senderName = sender ? sender.userName : "Unknown"
      this.onChatMessage?.(`[${senderName}: ${chat.text}]`)
    })

    this.lobby.onChallenge((challenge) => {
      NetworkLogger.logLobby(`challenge: ${challenge.type}`)
      if (challenge.type === "offer") {
        this.challenger = {
          userId: challenge.challengerId,
          userName: challenge.challengerName,
          ruleType: challenge.ruleType,
          options: challenge.options,
          tournamentId: challenge.options?.tournamentId,
          tableId: challenge.tableId,
          nextTurnId: challenge.nextTurnId,
        }
      } else if (challenge.type === "decline" || challenge.type === "cancel") {
        this.challenger = null
      }
      this.updateDisplay()
    })

    this.updateDisplay()
  }

  /** Expose the MessagingClient for use by MessagingMessageRelay. */
  getMessagingClient(): MessagingClient | null {
    return this.messagingClient
  }

  /** Leave the lobby once the game has been idle in End, so no ghost presence lingers. */
  scheduleLeave(delayMs: number): void {
    this.cancelScheduledLeave()
    this.lobbyLeaveTimer = setTimeout(() => {
      this.lobbyLeaveTimer = null
      void this.lobby?.leave()
    }, delayMs)
  }

  private cancelScheduledLeave(): void {
    if (this.lobbyLeaveTimer !== null) {
      clearTimeout(this.lobbyLeaveTimer)
      this.lobbyLeaveTimer = null
    }
  }

  setTableId(tableId: string | null | undefined): void {
    this.currentTableId = tableId ?? null
    if (this.lobby) {
      const tournamentId = Session.getInstance().tournamentId
      this.lobby.updatePresence({
        tableId: tableId ?? undefined,
        ...(tournamentId && { arenaId: tournamentId }),
        options: {
          ...(this.tableSize !== 10 && { tableSize: String(this.tableSize) }),
          ...(this.freeAim && { freeaim: "true" }),
        },
      })
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
        ? `${this.element.textContent?.trim() ?? ""} CHALLENGE FROM ${this.challenger!.userName}`
        : (this.element.textContent?.trim() ?? "")
    )

    if (this.element instanceof HTMLAnchorElement) {
      this.element.setAttribute("href", this.getLobbyUrl())
    }
  }

  private updateCountDisplay(): void {
    if (!this.countElement) return

    const session = Session.getInstance()
    const isTwoPlayer = this.isTwoPlayerGame()

    let status = "⚪"
    if (isTwoPlayer) {
      if (this.opponentOnline === true) {
        status = "🟢"
      } else if (this.opponentOnline === false) {
        status = "🔴"
      }
    }
    const statusEmoji = ` <span class='status-emoji'>${status}</span>`
    // Own element so .lobby-count (a flex row) centers it separately from the
    // name; bare text would be glued to the name in one anonymous flex item.
    const lobbyIcon = `<span class="lobby-icon">${this.isSpectator ? "👀" : "👥"}</span>`

    // Not session.playername: in replay that has already been overwritten with
    // the footage's player 1 (see the userName field).
    const name = this.userName
    this.countElement.innerHTML = `${this.ruleBadge()}${name} ${lobbyIcon}${this.count}${statusEmoji}`

    // One entry per name; a name playing a game carries its rule emoji so the
    // tooltip shows e.g. "veli ④" for a sagu player. ruleType is absent for
    // users idling in the lobby, and unknown bases (replay, spectator) are
    // left unadorned rather than printed as text.
    const otherUsers = new Map<string, string>()
    for (const u of this.users) {
      if (u.userId === session.clientId || otherUsers.has(u.userName)) continue
      const base = u.ruleType?.split("-")[0]
      const emoji = base ? ruleTypeMap[base]?.emoji : undefined
      otherUsers.set(u.userName, emoji ? `${u.userName} ${emoji}` : u.userName)
    }
    const entries = [...otherUsers.values()].sort()

    if (entries.length > 0) {
      this.countElement.title = `Online:\n${entries.join("\n")}`
    } else {
      this.countElement.removeAttribute("title")
    }
  }

  /**
   * The game the reader is playing, as the mark shown left of their own name:
   * the same map the tooltip uses. This page's ruleType carries a suffix in
   * bot, exam, speedrun and club games, so it is the base that names the rule;
   * a replay, a spectator or any base the map does not know shows nothing
   * rather than printing the label as text.
   *
   * Its own element, like the lobby icon: inside the name's own text the mark's
   * fallback font gave the line a taller box than the name's and the pair sat
   * low against the rest of the row. As a flex item it is centred by the row
   * instead, and its size is the CSS's to set without moving the name.
   */
  private ruleBadge(): string {
    const base = this.ruleType.split("-")[0]
    const emoji = ruleTypeMap[base]?.emoji
    return emoji ? `<span class="lobby-rule">${emoji}</span>` : ""
  }

  private updateChallengePill(challenged: boolean): void {
    if (!this.challengePill) return

    this.challengePill.hidden = !challenged
    if (challenged) {
      const textNode = this.challengePill.childNodes[0]
      const msg = `${getRuleEmoji(this.challenger!.ruleType)} ${this.challenger!.userName} `
      if (textNode?.nodeType === Node.TEXT_NODE) {
        textNode.textContent = msg
      } else {
        this.challengePill.prepend(msg)
      }
    }
  }

  /**
   * @param accept true only for the challenge pill's Accept button, which hands
   *   the accepted tableId to the lobby. The plain lobby link stays a
   *   re-challenge so returning to the lobby never joins an unaccepted game.
   */
  private getLobbyUrl(accept = false): string {
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
    url.searchParams.set("opponent.userId", this.challenger.userId)
    url.searchParams.set("opponent.userName", this.challenger.userName)

    if (accept && this.challenger.tableId) {
      url.searchParams.set("acceptTableId", this.challenger.tableId)
      if (this.challenger.nextTurnId) {
        url.searchParams.set("nextTurnId", this.challenger.nextTurnId)
      }
    }

    // Forward the rule options (tableSize, reds, raceTo, shotClock, freeaim,
    // collaboration, practice, ...) so the lobby can re-issue the challenge with
    // the same settings. Without these the accepted game falls back to defaults
    // (e.g. full-size snooker with 15 reds). Keys that would clobber the
    // handoff/system params set above are ignored, since options originate from
    // the challenger and must not redirect this session elsewhere.
    const reserved = new Set([
      "action",
      "ruletype",
      "opponent.userId",
      "opponent.userName",
      "tournamentId",
      "userId",
      "userName",
      "tableId",
      "first",
      "spectator",
      "lod",
      "flip",
      "nextTurnId",
    ])
    for (const [key, value] of Object.entries(this.challenger.options ?? {})) {
      if (!reserved.has(key)) {
        url.searchParams.set(key, String(value))
      }
    }

    if (this.challenger.tournamentId) {
      url.searchParams.set("tournamentId", this.challenger.tournamentId)
    }

    return url.toString()
  }

  private isOpponentPresent(
    users: PresenceMessage[],
    opponentId: string
  ): boolean {
    const session = Session.getInstance()
    return users.some(
      (u) =>
        u.userId === opponentId &&
        u.tableId === (this.currentTableId || session.tableId)
    )
  }

  private isTwoPlayerGame(): boolean {
    const session = Session.getInstance()
    const opponentId = session.opponentClientId
    // practiceMode defaults to true for every rule except nineball, so it
    // cannot be used here — a real opponent is identified by opponentClientId.
    return (
      !!opponentId &&
      opponentId !== "bot" &&
      !session.botMode &&
      !session.spectator &&
      !this.replayMode
    )
  }

  private handleOpponentStatusChange(
    wasOnline: boolean | null,
    opponentId: string
  ): void {
    const isOnline = this.opponentOnline === true
    const hadBeenSeen = this.opponentSeen
    if (isOnline) {
      this.opponentSeen = true
    }
    if (wasOnline !== false && this.opponentOnline === false) {
      NetworkLogger.logLobby(`opponent offline: ${opponentId}`)
    }
    // Only announce real transitions: an initial offline read (no opponent in
    // the lobby yet) must not look like a disconnect, and the opponent's first
    // appearance must not look like a reconnect. Chat is informational —
    // sending is deliberately left enabled.
    if (!this.isTwoPlayerGame()) return
    if (wasOnline === true && !isOnline) {
      this.onChatMessage?.("🔌")
    } else if (wasOnline === false && isOnline && hadBeenSeen) {
      this.onChatMessage?.("⚡")
    }
  }

  async stop(): Promise<void> {
    this.cancelScheduledLeave()
    try {
      globalThis.removeEventListener?.("offline", this.offlineHandler)
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
