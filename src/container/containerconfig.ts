import { Keyboard } from "../events/keyboard"
import { MessageRelay } from "../network/client/messagerelay"
import { ScoreReporter } from "../network/client/scorereporter"

export interface ContainerConfig {
  element: any
  log: (text: string) => void
  assets: any
  ruletype?: string
  keyboard?: Keyboard
  id?: string
  relay?: MessageRelay | null
  scoreReporter?: ScoreReporter | null
}
