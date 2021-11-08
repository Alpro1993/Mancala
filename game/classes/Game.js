class Game{
    constructor () {
        //0: Ready, 1: Started, 2: Finished, 3: Player conceded
        this.gameState = 0; 
    }

    get gameState () {
        return this.gameState;
    }

    set gameState (stateId) {
        this.gameState = stateId;
    }

}

export default Game