class Board{
    constructor(size){
        this.size = size;
        this.active = false; 
    }

    get size() {
        return this.size;
    }

    get active() {
        return this.active;
    }

    set active() {
        this.active = true;
    }

    inactive() {
        this.active = false;
    }
}

class Field{
    constructor(owner, position){
        this.owner = owner;
        this.position = position;
        this.seeds = 4;
    }

    get seeds() {
        return this.seeds;
    }

    get position() {
        return this.position;
    }

    remove_seeds(){
        this.seeds = 0;
    }

    sow() {
        this.seeds = this.seeds + 1;
    }
}

class Warehouse{
    constructor(owner){
        this.owner = owner;
        this.seeds = 0;
    }
    
    get seeds() {
        return this.seeds;
    }

    sow(newSeeds) {
        this.seeds = this.seeds + newSeeds;
    }
}

function is_player_turn(){
    return playerTurn;
}

function initialize_game(size, seeds){
    const board = new Board(size);
    const seedsPerField = seeds / (size*2);
    playerWarehouse = new Warehouse("player");
    oppWarehouse = new Warehouse("opp")
    for (let i = 0; i < size; i++){
        playerFields[i] = new Field("player", i)
        oppFields[i] = new Field("opp", i);
    }
}

function sow(startingField){
    seeds = startingField.seeds();
    position = startingField.position();
    playAgain = false;
    
    startingField.remove_seeds();
    
    while(seeds > 0){
        if (position < size) {
            seeds--;
            position++;
            playerFields[position].sow();
        } else if (position == size) {
            seeds--;
            playerWarehouse.sow(1);
            position++;
        } else if (position > size) {
            if (position <= 2 * size){
                seeds--;
                oppFields[size * 2 - position].sow();
                position++;
            } else {
                position = 0;
            }
        }
    }

    if (position == size) {
        playAgain = true;
    }
    
    if (position < size && playerFields[position].seeds() == 1){
        stolenSeeds = oppFields[position].seeds();
        oppFields[position].remove_seeds();
        playerWarehouse.sow(1 + stolenSeeds);
    }
}