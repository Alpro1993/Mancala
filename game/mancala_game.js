import Board from './classes/Board.js'
import Warehouse from './classes/Warehouse.js'
import Player from './classes/Player.js'
import Field from './classes/Field.js'
import Game from './classes/Game.js'



function initialize_game (size, seeds) {
    var game = new Game();
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

function field_selected (fieldId) {
    selectedField.fieldId = fieldId;
}

// const playerFieldButtons = document.querySelectorAll(".playerField");
// const oppFieldButtons = document.querySelectorAll(".oppField");

// const game = new Game();
// const [board, player, opp] = initialize_game(game, 4, 32);


// while (game.gameState == 1) {
//     game.gameState = take_turn(player);
//     for(let j = 0; j < size; j++){
//     }
// }

