export interface Controller {
    handleInputEvent(event: String): Controller
    handleGameEvent(event: String): Controller
    advance(deltat: Number): Controller
}