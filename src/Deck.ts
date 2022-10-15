class Deck {
    private deck: number[]
    constructor(numberOfPlayers) {
        // put the cards in the deck
        if (numberOfPlayers == 2) {
            // We need 2 equal decks
            for (let i = 0; i < 9; i++) {
                this.deck.push(i + 1)
                this.deck.push(i + 1)
            }
        } else {
            console.log("todo deck")
        }
    }
}

export default Deck