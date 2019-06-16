import { EventType } from "./eventtype"
import { GameEvent } from "./gameevent"
import { AimEvent } from "./aimevent"
import { AbortEvent } from "./abortevent"

export class EventUtil {

    static serialise(event: GameEvent) {
        return JSON.stringify(event)
    }

    static fromSerialised(data: string) {
        let json = JSON.parse(data);
        switch (json.type) {
            case EventType.AIM:
                return new AimEvent()
            case EventType.ABORT:
                return new AbortEvent()
            default:
                throw Error("Unknown GameEvent :" + data)
        }
    }
}