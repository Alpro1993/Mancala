var rulesLoaded = 0;

function initial_config() {
    load_board(6);
    assign_event_listeners();

}

function assign_event_listeners() {

    //Stop overlay from closing when clicking overlay fields
    var overlayMenus = document.getElementsByClassName("overlayMenu");
    for(let i=0; i<overlayMenus.length; i++) {
        overlayMenus[i].addEventListener("click", function(eventObj) {
            eventObj.stopPropagation();
        });
    }

    
    //Buttons
    document.getElementById("settingsButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation(); 
        show_overlay("settingsOverlay");
    });
    document.getElementById("rulesButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        show_overlay("rulesOverlay");
        load_rules();
    });
    document.getElementById("leaderboardButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation(); 
        show_overlay("leaderboardOverlay")
    });
    document.getElementById("loginButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation(); 
        show_overlay("loginOverlay")
    });

    //Set overlay to off if you click outside it
    document.addEventListener("click", function() {
        hide_overlay()
    });
}

function show_overlay(overlayName) {
    const overlay = document.getElementById(overlayName).style;
    const content = document.getElementById("content").style;

    overlay.display = "flex";
    content.filter = "blur(15px)";
}

function hide_overlay() {
    var overlays = document.getElementsByClassName("overlay");
    const content = document.getElementById("content").style;
    
    for(let i=0; i < overlays.length; i++) {
        if(overlays[i].style.display == "flex") {
            content.filter = "";
            overlays[i].style.display = "none"
            return;
        }
    }

    
}


function load_board(size) {

    //Clear any existing board before creating a new one.
    reset_board();

    const fullBoard = document.getElementById("fullBoard");
    const board = document.getElementById("board");

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

    //If the fullBoard div already exists, remove it, as we'll be creating a new one.
    if (fullBoard != null) {
        board.remove();
        fullBoard.remove();
    }

    //Create new (empty) board and fullBoard div.
    fullBoard = document.createElement("div");
    fullBoard.className = "fullBoard";
    fullBoard.id = "fullBoard";
    content.appendChild(fullBoard);

    board = document.createElement("div");
    board.className = "board";
    board.id = "board";
    fullBoard.appendChild(board);
}

function load_rules() { 

    //Check if rules have been loaded before
    if (rulesLoaded != 0) {
        return;
    }
    
    //Allows for easier changing of type of list, if necessary
    var typeOfList = "LI";
    
    const rulesOverlay = document.getElementById("rulesOverlay");

    var rulesList = document.createElement("DIV");
    rulesList.className = "overlayMenu";
    rulesList.id = "rulesList";

    rulesOverlay.appendChild(rulesList);
    
    //Create a title and style it.
    var title = document.createElement("H1");
    title.textContent += "Rules";
    title.style.textAlign = "center";
    rulesList.appendChild(title);
    rulesList.appendChild(document.createElement("hr"));


    //Rules copied from https://endlessgames.com/wp-content/uploads/Mancala_Instructions.pdf
    //prepare rules for appending
    const rules = []
    
    rules[0] = document.createElement(typeOfList);
    rules[0].textContent += "The game begins with one player picking up all of the pieces in any one of the pockets on his/her side";
    
    rules[1] = document.createElement(typeOfList);
    rules[1].textContent += "Moving counter-clockwise, the player deposits one of the stones in each pocket until the stones run out";
    
    rules[2] = document.createElement(typeOfList);
    rules[2].textContent += "If you run into your own Mancala(store), deposit one piece in it. If you run into your opponent's Mancala, skip it and continue moving to the next pocket.";
    
    rules[3] = document.createElement(typeOfList);
    rules[3].textContent += "If the last piece you drop is in your own Mancala, you take another turn";
    
    rules[4] = document.createElement(typeOfList);
    rules[4].textContent += "If the last piece you drop is in an empty pocket on your side, you capture that piece adn any pieces in the pocket directly opposite.";
    
    rules[5] = document.createElement(typeOfList);
    rules[5].textContent += "Always place all capture pieces in your Mancala(store)";
    
    rules[6] = document.createElement(typeOfList);
    rules[6].textContent += "The game ends when all six pockets on one side of the Mancala board are empty.";
    
    rules[7] = document.createElement(typeOfList);
    rules[7].textContent += "The player who still has pieces on his/her side of the board when the game ends captures all of those pieces.";
    
    rules[8] = document.createElement(typeOfList);
    rules[8].textContent += "Count all the pieces in each Mancala. The winner is the player with the most pieces.";

    //Append every rule while also creating a line break between each.
    for(let i = 0; i < 9; i++) {
        rulesList.appendChild(document.createElement("br"));
        rulesList.appendChild(rules[i]);
    }

    //Stop rules from being loaded again
    rulesLoaded = 1;

}

