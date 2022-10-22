import Action from "../Enums/Action"
import Card from "./Card"

// The information required to conduct a turn
interface TurnData {
    action: Action,
    targetPlayerId: number,
    card?: Card,                         // The card to be used
    playersThatCanInterrupt: number[]   // A list of the playerIds that can use TimeStop
}

export default TurnData