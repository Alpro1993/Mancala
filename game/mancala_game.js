import Board from './classes/Board.js'
import Warehouse from './classes/Warehouse.js'
import Player from './classes/Player.js'
import Field from './classes/Field.js'
import Game from './classes/Game.js'

let game;
let board;
let player;
let opp;
let activePlayer;

const messageBox = document.getElementById("messageBox");

//Add event listener for "Play Game" button
document.getElementById("playGame").addEventListener("click", function () {
    let size = document.querySelector('input[name="boardSize"]:checked').value;
    let seeds = document.querySelector('input[name="numberOfSeeds"]:checked').value;
    let difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    let goFirst = document.querySelector('input[name="goFirst"]:checked').value;
    reset_game();
    initialize_game(Number(size), Number(seeds), difficulty, goFirst);
    populate_board(seeds);

});

//Add event listener for "Concede button"
document.getElementById("concede").addEventListener("click", function(eventObj) {
    eventObj.stopPropagation();
    concede();
});

function add_listeners_to_fields () {
    let playerFields = document.getElementsByClassName("field playerField");
    for (let i = 0; i < playerFields.length; i++) {
        let field = playerFields[i];
        field.addEventListener("click", turn_listener);
    }
}

function remove_listeners_from_fields () {
    let playerFields = document.getElementsByClassName("field playerField");
    for (let i = 0; i < playerFields.length; i++) {
        let field = playerFields[i];
        field.removeEventListener("click", take_turn);
    }
}

function turn_listener (eventObj) {
    eventObj.stopPropagation();
    let fieldId = eventObj.target.id;
    let fieldPos = fieldId[0];
    if (activePlayer == player) {
        take_turn(fieldPos);
    }
}

function reset_game() {
    game = null;
    board = null;
    player = null;
    opp = null;
    activePlayer = null;

    document.getElementById("playerScore").textContent = "Your score: ";
    document.getElementById("oppScore").textContent = "Opponent's score: ";

}

function initialize_game(size, seedsPerField, difficulty, goFirst) {
    game = new Game();
    board = new Board(size);

    player = new Player("Player");
    opp = new Player("Opp");

    console.log("player id = " + player.id_to_string());

    opp.difficulty = difficulty;

    if (goFirst === 'true') {
        activePlayer = player;
        messageBox.textContent = "It's your turn to play!"

    } else {
        activePlayer = opp;
    }

    let playerWarehouse = new Warehouse(player);
    player.warehouse = playerWarehouse
    let oppWarehouse = new Warehouse(opp)
    opp.warehouse = oppWarehouse;

    player.opponent = opp;
    opp.opponent = player;

    let playerFields = [];
    let oppFields = [];

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

    add_listeners_to_fields();

    return [board, player, opp];

}

function populate_board(seeds) {
    let fields = document.getElementsByClassName("field");

    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        field.innerHTML = "<p>"+seeds+"</p>";
        create_seeds(field, seeds);
    }
}

function create_seeds(htmlField, seeds) {
        for (let j = 0; j < seeds; j++) {
                let seedDiv = document.createElement("P");
                seedDiv.className = "seed";
                seedDiv.id = htmlField.id+"seed"+j;
                seedDiv.innerHTML = "○";
                seedDiv.style.top = Math.random() * (-5 - (-20)) + (-20)+"%";
                seedDiv.style.left = Math.random() * (0 - (-3)) + (-3)+"%";
                htmlField.appendChild(seedDiv);
        }

}

function concede() {
    messageBox.textContent = "You conceded the game - you know you weren't going to win anyway...\nYour score: " + player.score + "\nOpponent's score: " + opp.score;
    game.gameState = 3;
    game.winner = opp;
    end_game_procedures();
}


