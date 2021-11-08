class Board {
    constructor (size) {
        this.size = size;
        this.active = false; 
    }

    get size () {
        return this.size;
    }

    get active () {
        return this.active;
    }

    set active (state) {
        this.active = state;
    }

}

export default Board