class Field {
    constructor (owner, position) {
        this.owner = owner;
        this.position = position;
        this.seeds = 4;
    }

    get seeds () {
        return this.seeds;
    }

    set seeds (seeds) {
        this.seeds = seeds;
    }

    get position () {
        return this.position;
    }

    remove_seeds (){
        this.seeds = 0;
    }

    sow () {
        this.seeds = this.seeds + 1;
    }
}

export default Field