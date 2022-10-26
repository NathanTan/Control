interface Status {
    turnCount: number // The number of player turns
    turn: number // The number of which player's turn it is
    lastTurnWasSuccessful: boolean
    gameOver: boolean
    turnIsOngoing: boolean
}

export default Status