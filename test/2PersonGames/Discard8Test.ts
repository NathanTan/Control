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
    testing: true,
    // logging: true,
    // debug: true
} as Config

const c = (value: number, type: CardType): Card => {
    return {number: value, type: type} as Card
}

describe('Discarding an 8 handling', () => {
    it('Handles an 8 when 2 card is on the field for each player without 9s', () => {
        const game = new Control(config)
        const expectedStatus_1 = {
            turnCount:  1,
            turn:       1,
            gameOver:   false,
            lastTurnWasSuccessful: true,
            turnIsOngoing: false
        } as Status

        const expectedStatus_2 = {
            turnCount:  2,
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
            deckSize: 20,
            hand: ["10 u","10 u","9 u",],
            field: ["9 u"],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data_2 = {
            name: "bot2",
            deckSize: 19,
            hand: ["10 u","10 u","9 u", "8 u"],
            field: ["9 u"],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer0Data_4 = {
            name: "bot1",
            deckSize: 19,
            hand: ["10 u","10 u", "8 u"],
            field: ["9 u","9 u"],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data_4 = {
            name: "bot2",
            deckSize: 18,
            hand: ["10 u", "10 u", "8 u", "8 u"],
            field: ["9 u", "9 u"],
            discardPile: [""]
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

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_0),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_0),
            JSON.stringify(game.getPlayerData(1)))
        
        game.conductTurn(Action.Play, {number: 9, type: CardType.Unstable} as Card)

        assert.strictEqual(JSON.stringify(expectedStatus_1),
            JSON.stringify(game.getStatus()))
        
        game.conductTurn(Action.Play, {number: 9, type: CardType.Unstable} as Card)


        assert.strictEqual(JSON.stringify(expectedStatus_2),
            JSON.stringify(game.getStatus()))
        assert.strictEqual(JSON.stringify(expectedPlayer0Data_2),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_2),
            JSON.stringify(game.getPlayerData(1)))

        game.conductTurn(Action.Play, {number: 9, type: CardType.Unstable} as Card)
        game.conductTurn(Action.Play, {number: 9, type: CardType.Unstable} as Card)
        
        assert.strictEqual(JSON.stringify(expectedPlayer0Data_4),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_4),
            JSON.stringify(game.getPlayerData(1)))

        game.conductTurn(Action.Activate, {number: 8, type: CardType.Unstable} as Card)

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_5),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_5),
            JSON.stringify(game.getPlayerData(1)))
        
        
        
    })

    it('Handles an 8 when no cards are on the field and neither each player has a 9s', () => {
        const game = new Control(config)
        const expectedStatus_8 = {
            turnCount:  8,
            turn:       0,
            gameOver:   false,
            lastTurnWasSuccessful: true,
            turnIsOngoing: false
        } as Status

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

        const expectedPlayer1Data_3 = {
            name: "bot2",
            deckSize: 16,
            hand: ["10 u", "10 u", "9 u", "9 u", "8 u", "8 u", "7 u", "7 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data_3b = {
            name: "bot2",
            deckSize: 16,
            hand: ["10 u", "10 u", "9 u", "8 u", "8 u", "7 u", "7 u"],
            field: [""],
            discardPile: ["9 u"]
        } as PlayerData

        const expectedPlayer0Data_4 = {
            name: "bot1",
            deckSize: 15,
            hand: ["10 u","10 u","9 u","9 u","8 u","8 u","7 u","7 u","6 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer0Data_4b = {
            name: "bot1",
            deckSize: 15,
            hand: ["10 u", "10 u", "9 u", "8 u", "8 u", "7 u", "7 u", "6 u"],
            field: [""],
            discardPile: ["9 u"]
        } as PlayerData

        const expectedPlayer0Data_4c = {
            name: "bot1",
            deckSize: 15,
            hand: ["10 u", "10 u", "8 u", "8 u", "7 u", "7 u", "6 u"],
            field: [""],
            discardPile: ["9 u", "9 u"]
        } as PlayerData

        const expectedPlayer1Data_4c = {
            name: "bot2",
            deckSize: 16,
            hand: ["10 u", "10 u", "9 u", "8 u", "8 u", "7 u", "7 u"],
            field: [""],
            discardPile: ["9 u",]
        } as PlayerData

        const expectedPlayer0Data_5b = {
            name: "bot1",
            deckSize: 15,
            hand: ["10 u", "10 u", "8 u", "8 u", "7 u", "7 u", "6 u"],
            field: [""],
            discardPile: ["9 u", "9 u"]
        } as PlayerData

        const expectedPlayer1Data_5b = {
            name: "bot2",
            deckSize: 14,
            hand: ["10 u", "8 u", "8 u", "7 u", "7 u", "6 u", "6 u"],
            field: [""],
            discardPile: ["9 u", "9 u", "10 u"]
        } as PlayerData

        const expectedPlayer0Data_6b = {
            name: "bot1",
            deckSize: 13,
            hand: ["10 u", "10 u", "8 u", "8 u", "7 u", "7 u", "6 u", "6 u", "5 u"],
            field: [""],
            discardPile: ["9 u", "9 u"]
        } as PlayerData

        const expectedPlayer1Data_6b = {
            name: "bot2",
            deckSize: 14,
            hand: ["10 u", "8 u", "8 u", "7 u", "7 u","6 u", "6 u"],
            field: [""],
            discardPile: ["9 u", "9 u", "10 u"]
        } as PlayerData

        const expectedPlayer0Data_7 = {
            name: "bot1",
            deckSize: 13,
            hand: ["10 u", "10 u", "8 u", "8 u", "7 u", "7 u", "6 u", "6 u", "5 u"],
            field: [""],
            discardPile: ["9 u", "9 u"]
        } as PlayerData

        const expectedPlayer1Data_7 = {
            name: "bot2",
            deckSize: 13,
            hand: ["10 u", "8 u", "7 u", "7 u", "6 u", "6 u", "5 u"],
            field: [""],
            discardPile: ["9 u", "9 u", "10 u", "8 u"]
        } as PlayerData


      
        game.conductTurn(Action.Draw)
        game.conductTurn(Action.Draw)

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_2),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_2),
            JSON.stringify(game.getPlayerData(1)))
    
        game.conductTurn(Action.Draw)
        game.conductTurn(Action.Draw)


        // At this point player 1 has 8 cards in their hand and needs to discard down to 7

        assert.strictEqual(JSON.stringify(expectedPlayer1Data_3),
            JSON.stringify(game.getPlayerData(1)))

        // Try to draw when player 1 still needs to discard
        game.conductTurn(Action.Draw)

        assert.strictEqual(JSON.stringify(expectedPlayer1Data_3),
            JSON.stringify(game.getPlayerData(1)))
        
        // Resolve the oversized hand
        game.forcedDiscard(1, c(9, CardType.Unstable))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_3b),
            JSON.stringify(game.getPlayerData(1)))


        game.conductTurn(Action.Draw)
    
        assert.strictEqual(JSON.stringify(expectedPlayer0Data_4),
            JSON.stringify(game.getPlayerData(0)))

        game.forcedDiscard(0, c(9, CardType.Unstable))
        assert.strictEqual(JSON.stringify(expectedPlayer0Data_4b),
            JSON.stringify(game.getPlayerData(0)))

        game.forcedDiscard(0, c(9, CardType.Unstable))
        assert.strictEqual(JSON.stringify(expectedPlayer0Data_4c),
            JSON.stringify(game.getPlayerData(0)))

        assert.strictEqual(JSON.stringify(expectedPlayer1Data_4c),
            JSON.stringify(game.getPlayerData(1)))

        game.conductTurn(Action.Draw)
        game.forcedDiscard(1, c(9, CardType.Unstable))
        game.forcedDiscard(1, c(10, CardType.Unstable))
        
        assert.strictEqual(JSON.stringify(expectedPlayer0Data_5b),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_5b),
            JSON.stringify(game.getPlayerData(1)))

        game.conductTurn(Action.Draw)
        game.forcedDiscard(1, c(9, CardType.Unstable))

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_6b),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_6b),
            JSON.stringify(game.getPlayerData(1)))

        // Finally all the 9's have been discarded. Time for the actual test. (Actually a couple turns before this)
        const targetCanNegate = (game.getPlayerData(1).hand.indexOf("9 u") !== -1) 
        game.conductTurn(Action.Activate, c(8, CardType.Unstable), 0, undefined, targetCanNegate)

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_7),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_7),
            JSON.stringify(game.getPlayerData(1)))
            

        assert.strictEqual(JSON.stringify(expectedStatus_8),
            JSON.stringify(game.getStatus()))
        
        
    })
}) 