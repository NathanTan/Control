var assert = require('assert')  
import Control from "../src/Control"
import Config from "../src/Interfaces/Config"
import PlayerData from "../src/Interfaces/PlayerData"


const config = {
    numberOfPlayers: 2,
    playerNames: ["bot1", "bot2"],
    testing: true
} as Config

describe('Control config handling', () => {
    it('Handles inital drawing for a 2 player game', () => {
        const game = new Control(config)
        const expectedPlayer0Data = {
            name: "bot1",
            deckSize: 20,
            hand: ["10 u","10 u","9 u","9 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data = {
            name: "bot2",
            deckSize: 20,
            hand: ["10 u","10 u","9 u","9 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        assert.strictEqual(JSON.stringify(expectedPlayer0Data),
            JSON.stringify(game.getPlayerData(0)))
        
        assert.strictEqual(JSON.stringify(expectedPlayer1Data),
            JSON.stringify(game.getPlayerData(1)))
    })
}) 