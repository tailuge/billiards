import { MessageRelay } from "../client/messagerelay";
import { BotDebugOverlay } from "./overlay";
import { BeginEvent } from "../../events/beginevent";
import { EventUtil } from "../../events/eventutil";

export class BotMessageRelay implements MessageRelay {
  private messageQueue: string[] = [];
  private callback: ((message: string) => void) | null = null;
  private logs: BotDebugOverlay;

  constructor() {
    this.logs = new BotDebugOverlay();
  }

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix?: string,
  ): void {
    this.callback = callback;
    this.logs.info(`BotMessageRelay subscribed to ${prefix || ""}${channel}`);

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.callback) {
        this.callback(message);
      }
    }

    setTimeout(() => {
      const beginEvent = EventUtil.serialise(new BeginEvent());
      this.logs.incoming(`Bot joining: BeginEvent`);
      callback(beginEvent);
    }, 0);
  }

  publish(channel: string, message: string, prefix?: string): void {
    this.logs.outgoing(
      `Publish to ${prefix || ""}${channel}: ${message.substring(0, 50)}...`,
    );

    this.messageQueue.push(message);

    if (this.callback) {
      setTimeout(() => {
        this.callback?.(message);
      }, 0);
    }
  }

  async getOnlineCount(): Promise<number | null> {
    return 2;
  }

  queueMessage(message: string): void {
    this.messageQueue.push(message);
    this.logs.incoming(`Queued: ${message.substring(0, 50)}...`);
  }
}
