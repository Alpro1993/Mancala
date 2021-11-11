function initial_config() {
    load_board(6);
    assign_event_listeners();

}

function assign_event_listeners() {

    //Overlay toggles
    document.getElementById("settingsOverlay").addEventListener("click", function() {toggle_overlay("settingsOverlay")});
    document.getElementById("rulesOverlay").addEventListener("click", function() {toggle_overlay("rulesOverlay")});
    document.getElementById("leaderboardOverlay").addEventListener("click", function() {toggle_overlay("leaderboardOverlay")});
    
    //Buttons
    document.getElementById("settingsButton").addEventListener("click", function() {event.stopPropagation(); toggle_overlay("settingsOverlay")});
    document.getElementById("rulesButton").addEventListener("click", function() {toggle_overlay("rulesOverlay")});
    document.getElementById("leaderboardButton").addEventListener("click", function() {toggle_overlay("leaderboardOverlay")});

    //Set overlay to off if you click outside it
    document.addEventListener("click", function() {hide_overlay()});
}

function hide_overlay() {
    var overlays = document.getElementsByClassName("overlay");
    
    for(let i=0; i < overlays.length; i++) {
        if(overlays[i].style.display == "block") {
            toggle_overlay(overlays[i].id);
            return;
        }
    }
}

function toggle_overlay(overlayName) {
    const overlay = document.getElementById(overlayName).style;
    const content = document.getElementById("content").style;

    overlay.display === "block" ? (overlay.display = "none", content.filter = "") : (overlay.display = "block", content.filter = "blur(15px)");
}

function load_board(size) {

    reset_board();

    const fullBoard = document.getElementById("fullBoard");
    const board = document.getElementById("board");

    let relativeWidth = 90 / size;

    //Creates opponent warehouse
    let oppWarehouse = document.createElement("div");
    oppWarehouse.className = "warehouse";
    oppWarehouse.id = "oppWarehouse";
    oppWarehouse.innerHTML += '0';
    fullBoard.appendChild(oppWarehouse);

    //Creates opponents fields and gives them unique IDs.
    for (let i = 0; i < size; i++) {
        let field = document.createElement("div");
        field.className = "field oppField";
        field.id = "oppField" + i;
        field.innerHTML += '0';
        board.appendChild(field);
    }

    //Creates players fields and gives them unique IDs.
    for (let i = 0; i < size; i++) {
        let field = document.createElement("div");
        field.className = "field playerField";
        field.id = "playerField" + i;

        field.innerHTML += '0';
        board.appendChild(field);
        field.addEventListener("click", function () { field_clicked(i); });
    }

    //Creates player's warehouse
    let playerWarehouse = document.createElement("div");
    playerWarehouse.className = "warehouse";
    playerWarehouse.id = "playerWarehouse";
    playerWarehouse.innerHTML += '0';
    fullBoard.appendChild(playerWarehouse);

    //Styles board
    board.style.gridTemplateColumns = "repeat(" + size + ", 100px)";

}

function reset_board() {
    let content = document.getElementById("content");
    let board = document.getElementById("board");
    let fullBoard = document.getElementById("fullBoard");

    if (fullBoard != null) {
        board.remove();
        fullBoard.remove();
    }

    fullBoard = document.createElement("div");
    fullBoard.className = "fullBoard";
    fullBoard.id = "fullBoard";
    content.appendChild(fullBoard);

    board = document.createElement("div");
    board.className = "board";
    board.id = "board";
    fullBoard.appendChild(board);
}

