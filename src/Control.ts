// compile with npx tsc
import Config from "./Interfaces/Config"
import Status from "./Interfaces/Status"
import Player from "./Player"
import PlayerData from "./Interfaces/PlayerData"

class Control {
    public players: Player[]
    public turn: number
    private numberOfPlayers: number
    private gameOver: boolean
    constructor(config: Config) {
        // todo: validate config
        
        this.turn = 0
        this.numberOfPlayers = config.numberOfPlayers
        this.gameOver = false

        this.players = [] as Player[]
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.players.push(new Player(config.playerNames[i], this.numberOfPlayers))
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
        playerData.deckSize = playerDeckSize ?? 0
        playerData.hand = player.getHand().split(" ")
        playerData.field = player.getField().split(" ")
        playerData.discardPile = player.getDiscardPile().split(" ")

        return playerData
    }
}

export default Control