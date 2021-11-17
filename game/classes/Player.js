class Player{
    constructor (id){
        this.playerId = id;
        this.difficulty = null;
        this.opponent = null;
        this.score = 0;
        this.warehouse = null;
        this.fields = null;
    }

    id_to_string() {
        return String(this.playerId)
    }
}

export default Player