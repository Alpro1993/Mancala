class Warehouse {
    constructor (owner) {
        this.owner = owner;
        this.seeds = 0;
    }

    id_to_string() {
        return this.owner.id_to_string;
    }
}

export default Warehouse