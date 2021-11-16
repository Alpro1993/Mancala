function initial_config() {
    load_board(6);
    assign_event_listeners();

}

function assign_event_listeners() {
    
    /////////Nav Buttons////////////////////////
    document.getElementById("settingsButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation(); 
        show_overlay("settingsOverlay");
    });
    document.getElementById("rulesButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        show_overlay("rulesOverlay");
    });
    document.getElementById("leaderboardButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation(); 
        show_overlay("leaderboardOverlay")
    });
    document.getElementById("loginButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation(); 
        show_overlay("loginOverlay")
    });

    ////////////Radio Buttons////////////////
    //Board Size Buttons
    document.getElementById("boardSize2").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        load_board(2);
    });
    document.getElementById("boardSize3").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        load_board(3);
    });
    document.getElementById("boardSize4").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        load_board(4);
    });
    document.getElementById("boardSize6").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        load_board(6);
    });
    document.getElementById("submitSettings").addEventListener("click", hide_overlay);

    ////////Handling of overlay clicks
    //Stop overlays from closing if you click inside the white area
    var overlays = document.getElementsByClassName("overlay");
    for(let i=0; i<overlays.length; i++) {
        overlays[i].addEventListener("click", function(eventObj) {
            eventObj.stopPropagation();
        });
    }

    //Stop overlay from closing when clicking overlay fields
    var overlayMenus = document.getElementsByClassName("overlayMenu");
    for(let i=0; i<overlayMenus.length; i++) {
        overlayMenus[i].addEventListener("click", function(eventObj) {
            eventObj.stopPropagation();
        });
    }

    //Set overlay to off if you click outside it
    document.addEventListener("click", hide_overlay);

    //Disable login and replace with user's name
    //This actually only transforms the original button into one that has no function and shows the username.
    document.getElementById("loginSubmit").addEventListener("click", function() {
        hide_login_button();
        show_username();
        hide_overlay();
    })

    //Hide "Play Game" and show "Concede" button
    document.getElementById("playGame").addEventListener("click", function() {
        document.getElementById("boardOverlay").style.display = "none";
        document.getElementById("fullBoard").style.filter = "blur(0px)";
        document.getElementById("concedeButton").style.display = "block";
    });

    //Hide "Concede" button and show end-game screen 
    //(which currently does not exist, so we show play button again)
    document.getElementById("concedeButton").addEventListener("click", function() {
        document.getElementById("concedeButton").style.display = "none";
        document.getElementById("boardOverlay").style.display = "inline-flex";
        document.getElementById("fullBoard").style.filter = "blur(15px)"
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
    const contentStyle = document.getElementById("content").style;
    
    //Checks every overlay and hides the first one found to be showing.
    for(let i=0; i < overlays.length; i++) {
        if(overlays[i].style.display == "flex") {
            contentStyle.filter = "";
            overlays[i].style.display = "none"
            return;
        }
    }
}

function hide_login_button() {
    document.getElementById("loginButton").remove();
}

function show_username() {
    var buttonBar = document.getElementById("buttonBar");
    var username = document.getElementById("username").value;
    
    usernameDisplay = document.createElement("BUTTON");
    usernameDisplay.className = "loginButton";
    usernameDisplay.textContent = "Welcome " + username + "!";

    buttonBar.appendChild(usernameDisplay);

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
    if (board != null) {
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