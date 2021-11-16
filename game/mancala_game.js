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

//Add event listener for "Play Game" button
document.getElementById("playGame").addEventListener("click", function () {
    var size = document.querySelector('input[name="boardSize"]:checked').value;
    var seeds = document.querySelector('input[name="numberOfSeeds"]:checked').value;
    var difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    var goFirst = document.querySelector('input[name="goFirst"]:checked').value;

    initialize_game(size, seeds, difficulty, goFirst);
    populate_board(seeds);
    
});

//Add event listener for "Concede button"
document.getElementById("concedeButton").addEventListener("click", concede);

function add_listeners_to_fields() {
    var playerFields = document.getElementsByClassName("field playerField");
    for(let i=0; i < playerFields.length; i++) {
        let field = playerFields[i];
        field.addEventListener("click", function() {
            console.log("click on field "+i);
            take_turn(player, i);
            //update_board();
        });
    }
}

function initialize_game (size, seedsPerField, difficulty, goFirst) {
    game = new Game();
    board = new Board(size);
    
    player = new Player("player");
    opp = new Player("opp");

    opp.difficulty = difficulty;
    
    if (goFirst === 'true') {
        activePlayer = player;
    } else {
        activePlayer = opp;
    }

    var playerWarehouse = new Warehouse(player);
    player.warehouse = playerWarehouse
    var oppWarehouse = new Warehouse(opp)
    opp.warehouse = oppWarehouse;
    
    player.opponent = opp;
    opp.opponent = player;
    
    var playerFields = [];
    var oppFields = [];

    for (let i = 0; i < size; i++) {
        playerFields[i] = new Field(player, i)
        oppFields[i] = new Field(opp, i);
    }
    
    player.fields = playerFields;
    opp.fields = oppFields;

    for (let i = 0; i < size; i++) {
        playerFields[i].seeds = seedsPerField;
        oppFields[i].seeds = seedsPerField;
    }


    game.gameState = 1;
    
    console.log("game with --\n     size:"+size+"\n     seeds:"+seedsPerField+"\n     difficulty: "+difficulty+"\n     goFirst: "+goFirst+"\n-- was initialized");
    add_listeners_to_fields();

    return [board, player, opp];

}

function populate_board (seeds) {
    var fields = document.getElementsByClassName("field");
    
    for(let i=0; i<fields.length; i++) {
        let field = fields[i];
        field.innerHTML = ""+seeds;
    }
}

function concede () {
    console.log("conceded!");
    game.gameState = 3;
}


//Function take_turn should be given higher abstraction in order to encompass turns of both player and computer
function take_turn (activePlayer, targetedField) {
    
    //Find the field in the list of fields belonging to activePlayer which matches the position
    //given in targetedField
    var selectedField = activePlayer.fields[targetedField];

    if (selectedField.seeds == 0) {
        alert("Field has no seeds!");
        throw new Error('field has no seeds');
    }

    //Remove seeds from field and sow them on other fields
    var seedsToSpread = selectedField.seeds;
    selectedField.seeds = 0;
    var lastSownField = sow (selectedField, seedsToSpread);
    
    //If last seed planted landed on one of the player's empty fields,
    //place that seed in the player's warehouse, remove all seeds
    //from the opponent's directly opposite field and place them in the 
    //player's warehouse as well.
    if (lastSownField.owner === player && lastSownField.seeds === 1) {  
        lastSownField.seeds = 0;
        playerWarehouse.seeds += 1;
        steal_seeds(activePlayer.opponent, lastSownField.position);
        player.score = playerWarehouse.seeds;
    }
    
    activePlayer.score = activePlayer.warehouse.seeds;
    game.gameState = check_win_condition(activePlayer);
    
    //If the last seed wasn't placed in the player's warehouse (and the game isn't over), give the other player the turn.
    if (lastSownField != activePlayer.warehouse) {
        activePlayer = activePlayer.opponent;
    } 

    if(game.gameState != 1){
           end_game_procedures(activePlayer);
    } else {
        if (activePlayer == opp) {
            var selectedField = ai_choose_play();
        }
      take_turn(activePlayer, selectedField);
    }
}

function steal_seeds (position) {
    var targetField = activePlayer.opponent.fields[position];
    var seedsAtTargetField = targetField.seeds;

    targetField.remove_seeds();
    activePlayer.warehouse.seeds += seedsAtTargetField;
}

function sow (selectedField, seedsToSpread) {
    /* First the active player places one seed in each of his fields and his warehouse,
        then he places a seed in each of the opponent's fields, jumping over the opponent's warehouse.
        If he still has seeds left to sow, repeat. */


    //Results will hold the array returned from sow_own_fields and sow_opponent_fields
    var results = sow_own_fields(selectedField, seedsToSpread);
    var lastSownField = results[0]; 
    seedsToSpread = results[1];

    if (lastSownField == activePlayer.warehouse && seedsToSpread > 0) {
        results = sow_opponent_fields(seedsToSpread);
        lastSownField = results[0];
        seedsToSpread = results[1];
    }

    if (seedsToSpread > 0) {
        selectedField = activePlayer.fields[0];
        sow(selectedField, seedsToSpread);
    } else {
        return lastSownField;
    }

}

function sow_own_fields(selectedField, seedsToSpread) {

    //Place one seed in each of the player's fields
    while (selectedField.position < board.size-1 && seedsToSpread > 0) {
        selectedField = activePlayer.fields[selectedField.position+1];
        seedsToSpread -= 1;
        selectedField.seeds += 1;
    }

    //If there's still seeds left, place one in the warehouse
    if (seedsToSpread > 0) {
        seedsToSpread -= 1;
        selectedField = activePlayer.warehouse;
        selectedField.seeds += 1;
    }

    var lastSownField = selectedField;
    
    return [lastSownField, seedsToSpread];
}

function sow_opponent_fields(seedsToSpread) {

    var activeOpponentFields = activePlayer.opponent.fields;
    var selectedField = activeOpponentFields[board.size-1];
    seedsToSpread -= 1;
    selectedField.seeds += 1;
    
    //Place one seed in each of the opponent's fields
    while (selectedField.position > 0 && seedsToSpread > 0) {
        selectedField = activeOpponentFields[selectedField.position-1];
        seedsToSpread -= 1;
        selectedField.seeds += 1;
    }

    var lastSownField = selectedField;

    return [lastSownField, seedsToSpread];
}