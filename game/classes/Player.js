class Player{
    constructor (id){
        this.playerId = id;
        this.opponent = null;
        this.score = 0;
        this.warehouse = null;
        this.fields = null;
    }

    get warehouse () {
        return this.warehouse;
    }

    set warehouse (_warehouseId) {
        this.warehouse = warehouse;
    }

    get score () {
        return this.score;
    }

    set playerScore (score) {
        this.score = score;
    }

    get opponent () {
        return this.opp;
    }
    
    set opponent (opp) {
        this.opp = opp;
    }

}

export default Player