function take_turn(targetedField) {
    let lastSownField;

    //Find the field in the list of fields belonging to activePlayer which matches the position
    //given in targetedField
    let selectedField = activePlayer.fields[targetedField];

    if (selectedField.seeds == 0) {
        alert("field " + selectedField.position + " selected by " + activePlayer.id_to_string() + " has no seeds");
        throw new Error('field ' + selectedField.position + 'selected by ' + activePlayer.id_to_string() + 'has no seeds');
    }

    //Remove seeds from field and sow them on other fields
    let seedsToSpread = selectedField.seeds;
    selectedField.seeds = 0;

    if (activePlayer == player) {
        lastSownField = sow(selectedField, seedsToSpread);
    } else {
        lastSownField = ai_sow(selectedField, seedsToSpread);
    }

    //If last seed planted landed on one of the player's empty fields,
    //place that seed in the player's warehouse, remove all seeds
    //from the opponent's directly opposite field and place them in the 
    //player's warehouse as well.
    if (!(lastSownField instanceof Warehouse)
        && lastSownField.owner == activePlayer
        && lastSownField.seeds == 1) {
        lastSownField.seeds = 0;
        activePlayer.warehouse.seeds += 1;
        steal_seeds(Number(lastSownField.position));
        activePlayer.score = activePlayer.warehouse.seeds;
    }

    activePlayer.score = activePlayer.warehouse.seeds;
    



    //If the last seed wasn't placed in the player's warehouse (and the game isn't over), give the other player the turn.
    if (lastSownField != activePlayer.warehouse) {
        activePlayer = activePlayer.opponent;
    }

    if (activePlayer == player) {
        messageBox.textContent = "Your turn!";
    } else {
        messageBox.textContent = "Opponent's turn";
    }

    //Update the board graphical representation
    update_player_side();
    update_opponent_side();
    update_warehouses();

    let noMoreMoves = check_win_condition();
    if (game.gameState != 1) {
        determine_game_winner();
        end_game_procedures();
        
    } else {
        if (activePlayer == opp) {
            selectedField = ai_choose_play();
            take_turn(selectedField);
        }

    }


    /* FROM HERE ON ARE THE FUNCTION DEFINITIONS */

    /* Functions that deal with selecting and executing the computer's play */
    function ai_choose_play() {
        let selectedField;

        if (opp.difficulty == 0) {
            selectedField = apply_greedy();
        } else {
            selectedField = apply_min_max();
        }

        function apply_greedy() {
            let selectedField;
            let maxSeeds = 0;

            for (let i = 0; i < activePlayer.fields.length; i++) {
                if (activePlayer.fields[i].seeds > maxSeeds) {
                    selectedField = activePlayer.fields[i].position;
                    maxSeeds = activePlayer.fields[i].seeds;
                }
            }
            return selectedField;
        }
        return selectedField;
    }

    //This is shameful... I'll fix it eventually.
    function ai_sow(selectedField, seedsToSpread) {
        let results = sow_own_fields(selectedField, seedsToSpread);
        let lastSownField = results[0];
        seedsToSpread = results[1];

        if (lastSownField == activePlayer.warehouse && seedsToSpread > 0) {
            results = sow_opponent_fields(seedsToSpread);
            lastSownField = results[0];
            seedsToSpread = results[1];
        }

        if (seedsToSpread > 0) {
            selectedField = activePlayer.fields[0];
            seedsToSpread -= 1;
            selectedField.seeds = + 1;
            lastSownField = selectedField;
            if (seedsToSpread == 0) {
                return lastSownField;
            }
            sow(selectedField, seedsToSpread);
        } else {
            return lastSownField;
        }

        function sow_own_fields(selectedField, seedsToSpread) {

            //Place one seed in each of the player's fields
            //but first, check if selectedField was the last field on the board.

            for (let i = selectedField.position; i >= 0; i--) {
                if (seedsToSpread > 0) {
                    selectedField = activePlayer.fields[i];
                    seedsToSpread -= 1;
                    selectedField.seeds += 1;
                }
            }

            //If there's still seeds left, place one in the warehouse
            if (seedsToSpread > 0) {
                seedsToSpread -= 1;
                selectedField = activePlayer.warehouse;
                selectedField.seeds += 1;
            }

            let lastSownField = selectedField;
            return [lastSownField, seedsToSpread];
        }

        function sow_opponent_fields(seedsToSpread) {

            let activeOpponentFields = activePlayer.opponent.fields;
            let selectedField = activeOpponentFields[0];
            seedsToSpread -= 1;
            selectedField.seeds += 1;


            //Place one seed in each of the opponent's fields
            while (selectedField.position < board.size - 1 && seedsToSpread > 0) {
                selectedField = activeOpponentFields[selectedField.position + 1];
                seedsToSpread -= 1;
                selectedField.seeds += 1;
            }

            let lastSownField = selectedField;

            return [lastSownField, seedsToSpread];
        }


    }

    /* Functions that deal with player's moves */
    function sow(selectedField, seedsToSpread) {
        /* First the active player places one seed in each of his fields and his warehouse,
            then he places a seed in each of the opponent's fields, jumping over the opponent's warehouse.
            If he still has seeds left to sow, repeat. */
    
    
        //Results will hold the array returned from sow_own_fields and sow_opponent_fields
        let results = sow_own_fields(selectedField, seedsToSpread);
        let lastSownField = results[0];
        seedsToSpread = results[1];
    
        if (lastSownField == activePlayer.warehouse && seedsToSpread > 0) {
            results = sow_opponent_fields(seedsToSpread);
            lastSownField = results[0];
            seedsToSpread = results[1];
        }
    
        if (seedsToSpread > 0) {
            selectedField = activePlayer.fields[0];
            seedsToSpread -= 1;
            selectedField.seeds = + 1;
            lastSownField = selectedField;
            if (seedsToSpread == 0) {
                return lastSownField;
            }
            sow(selectedField, seedsToSpread);
        } else {
            return lastSownField;
        }
    
        function sow_own_fields(selectedField, seedsToSpread) {
    
            //Place one seed in each of the player's fields
            //but first, check if selectedField was the last field on the board.
    
            if (selectedField.position != board.size - 1) {
                for (let i = selectedField.position + 1; i < board.size; i++) {
                    if (seedsToSpread > 0) {
                        selectedField = activePlayer.fields[i];
                        seedsToSpread -= 1;
                        selectedField.seeds += 1;
                    }
                }
            }
    
            //If there's still seeds left, place one in the warehouse
            if (seedsToSpread > 0) {
                seedsToSpread -= 1;
                selectedField = activePlayer.warehouse;
                selectedField.seeds += 1;
            }
    
            let lastSownField = selectedField;
            return [lastSownField, seedsToSpread];
        }
    
        function sow_opponent_fields(seedsToSpread) {
    
            let activeOpponentFields = activePlayer.opponent.fields;
            let selectedField = activeOpponentFields[board.size - 1];
            seedsToSpread -= 1;
            selectedField.seeds += 1;
    
    
            //Place one seed in each of the opponent's fields
            while (selectedField.position > 0 && seedsToSpread > 0) {
                selectedField = activeOpponentFields[selectedField.position - 1];
                seedsToSpread -= 1;
                selectedField.seeds += 1;
            }
    
            let lastSownField = selectedField;
    
            return [lastSownField, seedsToSpread];
        }
    }

    /* Functions used in both player and opponent turns */
    function steal_seeds(fieldNo) {
        let targetField = activePlayer.opponent.fields[fieldNo];
        console.log("target field belong to " + activePlayer.opponent.id_to_string() + "and is position " + Number(targetField.position));
        let seedsAtTargetField = targetField.seeds;
    
        targetField.seeds = 0;
        activePlayer.warehouse.seeds += seedsAtTargetField;
    }

    /* Functions used to update board graphical representation */
    function update_field(field) {
        let htmlField = document.getElementById(field.position+field.owner.id_to_string()+"Field");
        let seeds = field.seeds;
        htmlField.innerHTML = "<p>"+seeds+"</p>";
        create_seeds(htmlField, seeds);
    }

    function update_player_side () {
        for (let i = 0; i < board.size; i++) {
            let field = player.fields[i];
            update_field(field);
        }
    }

    function update_opponent_side () {
        for (let i = 0; i < board.size; i++) {
            let field = opp.fields[i];
            update_field(field);
        }
    }

    function update_warehouses() {
        let htmlPlayerWarehouse = document.getElementById("playerWarehouse");
        let playerSeeds = player.warehouse.seeds;
        htmlPlayerWarehouse.innerHTML = playerSeeds;
    
        let htmlOppWarehouse = document.getElementById("oppWarehouse");
        let oppSeeds = opp.warehouse.seeds;
        htmlOppWarehouse.innerHTML = oppSeeds;
    
        create_seeds(htmlPlayerWarehouse, playerSeeds);
        create_seeds(htmlOppWarehouse, oppSeeds);
    }

}

