function load_board (size) {
    
    reset_board();

    const fullBoard = document.getElementById("fullBoard");
    const board = document.getElementById("board");

    let relativeWidth = 90 / size;
    
    let oppWarehouse = document.createElement("div");
    oppWarehouse.className = "warehouse";
    oppWarehouse.id = "oppWarehouse";
    fullBoard.appendChild(oppWarehouse);

    //Creates opponents fields and gives them unique IDs.
    for(let i=0; i<size; i++){
        let field = document.createElement("div");
        field.className = "field";
        field.id = "oppField"+i;
        board.appendChild(field);
    }




    
    //Creates players fields and gives them unique IDs.
    for(let i=0; i<size; i++){
        let field = document.createElement("div");
        field.className = "field";
        field.id = "playerField"+i;
        board.appendChild(field);
    }

    let playerWarehouse = document.createElement("div");
    playerWarehouse.className = "warehouse";
    playerWarehouse.id = "playerWarehouse";
    fullBoard.appendChild(playerWarehouse);

    board.style.cssText = "display: grid; grid-template-rows: repeat(2, 50%); grid-template-columns: repeat("+size+", 100px); align-content: center; order: 2; grid-gap: 10px;";

}

//"+relativeWidth+"

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
