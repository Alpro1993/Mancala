import Board from './classes/Board.js'
import Warehouse from './classes/Warehouse.js'
import Player from './classes/Player.js'
import Field from './classes/Field.js'
import Game from './classes/Game.js'

var game;
var board;
var player;
var opp;
var activePlayer;

export function initialize_game (size, seedsPerField) {
    game = new Game();
    board = new Board(size);
    
    player = new Player("player");
    opp = new Player("opp");

    activePlayer = player;
    
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
    
    player.fields = playerFields;
    opp.fields = oppFields;

    for (let i = 0; i < size; i++) {
        playerFields[i].seeds(seedsPerField);
        oppFields[i].seeds(seedsPerField);
    }

    game.gameState = 1;
    
    return [board, player, opp];

}


export function concede () {
    game.gameState = 3;
}


//Function take_turn should be given higher abstraction in order to encompass turns of both player and computer
// async function take_turn (activePlayer) {
    
//     field = await select_field(fieldId);
    
//     if (field.seeds == 0) {
//         alert("Field has no seeds!");
//         throw new Error('field has no seeds');
//     }

//     seedsToSpread = field.seeds;
//     field.remove_seeds();

//     var lastSownField = sow (field, seedsToSpread);
//     activePlayer.score = activePlayer.warehouse.seeds;

//     //If last seed planted landed on one of the player's empty fields,
//     //place that seed in the player's warehouse, remove all seeds
//     //from the opponent's directly opposite field and place them in the 
//     //player's warehouse as well.
//     if (lastSownField.owner === player && lastSownField.seeds === 1) {  
//         lastSownField.remove_seeds();
//         playerWarehouse.store(1);
//         steal_seeds(activePlayer.opponent, lastSownField.position);
//         player.score = playerWarehouse.seeds;
//     } 
//     //If the last seed was placed in the player's warehouse, play again.
//     else if (lastSownField == activePlayer.warehouse) {
//         take_turn(activePlayer);
//     } 
       
//     check_win_condition(activePlayer);

//     if(game.gameState != 1){
//            end_game_procedures(activePlayer);
//     } else {
//       activePlayer = activePlayer.opponent;
//       take_turn(activePlayer);
//     }
//     
// }

function steal_seeds (victim, position) {
    targetField = victim.fields[position];
    seedsAtTargetField = targetField.seeds;

    targetField.remove_seeds();
    victim.opponent.warehouse.store(seedsAtTargetField);
}

function sow (field, seedsToSpread) {

}

export async function selected_field(activePlayer) {
    if (activePlayer == player) {
       var selectedField = await wait_for_play();
    } else if (activePlayer == opp) {
        selectedField = ai_select_field()
    }
    return Promise<selectedField>;
}

function wait_for_play() {

}

export function field_clicked

// const playerFieldButtons = document.querySelectorAll(".playerField");
// const oppFieldButtons = document.querySelectorAll(".oppField");

// const game = new Game();
// const [board, player, opp] = initialize_game(game, 4, 32);


// while (game.gameState == 1) {
//     game.gameState = take_turn(player);
//     for(let j = 0; j < size; j++){
//     }
// }

