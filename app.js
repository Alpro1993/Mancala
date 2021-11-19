var overlayOpen = 0;

function initial_config() {
    load_board(6);
    assign_event_listeners();
}

function assign_event_listeners() {
    
    /////////Nav Buttons////////////////////////
    document.getElementById("settingsButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        if(overlayOpen == 1) {
            hide_overlay();
        } 
        show_overlay("settingsOverlay");
        overlayOpen = 1;
        
    });

    document.getElementById("rulesButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        if(overlayOpen == 1) {
            hide_overlay();
        } 
        show_overlay("rulesOverlay");
        overlayOpen = 1;
    });

    document.getElementById("leaderboardButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        if(overlayOpen == 1) {
            hide_overlay();
        }  
        show_overlay("leaderboardOverlay");
        overlayOpen = 1;
    });

    document.getElementById("loginButton").addEventListener("click", function(eventObj) {
        eventObj.stopPropagation();
        if(overlayOpen == 1) {
            hide_overlay();
        }  
        show_overlay("loginOverlay");
        overlayOpen = 1;
    });

    document.getElementById("submitSettingsButton").addEventListener("click", function() {
        hide_overlay();
    })

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
    document.getElementById("loginSubmitButton").addEventListener("click", function() {
        hide_login_button();
        show_username();
        hide_overlay();

    });

    //Transforms play button into concede button
    document.getElementById("playGame").addEventListener("click", function() {
        document.getElementById("playGame").style.display = "none";
        document.getElementById("concede").style.display = "block";
    });

    //Transforms concede button into play button
    document.getElementById("concede").addEventListener("click", function() {
        document.getElementById("concede").style.display = "none";
        document.getElementById("playGame").style.display = "block";
    });

    //Trans 

}

function show_overlay(overlayName) {
    const overlay = document.getElementById(overlayName).style;

    overlay.display = "flex";
}

function hide_overlay() {
    var overlays = document.getElementsByClassName("overlay");
    
    //Checks every overlay and hides the first one found to be showing.
    for(let i=0; i < overlays.length; i++) {
        if(overlays[i].style.display == "flex") {
            overlays[i].style.display = "none";
            overlayOpen = 0;
            return;
        }
    }

}

function hide_login_button() {
    document.getElementById("loginButton").remove();
}

function show_username() {
    var buttonBar = document.getElementById("navBar");
    var username = document.getElementById("username").value;
    
    usernameDisplay = document.createElement("BUTTON");
    usernameDisplay.className = "menuButton username";
    usernameDisplay.textContent = "Welcome " + username + "!";

    navBar.appendChild(usernameDisplay);

}

function load_board(size) {

    //Clear any existing board before creating a new one.
    reset_board();

    const board = document.getElementById("board");
    const fieldArea = document.getElementById("fieldArea");

    //Creates opponent warehouse
    let oppWarehouse = document.createElement("div");
    oppWarehouse.className = "warehouse";
    oppWarehouse.id = "oppWarehouse";
    oppWarehouse.innerHTML += '0';
    board.appendChild(oppWarehouse);

    //Creates opponents fields and gives them unique IDs.
    for (let i = 0; i < size; i++) {
        let field = document.createElement("div");
        field.className = "field oppField";
        field.id = i+"OppField" ;
        fieldArea.appendChild(field);
    }

    //Creates players fields and gives them unique IDs.
    for (let i = 0; i < size; i++) {
        let field = document.createElement("div");
        field.className = "field playerField";
        field.id =  i+"PlayerField";

        //field.innerHTML += '<p class="scoreNumber">0</p>';
        fieldArea.appendChild(field);
    }

    //Creates player's warehouse
    let playerWarehouse = document.createElement("div");
    playerWarehouse.className = "warehouse playerWarehouse";
    playerWarehouse.id = "playerWarehouse";
    playerWarehouse.innerHTML += '0';
    board.appendChild(playerWarehouse);

    //Styles board
    fieldArea.style.gridTemplateColumns = "repeat(" + size + ", 100px)";

}

function reset_board() {

    let boardArea = document.getElementById("boardArea");
    let board = document.getElementById("board");
    let fieldArea = document.getElementById("fieldArea");

    //If the fullBoard div already exists, remove it, as we'll be creating a new one.
    if (board != null) {
        board.remove();
    }

    //Create new (empty) board and fullBoard div.
    board = document.createElement("div");
    board.className = "board";
    board.id = "board";
    boardArea.appendChild(board);

    fieldArea = document.createElement("div");
    fieldArea.className = "fieldArea";
    fieldArea.id = "fieldArea";
    board.appendChild(fieldArea);
}