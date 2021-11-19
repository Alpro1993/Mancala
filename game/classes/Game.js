class Game{
    constructor () {
        //0: Ready, 1: Started, 2: Finished, 3: Player conceded
        this.gameState = 0;
        this.winner = null;
        this.difficulty = null;
    }
}

export default Game