enum Action {
    Draw,
    Play,
    Activate,
    Diffuse,
    Discard // Force a discard because a player has more than 7 cards at the end of their turn
}

export default Action