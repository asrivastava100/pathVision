
// createRow creates a div to represent a row in a grid (divTA).

let createRow = function(divTA, id, className = null){

    let newDiv = document.createElement("div");
    newDiv.setAttribute("id", id);

    if(className != null){

        newDiv.setAttribute("class", className);

    }

    divTA.appendChild(newDiv);

}

// createSquare creates a grid square. 

let createSquare = function(divTA, id, className = null){

    createRow(divTA, id, className);

}

// createGrid creates the grid in the DOM and 
// fills gridArray - an internal matrix representation of the grid.

let createGrid = function(nrow, ncol){
    
    for(let i = 0; i < nrow; i++){

        createRow(grid, "r" + i);
        let row = document.getElementById("r" + i);
        
        for(let j = 0; j < ncol; j++){
            createSquare(row, getNodeId(i, j), "gridSq");
            gridArray[i][j] = 1;

        }

    }   

}

// Given a row Idx and a col Idx, getNodeId returns the DOM id for a grid square 
// provided it is valid. 

let getNodeId = function(rowIdx, colIdx){
    
    if((rowIdx < gridRow) && (colIdx < gridCol) && (rowIdx >= 0) && (colIdx >= 0)){

        return "sqR" + rowIdx + "c" + colIdx;

    }

    return null;
     
}

// Given the id for a grid squre, extractIndices returns the row Idx and col Idx
// for the grid square.

let extractIndices = function(NodeId){

    let rowIdx = parseInt(NodeId.substr(3, NodeId.indexOf('c')));
    let colIdx = parseInt(NodeId.substr(NodeId.indexOf('c') + 1));

    return [rowIdx,colIdx];
}

// getNodeNeighbours returns the top,right,bottom and left neighbours of the node
// with nodeId. Wall nodes are not added. 

let getNodeNeighbours = function(nodeId){
    
    let indices = extractIndices(nodeId);
    let rowIdx = indices[0];
    let colIdx = indices[1];
    let neighbours = [];
    
    //Top neighbour
    
    if(rowIdx != 0 && gridArray[rowIdx-1][colIdx] != "X"){
        neighbours.push(getNodeId((rowIdx - 1), colIdx));
    }

    //Right neighbour
    
    if(colIdx != gridCol - 1 && gridArray[rowIdx][colIdx+1] != "X"){
        neighbours.push(getNodeId(rowIdx, (colIdx + 1)));
    }
    
    //Bottom neighbour 
    
    if(rowIdx != gridRow- 1 && gridArray[rowIdx+1][colIdx] != "X"){
        neighbours.push(getNodeId((rowIdx + 1), colIdx));
    }

    //Left neighbour
    
    if(colIdx != 0 && gridArray[rowIdx][colIdx-1] != "X"){
        neighbours.push(getNodeId(rowIdx, (colIdx - 1)));
    }
 
    return neighbours;
  
}

// dispMessage is used to display messages on the navbar

let dispMessage = function(message){

    status.classList.add("dispMessage");
        status.innerHTML = message;

        setTimeout(() => {

            status.classList.remove("dispMessage");
            status.innerHTML = "";

        }, 1000);

}

// createWallNode creates a wall node by adding "wall" class to the grid square
// and representing it as "X" in gridArray. User can choose if they want animation
// setting the withTimeout and timeout settings.

let createWallNode = function(elemId, withTimout = false, timeout = 0){
    
    let node = document.getElementById(elemId);

    if(!(node.classList.contains("startNode") || 
    node.classList.contains("endNode"))){

        if(withTimout){

            setTimeout(() => {

                node.classList.add("wall");

            }, timeout)

        } else{

            node.classList.add("wall");
            
        }

        let sqIndices = extractIndices(elemId);
        let rowIdx = sqIndices[0];
        let colIdx = sqIndices[1];
        gridArray[rowIdx][colIdx] = 'X';

    }

}

// resetGrid removes all formatting from grid squares as well as resets all 
// parameters to their original state.

let resetGrid = function(){

    wallIsActive = false;
    wallStarted = false;
    wallEraseIsActive = false;
    wallErase = false;
    sNodeIsActive = false;
    sNodeIsSet = false;
    eNodeIsActive = false;
    eNodeIsSet = false;
    sENodeFlag = false;
    isResultDisplayed = false;
    nodeWeights = [];

    Array.from(document.getElementsByClassName("gridSq")).forEach(x => {
        
        x.classList.remove("seen");
        x.classList.remove("found");
        x.classList.remove("path");
        x.classList.remove("wall");
        x.classList.remove("weightNode");

        let indices = extractIndices(x.id);
        gridArray[indices[0]][indices[1]] = 1;

    })

    if(source){
        document.getElementById(source).classList.remove("startNode");
        source = undefined;

    } 

    if(destination){
        document.getElementById(destination).classList.remove("endNode");
        destination = undefined;

    }

}

// resetFormatting removes path formatting.

let resetFormatting = function(){
    Array.from(document.getElementsByClassName("gridSq")).forEach(x => {

        x.classList.remove("path");
        x.classList.remove("found");
        x.classList.remove("seen");

    })
}