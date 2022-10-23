// compile with npx tsc
import Config from "./Interfaces/Config"
import Status from "./Interfaces/Status"
import Player from "./Player"
import PlayerData from "./Interfaces/PlayerData"
import Card from "./Interfaces/Card"
import Action from "./Enums/Action"
import TurnData from "./Interfaces/TurnData"

class Control {
    public players: Player[]
    public turn: number
    private numberOfPlayers: number
    private gameOver: boolean
    private testing?: boolean
    private logging?: boolean
    private debug?: boolean

    constructor(config: Config) {
        // todo: validate config
        
        this.turn = 0
        this.numberOfPlayers = config.numberOfPlayers
        this.gameOver = false
        this.testing = config.testing ?? false
        this.logging = config.logging ?? false
        this.debug = config.logging ?? false

        this.players = [] as Player[]
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.players.push(new Player(config.playerNames[i], this.numberOfPlayers, i, this.testing))
        }

    }

    public getStatus(): Status {
        const status = {} as Status
        status.turnCount = this.turn
        status.turn = this.turn % this.numberOfPlayers
        status.gameOver = this.gameOver

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
    public conductTurn(playersAction: Action, card?: Card, targetPlayer?: number, targetCard?: Card) {
        const playersTurn = this.turn % this.numberOfPlayers // The index of which player's turn it is
        if (this.logging) console.log(`Conducting Player ${playersTurn}'s turn`)


        // Draw, except on the first players first turn
        if (this.numberOfPlayers == 2 && this.turn > 0) {
            if (this.logging) console.log(`Player ${playersTurn} draws`)
            this.players[playersTurn].draw()
        }

        // Get user's move

        const turnData = this.createTurnData(playersAction, card)

        // executeMove
        let result = this.players[playersTurn].runAction(turnData)
        if (result && result.diffuseValue > 0) {
            this.players[turnData.targetPlayerId].recieveDiffuse(targetCard)
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

        // Increment turn
        this.turn++
    }

    public move(card: Card, action: Action) {
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
}

export default Control