import Deck from "./Deck"
import Action from "./Enums/Action"
import PlayResult from "./PlayResult"
import Card from "./Interfaces/Card"
import CardConstants from "./Constants/CardConstants"
import CardType from "./Enums/CardType"

class Player {
    public name: string
    public hand: Card[]
    public deck: Deck | null
    public field: Card[]
    public graveyard: Card[]
    public turnActions: Action[]
    private numberOfPlayers: number
    private playerIndex: number
    private testing: boolean

    constructor(name: string, numberOfPlayers: number, playerIndex: number, testing: boolean, deck?: Deck) {
        this.name = name
        this.numberOfPlayers = numberOfPlayers
        this.deck = (numberOfPlayers == 2) ? new Deck(numberOfPlayers, testing) : null
        this.hand = [] as Card[]
        this.field = [] as Card[]
        this.graveyard = [] as Card[]
        this.turnActions = [] as Action[]
        this.playerIndex = playerIndex
        this.testing = testing
        //@ts-ignore
        this.drawInitalHand(this.deck ?? deck) // one of these will have a deck depending on the number of players
    }

    public draw(deck?: Deck) {  
        if (deck === null || deck === undefined) {
            let card: Card | undefined
            if (this.deck !== null) {
                card = this.deck.drawCard()
                if (card !== undefined) {
                    this.hand.push(card)
                }
            }
        }
    }

    public runAction(action: Action, card?: Card): PlayResult | undefined {
        // Check if the card is not in the hand
        // Validation
        let cardPosition = this.checkHandForCard(card)
        
        if (action !== Action.Draw && (card === undefined || card === null || cardPosition === -1)) {
            return undefined
        }

        let result = undefined

        switch (action) {
            case Action.Draw:
                if (this.numberOfPlayers == 2)
                    this.drawFromPersonalDeck()
                else {
                    console.log("TODO drawFromGroupDeck")
                    this.draw() // TODO: pass in group deck
                }
                break
            case Action.Play:
                if (card)
                    this.play(card, cardPosition) // TODO fix fallback
                else {
                    console.log("[ERROR] No card to play")
                }
                break
            case Action.Activate:
                // Validation
                if (card !== undefined && CardConstants.CardsThatCanBeDiscarded.indexOf(card.number) == -1) {
                    console.log("[ERROR] Cannot discard a stable fuel for effect now")
                    break
                }

                // Discard
                this.discard(card ?? {} as Card) // TODO fix fallback
                break
            case Action.Diffuse:
                result = this.diffuse(card ?? {} as Card) // TODO fix fallback
                break
        }

        return result
        
    }

    public getHand(): string {
        return this.hand.map(c => c.number + " " + ((c.type === CardType.Stable) ? "s" : "u") ).join(",")
    }

    public getField(): string {
        return this.field.map(c => c.number + " " + ((c.type === CardType.Stable) ? "s" : "u")).join(",")
    }

    public getDiscardPile(): string {
        return this.graveyard.map(c => c.number + " " + ((c.type === CardType.Stable) ? "s" : "u")).join(",")
    }

    private drawFromPersonalDeck() {
        const drawnCard = this.deck?.drawCard()
        if (drawnCard !== undefined && drawnCard !== null)
            this.hand.push(drawnCard)
    }

    // handPosition is the position of the card in the hand
    private play(card: Card, handPosition: number): PlayResult {
        const result = {success: false, next: undefined, playersScore: -1 } as PlayResult

        // Remove the card from the hand
        this.hand.splice(handPosition, 1)

        // Play the card on the field
        this.field.push(card as Card)

        // Potentially activate the card
        switch(card.number) {
            case 1:
                console.log("[DEBUG] Activate 1")
                break
            case 2:
                console.log("[DEBUG] Activate 2")
                break
            case 4:
                console.log("[DEBUG] Activate 4")
                break
            default:
                console.log(`[DEBUG] No effect to activate for card {${card.number} ${card.type}}`)
        }
        
        result.success = true
            
        return result
    }

    private discard(card: Card) {
        this.hand.sort((a, b) => a.number - b.number)
        const position = this.hand.indexOf(card)
        this.graveyard.push(this.hand.splice(position, 1)[0])

        // Activate the effect
        switch(card.number) {
            case 4:
                console.log("[DEBUG] Activate 4")
                break
            case 5:
                console.log("[DEBUG] Activate 5")
                break
            case 6:
                console.log("[DEBUG] Activate 6")
                break
            case 7:
                console.log("[DEBUG] Activate 7")
                break
            case 8:
                console.log("[DEBUG] Activate 8")
                break
            default:
                console.log("[DEBUG] No effect to activate")
        }
    }

    private diffuse(card: Card): PlayResult {
        const result = {success: false, next: undefined, playersScore: -1 } as PlayResult

        this.hand.sort((a, b) => a.number - b.number)
        const position = this.hand.indexOf(card)
        const discardedCard = this.hand.splice(position, 1)[0]
        this.graveyard.push(discardedCard)

        result.success = true
        result.diffuseValue = discardedCard.number

        return result
    }

    private drawInitalHand(deck: Deck) {  
        const handCount = (this.playerIndex === 0) ? 4 : 5
        for (let i = 0; i < handCount; i++) {
            const card = deck.drawCard()
            this.hand.push(card ?? {number: -1, type: -1})
        }
    }

    private checkHandForCard(card?: Card): number {
        if (card)
            for (let i = 0; i < this.hand.length; i++) {
                if (this.hand[i].number === card.number && this.hand[i].type === card.type)
                    return i
            }
        return -1
    }
}

export default Player