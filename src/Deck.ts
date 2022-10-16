import Card from "./Card"
import CardType from "./Enums/CardType"

// For 2 players the deck will exist within the player and both players will have even decks
// For a 3-4 player game the players will all share a deck double the size of a deck from the /2 player game 

class Deck {
    private deck: Card[]
    constructor(numberOfPlayers: number) {
        this.deck = [] as Card[]

        const multiplier = (numberOfPlayers == 2) ? 1 : 2

        // Put the cards in the deck
        // Adding the Stable Fuel
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 2 * multiplier; j++) {
                this.deck.push({number: i + 1, type: CardType.Stable} as Card)
            }
        }
        // Adding the Unstable Fuel
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 2 * multiplier; j++) {
                this.deck.push({number: i + 4, type: CardType.Unstable} as Card)
            }
        }
    }

    public drawCard(): Card | undefined {
        return this.deck.pop()
    }
}

export default Deck