import { Session } from "./session";
import { LOBBY_URL } from "../../utils/gameover";

export interface RematchInfo {
  opponentId: string;
  opponentName: string;
  ruleType: string;
  lastScores: { userId: string; score: number }[];
  nextTurnId: string;
}

export class Rematch {
  static fromURL(params: URLSearchParams): RematchInfo | undefined {
    const rematchParam = params.get("rematch");
    if (!rematchParam) return undefined;
    try {
      return JSON.parse(decodeURIComponent(rematchParam));
    } catch (e) {
      console.error("Failed to parse rematch info", e);
      return undefined;
    }
  }

  static update(
    session: Session,
    rulename: string,
    amIWinner: boolean,
    isSinglePlayer: boolean,
  ) {
    if (!session?.clientId) return;
    if (isSinglePlayer || session.botMode) return;

    const opponentId = session.opponentClientId || "opponent";
    const winnerId = amIWinner ? session.clientId : opponentId;
    const loserId = amIWinner ? opponentId : session.clientId;

    if (session.rematchInfo) {
      session.rematchInfo.lastScores.forEach((s) => {
        if (s.userId === winnerId) {
          s.score++;
        }
      });
      session.rematchInfo.nextTurnId = loserId;
    } else {
      const opponentName = session.opponentName || "Opponent";
      session.rematchInfo = {
        opponentId,
        opponentName,
        ruleType: rulename,
        lastScores: [
          { userId: session.clientId, score: amIWinner ? 1 : 0 },
          { userId: opponentId, score: amIWinner ? 0 : 1 },
        ],
        nextTurnId: loserId,
      };
    }
  }

  static getOrderedScores(session: Session): { p1: number; p2: number } {
    if (!session.rematchInfo) return { p1: 0, p2: 0 };
    const sMe =
      session.rematchInfo.lastScores.find((s) => s.userId === session.clientId)
        ?.score ?? 0;
    const sThem =
      session.rematchInfo.lastScores.find((s) => s.userId !== session.clientId)
        ?.score ?? 0;
    return session.playerIndex === 0
      ? { p1: sMe, p2: sThem }
      : { p1: sThem, p2: sMe };
  }

  static getMatchScoreText(
    session: Session,
    names: { p1Name?: string | undefined; p2Name?: string | undefined },
  ): string {
    if (!session.rematchInfo) return "";
    const scores = this.getOrderedScores(session);
    return `
      <div class="match-score-container">
        <div class="match-score-label">MATCH SCORE</div>
        <div class="match-score-value">${names.p1Name || "Player 1"} ${scores.p1} — ${scores.p2} ${names.p2Name || "Player 2"}</div>
      </div>
    `.trim();
  }

  static navigate(session: Session) {
    this.redirectToLobby(session.rematchInfo, session);
  }

  static redirectToLobby(rematchInfo?: RematchInfo, session?: Session) {
    const queryParams = new globalThis.URLSearchParams();
    if (session) {
      queryParams.set("userId", session.clientId);
      queryParams.set("userName", session.playername);
    }
    if (rematchInfo) {
      queryParams.set("rematch", JSON.stringify(rematchInfo));
    }
    const queryString = queryParams.toString();
    globalThis.location.href = queryString
      ? `${LOBBY_URL}?${queryString}`
      : LOBBY_URL;
  }
}
