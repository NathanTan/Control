var assert = require('assert')  
import Control from "../../src/Control"
import Status from "../../src/Interfaces/Status"
import Card from "../../src/Interfaces/Card"
import Config from "../../src/Interfaces/Config"
import PlayerData from "../../src/Interfaces/PlayerData"
import Action from "../../src/Enums/Action"
import CardType from "../../src/Enums/CardType"


const config = {
    numberOfPlayers: 2,
    playerNames: ["bot1", "bot2"],
    testing: true
} as Config

const c = (value: number, type: CardType): Card => {
    return {number: value, type: type} as Card
}

describe('Control config handling', () => {
    it('Handles a normal config', () => {
        const game = new Control(config)
        const expectedStatus = {
            turnCount:  0,
            turn:       0,
            gameOver:   false,
            lastTurnWasSuccessful: false,
            turnIsOngoing: false
        } as Status

        const expectedPlayer0Data_0 = {
            name: "bot1",
            deckSize: 20,
            hand: ["10 u","10 u","9 u","9 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data_0 = {
            name: "bot2",
            deckSize: 20,
            hand: ["10 u","10 u","9 u","9 u",],
            field: [""],
            discardPile: [""]
        } as PlayerData

        assert.strictEqual(JSON.stringify(expectedStatus),
            JSON.stringify(game.getStatus()))
        assert.strictEqual(JSON.stringify(expectedPlayer0Data_0),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_0),
            JSON.stringify(game.getPlayerData(1)))
    })

    it('Handles Drawing Action', () => {
        const game = new Control(config)
        const expectedPlayer0Data = {
            name: "bot1",
            deckSize: 19,
            hand: ["10 u","10 u","9 u","9 u", "8 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data = {
            name: "bot2",
            deckSize: 18,
            hand: ["10 u","10 u","9 u","9 u", "8 u", "8 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedGameStatus = {
            turnCount: 2,
            turn: 0,
            gameOver: false,
            lastTurnWasSuccessful: true,
            turnIsOngoing: false
        } as Status

        game.conductTurn(Action.Draw)
        game.conductTurn(Action.Draw)

        assert.strictEqual(JSON.stringify(expectedPlayer0Data),
            JSON.stringify(game.getPlayerData(0)))
        
        assert.strictEqual(JSON.stringify(expectedPlayer1Data),
            JSON.stringify(game.getPlayerData(1)))
        
        assert.strictEqual(JSON.stringify(expectedGameStatus),
            JSON.stringify(game.getStatus()))
    })

    
    it('Handles Playing Action', () => {
        const game = new Control(config)
        const expectedPlayer0Data = {
            name: "bot1",
            deckSize: 20,
            hand: ["10 u", "9 u", "9 u"],
            field: ["10 u"],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data = {
            name: "bot2",
            deckSize: 18,
            hand: ["10 u", "10 u", "9 u", "9 u", "8 u", "8 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedGameStatus = {
            turnCount: 2,
            turn: 0,
            gameOver: false,
            lastTurnWasSuccessful: true,
            turnIsOngoing: false
        } as Status

        game.conductTurn(Action.Play, c(10, CardType.Unstable))
        game.conductTurn(Action.Draw)

        assert.strictEqual(JSON.stringify(expectedPlayer0Data),
            JSON.stringify(game.getPlayerData(0)))
        
        assert.strictEqual(JSON.stringify(expectedPlayer1Data),
            JSON.stringify(game.getPlayerData(1)))
        
        assert.strictEqual(JSON.stringify(expectedGameStatus),
            JSON.stringify(game.getStatus()))
    })
}) 