var assert = require('assert')  
import Control from "../src/Control"
import Status from "../src/Interfaces/Status"
import Config from "../src/Interfaces/Config"
import PlayerData from "../src/Interfaces/PlayerData"


const config = {
    numberOfPlayers: 2,
    playerNames: ["bot1", "bot2"],
    testing: true
} as Config

describe('Control config handling', () => {
    it('Handles a normal config', () => {
        const game = new Control(config)
        const expectedStatus = {
            turnCount:  0,
            turn:       0,
            gameOver:   false
        } as Status

        assert.strictEqual(JSON.stringify(expectedStatus),
            JSON.stringify(game.getStatus()))
    })

    it('Handles playing a 10', () => {
        const game = new Control(config)
        const expectedPlayer0Data = {
            name: "bot1",
            deckSize: 18,
            hand: ["10 u","10 u","9 u","9 u", "8 u", "8 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data = {
            name: "bot2",
            deckSize: 17,
            hand: ["10 u","10 u","9 u","9 u", "8 u", "8 u", "7 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        game.conductTurn()
        game.conductTurn()

        assert.strictEqual(JSON.stringify(expectedPlayer0Data),
            JSON.stringify(game.getPlayerData(0)))
        
        assert.strictEqual(JSON.stringify(expectedPlayer1Data),
            JSON.stringify(game.getPlayerData(1)))
    })
}) 