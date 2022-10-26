var assert = require('assert')  
import Control from "../../src/Control"
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

describe('Diffuse Logic', () => {
    it('Handles diffusing a Nova with a Nova', () => {
        const game = new Control(config)
        // Underscore represents the turn. "_1" mean after the first turn has been conducted
        const expectedPlayer0Data_1 = {
            name: "bot1",
            deckSize: 20,
            hand: ["10 u","9 u","9 u"],
            field: ["10 u"],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer0Data_2 = {
            name: "bot1",
            deckSize: 20,
            hand: ["10 u","9 u","9 u"],
            field: [""],
            discardPile: ["10 u"]
        } as PlayerData

        const expectedPlayer1Data_2 = {
            name: "bot2",
            deckSize: 19,
            hand: ["10 u","9 u","9 u", "8 u"],
            field: [""],
            discardPile: ["10 u"]
        } as PlayerData

        
        game.conductTurn(Action.Play, {number: 10, type: CardType.Unstable} as Card)

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_1),
            JSON.stringify(game.getPlayerData(0)))

        game.conductTurn(Action.Diffuse, {number: 10, type: CardType.Unstable} as Card, 0, {number: 10, type: CardType.Unstable})

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_2),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_2),
            JSON.stringify(game.getPlayerData(1)))
        
    })

    it('Handles diffusing a TimeStop with a Nova', () => {
        const game = new Control(config)
        // Underscore represents the turn. "_1" mean after the first turn has been conducted
        const expectedPlayer0Data_1 = {
            name: "bot1",
            deckSize: 20,
            hand: ["10 u","10 u","9 u"],
            field: ["9 u"],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer0Data_2 = {
            name: "bot1",
            deckSize: 20,
            hand: ["10 u","10 u","9 u"],
            field: [""],
            discardPile: ["9 u"]
        } as PlayerData

        const expectedPlayer1Data_2 = {
            name: "bot2",
            deckSize: 19,
            hand: ["10 u","9 u","9 u", "8 u"],
            field: [""],
            discardPile: ["10 u"]
        } as PlayerData

        
        game.conductTurn(Action.Play, {number: 9, type: CardType.Unstable} as Card)

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_1),
            JSON.stringify(game.getPlayerData(0)))

        game.conductTurn(Action.Diffuse, {number: 10, type: CardType.Unstable} as Card, 0, {number: 9, type: CardType.Unstable})

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_2),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_2),
            JSON.stringify(game.getPlayerData(1)))
        
    })

    it('Does not allow diffusing a Nova with a TimeStop', () => {
        const game = new Control(config)
        // Underscore represents the turn. "_1" mean after the first turn has been conducted
        const expectedPlayer0Data_1 = {
            name: "bot1",
            deckSize: 20,
            hand: ["10 u","9 u","9 u"],
            field: ["10 u"],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer0Data_2 = {
            name: "bot1",
            deckSize: 20,
            hand: ["10 u","9 u","9 u"],
            field: ["10 u"],
            discardPile: [""]
        } as PlayerData

        const expectedPlayer1Data_2 = {
            name: "bot2",
            deckSize: 20,
            hand: ["10 u", "10 u", "9 u", "9 u"],
            field: [""],
            discardPile: [""]
        } as PlayerData

        
        game.conductTurn(Action.Play, {number: 10, type: CardType.Unstable} as Card)

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_1),
            JSON.stringify(game.getPlayerData(0)))

        game.conductTurn(Action.Diffuse, {number: 9, type: CardType.Unstable} as Card, 0, {number: 10, type: CardType.Unstable})

        assert.strictEqual(JSON.stringify(expectedPlayer0Data_2),
            JSON.stringify(game.getPlayerData(0)))
        assert.strictEqual(JSON.stringify(expectedPlayer1Data_2),
            JSON.stringify(game.getPlayerData(1)))
        assert.strictEqual("false",
            JSON.stringify(game.getStatus().lastTurnWasSuccessful))
        
    })
}) 