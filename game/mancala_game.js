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

    set warehouse () {
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


function initialize_game (game, size, seeds) {
    var board = new Board(size);
    const seedsPerField = seeds / (size*2);
    
    var player = new Player("player");
    var opp = new Player("opp");
    
    var playerWarehouse = new Warehouse(player);
    player.warehouse = playerWarehouse
    var oppWarehouse = new Warehouse(opp)
    opp.warehouse = oppWarehouse;
    
    player.opponent = opp;
    opp.opponent = player;
    
    for (let i = 0; i < size; i++) {
        playerFields[i] = new Field(player, i)
        oppFields[i] = new Field(opp, i);
    }
    player.fields = playerFields
    opp.fields = oppFields

    for (let i = 0; i < size; i++) {
        playerFields[i].seeds(seedsPerField);
        oppFields[i].seeds(seedsPerField);
    }

    game.gameState = 1;
    
    return [board, player, opp];

}


function concede () {
    game.gameState = 3;
}

function take_turn (player) {
    var field = select_field(player);
    
    if (field.seeds == 0) {
        throw new Error('field has no seeds');
        return;
    }

    seedsToSpread = field.seeds;
    field.remove_seeds();

    var lastSownField = sow (field, seedsToSpread);
    player.score = playerWarehouse.seeds;

    //If last seed planted landed on one of the player's empty fields,
    //place that seed in the player's warehouse, remove all seeds
    //from the opponent's directly opposite field and place them in the 
    //player's warehouse as well.
    if (lastSownField.owner == player && lastSownField.seeds == 1) {  
        lastSownField.remove_seeds();
        playerWarehouse.store(1);
        steal_seeds(player.opponent, lastSownField.position);
        player.score = playerWarehouse.seeds;
    } 
    //If the last seed was placed in the player's warehouse, play again.
    else if (lastSownField == playerWarehouse) {
        take_turn(player);
    } 

    return 1;
}

function steal_seeds (victim, position) {
    targetField = victim.fields[position];
    seedsAtTargetField = targetField.seeds;

    targetField.remove_seeds();
    victim.opponent.warehouse.store(seedsAtTargetField);
}

function sow (field, seedsToSpread) {

}

function getSelectedField () {
    selectedField.fieldId =
}

const playerFieldButtons = document.querySelectorAll(".playerField");
const oppFieldButtons = document.querySelectorAll(".oppField");

const game = new Game();
const [board, player, opp] = initialize_game(game, 4, 32);


while (game.gameState == 1) {
    game.gameState = take_turn(player);
    for(let j = 0; j < size; j++){
    }
}

