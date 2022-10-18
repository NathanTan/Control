// compile with npx tsc
import Config from "./Interfaces/Config"
import Status from "./Interfaces/Status"
import Player from "./Player"
import PlayerData from "./Interfaces/PlayerData"
import Card from "./Interfaces/Card"
import Action from "./Enums/Action"

class Control {
    public players: Player[]
    public turn: number
    private numberOfPlayers: number
    private gameOver: boolean
    private testing?: boolean
    constructor(config: Config) {
        // todo: validate config
        
        this.turn = 0
        this.numberOfPlayers = config.numberOfPlayers
        this.gameOver = false
        this.testing = config.testing ?? false

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

    public conductTurn(playersAction: Action, card?: Card) {
        const playersTurn = this.turn % this.numberOfPlayers // The index of which player's turn it is

        // Draw, except on the first players first turn
        if (this.numberOfPlayers == 2 && this.turn > 0) {
            this.players[playersTurn].draw()
        }

        // Get user's move

        // executeMove
        this.players[playersTurn].runAction(playersAction, card)
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
}

export default Control