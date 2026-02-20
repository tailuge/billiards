import { id } from "../../utils/dom";
import { Session } from "../client/session";

export interface LogEntry {
  timestamp: number;
  direction: "in" | "out" | "info";
  message: string;
}

export class Logger {
  element: HTMLDivElement;
  logElement: HTMLPreElement;
  entries: LogEntry[] = [];
  visible: boolean = false;
  maxEntries: number = 50;

  constructor() {
    this.element = id("botDebugOverlay") as HTMLDivElement;
    this.logElement = id("botDebugLog") as HTMLPreElement;
    this.hide();

    const botMode = Session.hasInstance() && Session.isBotMode();
    if (botMode) {
      this.info("Bot mode activated");
      this.show();
    }

    const clearButton = document.getElementById("botDebugClear");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        this.clear();
      });
    }
  }

  toggle() {
    this.visible = !this.visible;
    if (this.visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    this.visible = true;
    if (this.element) {
      this.element.style.display = "block";
    }
  }

  hide() {
    this.visible = false;
    if (this.element) {
      this.element.style.display = "none";
    }
  }

  log(direction: "in" | "out" | "info", message: string) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      direction,
      message: `${message.substring(0, 50)}...`,
    };
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
    this.render();
  }

  info(message: string) {
    this.log("info", message);
  }

  incoming(message: string) {
    this.log("in", message);
  }

  outgoing(message: string) {
    this.log("out", message);
  }

  clear() {
    this.entries = [];
    this.render();
  }

  private render() {
    if (!this.logElement) return;

    const lines = this.entries.map((entry) => {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      let prefix: string;
      let color: string;

      if (entry.direction === "in") {
        prefix = "←";
        color = "#4ade80";
      } else if (entry.direction === "out") {
        prefix = "→";
        color = "#60a5fa";
      } else {
        prefix = "•";
        color = "#fbbf24";
      }

      return `<span style="color: ${color}">[${time}] ${prefix}</span> ${this.escapeHtml(entry.message)}`;
    });

    this.logElement.innerHTML = lines.join("\n");
    this.logElement.scrollTop = this.logElement.scrollHeight;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
