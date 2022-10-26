import Deck from "./Deck"
import Action from "./Enums/Action"
import PlayResult from "./PlayResult"
import Card from "./Interfaces/Card"
import CardConstants from "./Constants/CardConstants"
import CardType from "./Enums/CardType"
import TurnData from "./Interfaces/TurnData"

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
    private logging?: boolean
    private debug?: boolean
    private interruptionCards = [9]

    constructor(name: string, numberOfPlayers: number, playerIndex: number, testing: boolean, deck?: Deck, logging?: boolean, debug?: boolean) {
        this.name = name
        this.numberOfPlayers = numberOfPlayers
        this.deck = (numberOfPlayers == 2) ? new Deck(numberOfPlayers, testing) : null
        this.hand = [] as Card[]
        this.field = [] as Card[]
        this.graveyard = [] as Card[]
        this.turnActions = [] as Action[]
        this.playerIndex = playerIndex
        this.testing = testing
        this.logging = logging
        this.debug = debug
        //@ts-ignore
        this.drawInitalHand(this.deck ?? deck) // one of these will have a deck depending on the number of players
    }

    public draw(deck?: Deck) {  
        if (deck === null || deck === undefined) {
            let card: Card | undefined
            if (this.deck !== null) {
                if (this.debug) console.log(`[DEBUG] Draw`)
                
                card = this.deck.drawCard()
                if (card !== undefined) {
                    this.hand.push(card)
                }
            }
        }
    }

    public runAction(turnData: TurnData): PlayResult | undefined {
        // Check if the card is not in the hand
        // Validation
        let cardPosition = this.checkHandForCard(turnData.card)
        
        if (turnData.action !== Action.Draw && (turnData.card === undefined || turnData.card === null || cardPosition === -1)) {
            return undefined
        }

        let result = undefined

        switch (turnData.action) {
            case Action.Draw:
                if (this.numberOfPlayers == 2)
                    this.drawFromPersonalDeck()
                else {
                    console.log("TODO drawFromGroupDeck")
                    this.draw() // TODO: pass in group deck
                }
                break
            case Action.Play:
                if (turnData.card)
                    this.play(turnData.card, cardPosition) // TODO fix fallback
                else {
                    console.log("[ERROR] No card to play")
                }
                break
            case Action.Activate:
                // Validation todo - validate in Control object
                if (turnData.card !== undefined && CardConstants.CardsThatCanBeDiscarded.indexOf(turnData.card.number) == -1) {
                    console.log("[ERROR] Cannot discard a stable fuel for effect now")
                    break
                }

                // Discard
                this.discardTryActivate(turnData.card ?? {} as Card) // TODO fix fallback
                break
            case Action.Diffuse:
                result = this.diffuse(turnData.card ?? {} as Card) // TODO fix fallback
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

    public hasInterruption(): boolean {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.interruptionCards.indexOf(this.hand[i].number) !== -1) {
                return true
            }
        }

        return false
    }

    public recieveDiffuse(card?: Card) {
        if (this.debug) console.log(`[DEBUG] Recieving diffuse card=${JSON.stringify(card)}`)
        if (card) {
            const cardExists = this.checkArrayForCard(this.field, card)
            if (this.debug) console.log(`[DEBUG] Card to diffuse at location=${JSON.stringify(cardExists)}`)


            if(cardExists >= 0) {
                this.field.splice(cardExists, 1)
                this.graveyard.push(card)
            }
        }
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
                if (this.logging && this.debug) console.log(`[DEBUG] No effect to activate for card {${card.number} ${card.type}}`)
        }
        
        result.success = true
            
        return result
    }

    private discardTryActivate(card: Card) {
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
                if (this.logging && this.debug) console.log("[DEBUG] Activate 8")
                break
            default:
                console.log("[DEBUG] No effect to activate")
        }
    }

    // Discard a card and later in the Control class, destory a card on your opponents 
    // field of equal or lower value
    private diffuse(card: Card): PlayResult {
        if (this.debug) console.log(`[DEBUG] diffuse card ${JSON.stringify(card)}`)
        const result = {success: false, next: undefined, playersScore: -1, diffuseValue: card.number } as PlayResult

        // const targetCardPostion = this.checkArrayForCard(targetField, card)
        // if (targetCardPostion === -1)
            // return result // Return with success = false

        // Discard the card
        const position = this.checkHandForCard(card)
        const discardedCard = this.hand.splice(position, 1)[0]
        this.graveyard.push(discardedCard)

        result.success = true
        result.diffuseValue = discardedCard.number

        return result
    }

    private drawInitalHand(deck: Deck) {  
        const handCount = 4
        for (let i = 0; i < handCount; i++) {
            const card = deck.drawCard()
            this.hand.push(card ?? {number: -1, type: -1})
        }
    }

    public checkHandForCard(card?: Card): number {
        if (card)
            for (let i = 0; i < this.hand.length; i++) {
                if (this.hand[i].number === card.number && this.hand[i].type === card.type)
                    return i
            }
        return -1
    }

    // Discard a card from the players hand by index
    public discardCard(cardPosition: number) {
        if (this.logging) console.log(`Discarding card ${JSON.stringify(this.hand[cardPosition])}`)
        this.graveyard.push(this.hand[cardPosition])
        this.hand.splice(cardPosition, 1)
    }

    // For executing the effect of an 8 action
    public wipeBoard() {
        for (let i = 0; i < this.field.length; i++) {
            this.graveyard.push(this.field[i])
        }
        this.field = []
    }

    private checkArrayForCard(arr: Card[], card?: Card): number {
        if (card)
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].number === card.number && arr[i].type === card.type)
                    return i
            }
        return -1
    }
}

export default Player