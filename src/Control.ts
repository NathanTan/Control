// compile with npx tsc
import Config from "./Interfaces/Config"
import Status from "./Interfaces/Status"
import Player from "./Player"
import PlayerData from "./Interfaces/PlayerData"
import Card from "./Interfaces/Card"
import Action from "./Enums/Action"
import TurnData from "./Interfaces/TurnData"
import CardType from "./Enums/CardType"

class Control {
    public players: Player[]
    public turn: number
    private numberOfPlayers: number
    private gameOver: boolean
    private lastTurnWasSuccessful = false
    private turnIsOngoing = false
    private testing?: boolean
    private logging?: boolean
    private debug?: boolean
    private buffer: any[]

    private handLimit = 7

    // The id/index of the player that is forced to discard down to the hand limit. No player can play while a discard is required
    private forceDiscard = -1 

    constructor(config: Config) {
        // todo: validate config
        
        this.turn = 0
        this.numberOfPlayers = config.numberOfPlayers
        this.gameOver = false
        this.testing = config.testing ?? false
        this.logging = config.logging ?? false
        this.debug = config.logging ?? false
        this.buffer = [] 

        this.players = [] as Player[]
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.players.push(new Player(config.playerNames[i], this.numberOfPlayers, i, this.testing, undefined, this.logging, this.debug))
        }

    }

    public getStatus(): Status {
        const status = {} as Status
        status.turnCount = this.turn
        status.turn = this.turn % this.numberOfPlayers
        status.gameOver = this.gameOver
        status.lastTurnWasSuccessful = this.lastTurnWasSuccessful
        status.turnIsOngoing = this.turnIsOngoing

        return status
    }

    public getPlayerData(playerNumber: number): PlayerData {
        const playerData = {} as PlayerData
        const player = this.players[playerNumber]
        const playerDeckSize = player.deck?.getDeckSize()
        playerData.name = player.name
        playerData.deckSize = playerDeckSize ?? 0
        playerData.hand = player.getHand().split(",")
        playerData.field = player.getField().split(",")
        playerData.discardPile = player.getDiscardPile().split(",")

        return playerData
    }

    /*
     * Parameters:
     *  playersAction    - The type of action a player will conduct this turn
     *  card             - The card to be used from the player's hand if the action requires it
     *  targetPlayer     - The id/index of the player affected by a potential effect/diffuse this turn
     *  targetCard       - The target card of an activated effect. (Usually for destruction)
    */
    public conductTurn(playersAction: Action, card?: Card, targetPlayer?: number, targetCard?: Card, opponentCanNegate?: boolean) {
        const playersTurn = this.turn % this.numberOfPlayers // The index of which player's turn it is
        if (this.logging) console.log(`Conducting Player ${playersTurn}'s turn`)


        // Validation
        if (playersAction === Action.Diffuse) {
            if (!card || !targetCard) {
                this.lastTurnWasSuccessful = false
                return
            }
            if (card.number < targetCard?.number) {
                this.lastTurnWasSuccessful = false
                return
            }
        }
        if (this.forceDiscard > -1) {
            return
        }


        // Draw, except on the first players first turn
        if (this.numberOfPlayers == 2 && this.turn > 0) {
            if (this.logging) console.log(`\nPlayer ${playersTurn} draws`)
            this.players[playersTurn].draw()
        }

        // Get user's move

        const turnData = this.createTurnData(playersAction, card)
        if (this.logging && this.debug) console.log(`[DEBUG] TurnData: ${JSON.stringify(turnData)}`)
        

        // executeMove
        let result = this.players[playersTurn].runAction(turnData)
        if (this.logging && this.debug) console.log(`[DEBUG] here ${playersTurn}`)

        if (result && result.diffuseValue > 0) {
            this.players[turnData.targetPlayerId].recieveDiffuse(targetCard)
        }

        // post Activations
        if (turnData.action === Action.Activate && turnData.card)
        switch (turnData.card.number) {
            case 8:
                for (let i = 0; i < this.players.length; i++) {
                    this.players[i].wipeBoard()
                }
                break
            default:
                break
        }


        //      Allow for interuption
        // Check if the game is over
        let gameIsOver = false
        for (let i = 0; i < this.numberOfPlayers; i++) {
            const playerScore = this.players[i].field.reduce((total, card) => {
                return total + card.number;
            }, 0)
            if (playerScore >= 21) 
                gameIsOver = true
        }


        /* 
         * Leave the turn "hanging" if
         *      - 7 or more cards in the hand
         *      - "4 u", "5 u", "6 u", or "7 u" is played
         *      - "9 u" is playable by an opponen
         */

        // Discard if the player has more cards than the hand limit.
        this.checkHandLimit(playersTurn)
        


        // Increment turn
        if (!this.turnIsOngoing) {
            this.turn++
            this.lastTurnWasSuccessful = true
        }

    }

    public continueTurn() {

    }

    public move(card: Card, action: Action) {
    }

    /*
     * Parameters:
     *  player  - The id/index of the player to discard a card
     *  card    - The card to be discarded
     */
    public forcedDiscard(player: number, card: Card) {
        if (this.forceDiscard > -1 && this.cardIsValid(card)) {
            this.discard(player, card)
            // this.turn++
            // this.turnIsOngoing = false
            // this.forceDiscard = -1 // All good, no players need to discard any cards

            this.checkHandLimit(player)

            if (!this.turnIsOngoing) {
                this.turn++
            }


        }
    }

    /*
     * Parameters:
     *  player  - The id/index of the player to discard a card
     *  card    - The card to be discarded
     */
    private discard(player: number, card: Card) {
        if (this.logging) console.log(`Discarding card=${JSON.stringify(card)}`)
        const cardPosition = this.players[player].checkHandForCard(card)
        if (cardPosition > -1) {
            this.players[player].discardCard(cardPosition)
        }

        // Check all the players for the hand limit
        for (let i = 0; i < this.players.length; i++) {
            if (this.getPlayerData(i).hand.length > 7) {
                this.forceDiscard = i
                return
            }
        }
    }
    



    private createTurnData(action: Action, card?: Card): TurnData {
        let targetPlayer = -1
        let playersThatCanInterrupt = [] as number[]

        switch (action) {
            case Action.Draw:
                break
            case Action.Play:
                break
            case Action.Activate:
                for (let i = 0; i < this.numberOfPlayers; i++) {
                    if (this.players[i].hasInterruption()) 
                        playersThatCanInterrupt.push(i)
                }
            case Action.Diffuse:
                targetPlayer = this.determineTargetPlayer()
            default:
                break
        }


        const turnData = {
            action: action,
            targetPlayerId: targetPlayer,
            card: card,
            playersThatCanInterrupt: playersThatCanInterrupt
        } as TurnData

        return turnData
    }

    // Determine the target player
    private determineTargetPlayer(): number {
        // If there are only 2 players, make the other player the target
        if (this.numberOfPlayers === 2) {
            return ((this.turn % 2) === 0) ? 1 : 0
        } else if (this.numberOfPlayers >= 3) {
            console.log("[ERROR]: 3/4 player mode is not yet released.")
        }
        return -1
    }

    // Validate that the card is legal
    private cardIsValid(card?: Card): boolean {
        if (card) {
            if (card.number < 0 || card.number > 10) {
                return false
            } 
            if (card.type !== CardType.Stable && card.type !== CardType.Unstable) {
                return false
            }
        } else {
            return false
        }

        return true
    }

    /*
     * Parameters:
     *  playersTurn  - The id/index of the player's hand to check
     */
    private checkHandLimit(playersTurn: number) {
        if (this.getPlayerData(playersTurn).hand.length > 7) {
            if (this.logging && this.debug) console.log(`[DEBUG] Player ${playersTurn} has ${this.getPlayerData(playersTurn).hand.length} cards. Forcing discard`)
            this.forceDiscard = playersTurn
            this.turnIsOngoing = true
        } else {
            this.forceDiscard = -1
            this.turnIsOngoing = false
        }
    }
}

export default Control