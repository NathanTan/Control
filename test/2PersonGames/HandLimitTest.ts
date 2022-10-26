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

describe('Discarding an 8 handling', () => {

    it('Prevents an illegal forcedDiscard', () => {
        const game = new Control(config)
        const expectedStatus_0 = {
            turnCount:  0,
            turn:       0,
            gameOver:   false,
            lastTurnWasSuccessful: false,
            turnIsOngoing: false
        } as Status

        game.forcedDiscard(0, c(10, CardType.Unstable))

        assert.strictEqual(JSON.stringify(expectedStatus_0),
            JSON.stringify(game.getStatus()))
    })

    it('Prevents discarding an illegal card', () => {
        const game = new Control(config)
        const expectedStatus_0 = {
            turnCount:  0,
            turn:       0,
            gameOver:   false,
            lastTurnWasSuccessful: false,
            turnIsOngoing: false
        } as Status

        game.forcedDiscard(0, c(11, CardType.Unstable))
        assert.strictEqual(JSON.stringify(expectedStatus_0), JSON.stringify(game.getStatus()))
        

        game.forcedDiscard(0, c(11, -1))
        assert.strictEqual(JSON.stringify(expectedStatus_0), JSON.stringify(game.getStatus()))
        

        game.forcedDiscard(0, c(0, 5))
        assert.strictEqual(JSON.stringify(expectedStatus_0), JSON.stringify(game.getStatus()))

        
        game.forcedDiscard(0, c(-1, 1))
        assert.strictEqual(JSON.stringify(expectedStatus_0), JSON.stringify(game.getStatus()))
    })

    it('Handles quickest possible discarding', () => {
        const game = new Control(config)
        const expectedStatus_1 = {
            turnCount:  1,
            turn:       1,
            gameOver:   false,
            lastTurnWasSuccessful: true,
            turnIsOngoing: false
        } as Status

        const expectedStatus_3a = {
            turnCount:  3,
            turn:       0,
            gameOver:   false,
            lastTurnWasSuccessful: true,
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

        const expectedPlayer0Data_2 = {
            name: "bot1",
            deckSize: 19,
            hand: ["10 u","10 u","9 u","9 u", "8 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data_2 = {
            name: "bot2",
            deckSize: 18,
            hand: ["10 u","10 u","9 u","9 u", "8 u", "8 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data_3b = {
            name: "bot2",
            deckSize: 16,
            hand: ["10 u","10 u","9 u","9 u", "8 u", "8 u", "7 u", "7 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data_3c = {
            name: "bot2",
            deckSize: 16,
            hand: ["10 u", "9 u","9 u", "8 u", "8 u", "7 u", "7 u"],
            field: [""],
            discardPile: ["10 u"]
        } as PlayerData

        const expectedPlayer0Data_4 = {
            name: "bot1",
            deckSize: 16,
            hand: ["10 u", "10 u", "9 u", "8 u", "8 u", "7 u", "7 u"],
            field: [""],
            discardPile: ["9 u"]
        } as PlayerData

        const expectedPlayer1Data_4 = {
            name: "bot2",
            deckSize: 15,
            hand: ["10 u", "10 u", "8 u", "8 u", "7 u", "7 u", "6 u"],
            field: [""],
            discardPile: ["9 u", "9 u"]
        } as PlayerData

        const expectedPlayer0Data_5 = {
            name: "bot1",
            deckSize: 18,
            hand: ["10 u","10 u", "8 u"],
            field: [""],
            discardPile: ["8 u","9 u","9 u"]
        } as PlayerData

        const expectedPlayer1Data_5 = {
            name: "bot2",
            deckSize: 18,
            hand: ["10 u", "10 u", "8 u", "8 u"],
            field: [""],
            discardPile: ["9 u", "9 u"]
        } as PlayerData

        const expectedGameStatus_3 = {
            turnCount:  3,
            turn:       1,
            gameOver:   false,
            lastTurnWasSuccessful: true,
            turnIsOngoing: false
        } as Status

        const expectedGameStatus_3b = {
            turnCount:  3,
            turn:       1,
            gameOver:   false,
            lastTurnWasSuccessful: true,
            turnIsOngoing: true
        } as Status

        const expectedGameStatus_3c = {
            turnCount:  4,
            turn:       0,
            gameOver:   false,
            lastTurnWasSuccessful: true,
            turnIsOngoing: false
        } as Status

      
        game.conductTurn(Action.Draw)
        game.conductTurn(Action.Draw)

        
        assert.strictEqual(JSON.stringify(expectedPlayer0Data_2),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_2),
            JSON.stringify(game.getPlayerData(1)))
    

        game.conductTurn(Action.Draw)

        assert.strictEqual(JSON.stringify(expectedGameStatus_3),
            JSON.stringify(game.getStatus()))

        game.conductTurn(Action.Draw)
        // Player 1 has reached 8 cards in their hand

        assert.strictEqual(JSON.stringify(expectedGameStatus_3b),
            JSON.stringify(game.getStatus()))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_3b),
            JSON.stringify(game.getPlayerData(1)))

        game.forcedDiscard(1, c(10, CardType.Unstable))
        
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_3c),
            JSON.stringify(game.getPlayerData(1)))
        assert.strictEqual(JSON.stringify(expectedGameStatus_3c),
            JSON.stringify(game.getStatus()))


        game.conductTurn(Action.Draw)
        
        
        // assert.strictEqual(JSON.stringify(expectedGameStatus_5),
            // JSON.stringify(game.getStatus()))
        
        // Try to draw again even though player 0 needs to discard first
        game.conductTurn(Action.Draw)
        assert.strictEqual(`true`,
            JSON.stringify(game.getStatus().turnIsOngoing))
      
    })
}) 