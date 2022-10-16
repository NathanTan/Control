import PlayResultFollowUp from "./PlayResultFollowUp"

interface PlayResult {
    success: boolean
    next?: PlayResultFollowUp
    playersScore: number
    diffuseValue: number
}


export default PlayResult