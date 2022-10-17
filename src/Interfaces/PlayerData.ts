import Card from "./Card"

interface PlayerData {
    name: string
    hand: string[]
    field: string[]
    discardPile: string[]
    deckSize: number
}

export default PlayerData