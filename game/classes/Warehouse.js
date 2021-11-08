class Warehouse {
    constructor (owner) {
        this.owner = owner;
        this.seeds = 0;
    }
    
    get seeds () {
        return this.seeds;
    }

    store (newSeeds) {
        this.seeds = this.seeds + newSeeds;
    }
}

export default Warehouse