/* end game functions */
function check_win_condition() {
    let playerSeededFields = 0;
    let oppSeededFields = 0;

    for (let i = 0; i < board.size; i++) {
        if (player.fields[i].seeds != 0) {
            playerSeededFields++;
        }
        if (opp.fields[i].seeds != 0) {
            oppSeededFields++;
        }
        if (oppSeededFields > 0 && playerSeededFields > 0) {
            break;
        }
    }

    if (playerSeededFields == 0) {
        game.gameState = 2;
        return player;
    } else if (oppSeededFields == 0) {
        game.gameState = 2;
        return opp;
    }
}

function determine_game_winner() {
    for (let i = 0; i < board.size; i++) {
        player.score += player.fields[i].seeds;
        opp.score += opp.fields[i].seeds;
    }

    player.score > opp.score ? (game.winner = player) : (game.winner = opp);
}

function end_game_procedures() {
    let gameWinnerText = document.getElementById("gameWinner");
    if (game.winner == player) {
        gameWinnerText.textContent = "You won!"
    } else {
        gameWinnerText.textContent = "You lost..."
    }

    document.getElementById("playerScore").textContent += player.score+"\n";
    document.getElementById("oppScore").textContent += opp.score+"\n";

    document.getElementById("endGameOverlay").style.display = "flex";

    update_leaderboard();

    remove_listeners_from_fields();

    function update_leaderboard () {
        let tableBody = document.getElementById("leaderboardTable").getElementsByTagName("tbody")[0];
        let newRow = tableBody.insertRow();
        let nameCell = newRow.insertCell();
        let resultCell = newRow.insertCell();
        let pScoreCell = newRow.insertCell();
        let oScoreCell = newRow.insertCell();
            
        nameCell.textContent = game.winner.id_to_string();
        resultCell.textContent = (game.winner == player) ? "Won" : "Lost";
        pScoreCell.textContent = player.score;
        oScoreCell.textContent = opp.score;

        let bestScoreCell = document.getElementById("bestScore");
        let bestScore = Number(bestScoreCell.textContent);

        if (player.score > bestScore) {
            bestScoreCell.textContent = player.score;
        }
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



/* handle founds bugs (especially the one with owner)
    create AI */