var assert = require('assert')  
import Control from "../src/Control"
import Status from "../src/Interfaces/Status"
import Config from "../src/Interfaces/Config"


const config = {
    numberOfPlayers: 2,
    playerNames: ["bot1", "bot2"]
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
}) 