
// createRandomGrid fills half the nodes as wall nodes. 

let createRandomGrid = function(src, dstn){
    
    let squareIDs = Array.from(document.getElementsByClassName("gridSq")).map(x => x.id);
    let numSquares = squareIDs.length;
    
    let randomIndices = Array(Math.floor(numSquares / 2)).fill(0);
    let wallNodes = randomIndices.map(x => Math.floor(Math.random() * numSquares));
    
    source = src;
    destination = dstn;

    let sourceIdx = extractIndices(source);
    let destinationIdx = extractIndices(destination);
    
    gridArray[sourceIdx[0]][sourceIdx[1]] = 0;
    gridArray[destinationIdx[0]][destinationIdx[1]] = "*";
    
    
    sNodeIsSet = true;
    eNodeIsSet = true;
    
    let i = 1;
    
    for(const ind of wallNodes){

        if(!(squareIDs[ind] == src || squareIDs[ind] == dstn)){

            i++;

            setTimeout(() => {

                document.getElementById(squareIDs[ind]).classList.add("wall");
                let sqIndices = extractIndices(squareIDs[ind]);
                let rowIdx = sqIndices[0];
                let colIdx = sqIndices[1];
                gridArray[rowIdx][colIdx] = 'X';
                
            }, i);
            
        }
        
    }

    setTimeout(() => {

        document.getElementById(source).classList.add("startNode");
        document.getElementById(destination).classList.add("endNode");
        
    }, 1000)

}

// creates pyramid structure for devices with screen width > 768

let createPyramid = function(elemId){
    
    let startIdx = extractIndices(elemId);
    let idx1 = startIdx[0];
    let idx2 = startIdx[1];
    let k = 0;
    let i = 10;

    for(let j = 0; j < gridCol; j++){
        
        i++;
        
        setTimeout(() => {
            
            // left vertical frame

            if(getNodeId(idx1 - j, idx2) != null){
                createWallNode(getNodeId(idx1 - j, idx2));
            }

            // left pyramid edge 

            if(idx1 - j != 0 && getNodeId(idx1 - j, idx2 + j) != null){
                createWallNode(getNodeId(idx1 - j, idx2 + j));
            }

            // pyramid base

            if(getNodeId(idx1, idx2 + j) != null){
                createWallNode(getNodeId(idx1, idx2 + j));
            }
        
            if(idx1 - j == 0){
                k++;
            }

            // right pyramid edge

            if(k > 0 &&  k + 1 != gridRow - 2){

                if(getNodeId(k + 1, idx2 + j) != null){
                 
                    createWallNode(getNodeId(k + 1, idx2 + j));
                    k++;

                }

            }
            
        }, 10 * i)
   
    }

}

// createSpiral makes use of sequences to find the number of left, right, up and down
// moves to create the spiral. 

let createSpiral = function(){

    let centreRow = Math.round((gridRow / 2)) - 1;
    let centreCol = Math.round((gridCol / 2)) - 1;

    source = getNodeId(centreRow, centreCol);
    destination = "sqR5c39";

    let destinationIdx = extractIndices(destination);
    
    gridArray[centreRow][centreCol] = 0;
    gridArray[destinationIdx[0]][destinationIdx[1]] = "*";
    

    sNodeIsSet = true;
    eNodeIsSet = true;

    let currentNode = [centreRow - 2, centreCol];

    // starting wall node

    createWallNode(getNodeId(currentNode[0], currentNode[1]));

    // 6 works best for this case. TODO - make this variable with screen height
    
    for(let i = 0; i < 6; i++){

        for(let l = 0; l < 2 + (i * 4); l++){

            currentNode = rightMove(currentNode);
            createWallNode(getNodeId(currentNode[0], currentNode[1]), true, 
            (i + l) * 50);

        }

        for(let m = 0; m < 4 + (i * 4); m++){

            currentNode = downMove(currentNode);
            createWallNode(getNodeId(currentNode[0], currentNode[1]), true, 
            (i + m) * 50);

        }

        for(let j = 0; j < 4 + (i * 4); j++){

            currentNode = leftMove(currentNode);
            createWallNode(getNodeId(currentNode[0], currentNode[1]), true, 
            (i + j) * 50);

        }

        for(let k = 0; k < 6 + (i * 4); k++){

            if(i == 5 && (k == 6 + (i * 4) - 2)) break;

            currentNode = upMove(currentNode);
            createWallNode(getNodeId(currentNode[0], currentNode[1]), true, 
            (i + k) * 50);

        }
        
        setTimeout(() => {

            document.getElementById(source).classList.add("startNode");
            document.getElementById(destination).classList.add("endNode");
            
        }, 1250);
        
    }
    
}

// The following four functions are mainly for use in createSpiral.

let leftMove = function(coordinates){

    let rowCoord = coordinates[0]; 
    let colCoord = coordinates[1] - 1;
    return [rowCoord,colCoord];

}


let rightMove = function(coordinates){

    let rowCoord = coordinates[0];
    let colCoord = coordinates[1] + 1;
    return [rowCoord,colCoord];

}



let upMove = function(coordinates){

    let rowCoord = coordinates[0] - 1;
    let colCoord = coordinates[1];
    return [rowCoord,colCoord];

}



let downMove = function(coordinates){

    let rowCoord = coordinates[0] + 1;
    let colCoord = coordinates[1]; 
    return [rowCoord,colCoord];

}


let createFace = function(){
    
    let centreRow = Math.round((gridRow / 2)) - 1;
    let centreCol = Math.round((gridCol / 2)) - 1;
    
    source = getNodeId(centreRow, centreCol);
    destination = "sqR5c39";

    let destinationIdx = extractIndices(destination);
    
    gridArray[centreRow][centreCol] = 0;
    gridArray[destinationIdx[0]][destinationIdx[1]] = "*";
    
    sNodeIsSet = true;
    eNodeIsSet = true;
    let radius = 12; 
    
    let squares = Array.from(document.getElementsByClassName("gridSq"));
    
    let circleIds = squares.map(x => {
        
        // (x - c1)^2 + (y - c2)^2 = r^2
        
        let indices = extractIndices(x.id);
        let distFromCentre = Math.round(Math.pow((indices[0] - centreRow), 2) + 
        Math.pow((indices[1] - centreCol), 2));
        
        // only want nodes on or roughly around the circumference of the circle

        if(distFromCentre >= Math.pow(radius,2) - (radius - 1) && 
        distFromCentre <= Math.pow(radius,2) + (radius + 1)){

            return x.id;

        }

        return 0;

    })

    let i = 0;

    // draw circle

    for(const elem of circleIds){

        if(elem != 0){

            let idx = extractIndices(elem);

            if(idx[0] == centreRow + radius && idx[1] == centreCol){
                continue;
            }

            gridArray[idx[0]][idx[1]] = "X";
            createWallNode(elem, true, 40 * i);
            i++;

        }
        
    }
    
    let leftEye =  getNodeId(Math.round((centreRow - (radius / 2))), 
    Math.round((centreCol - (radius / 2))));

    let rightEye =  getNodeId(Math.round((centreRow - (radius / 2))), 
    Math.round((centreCol + (radius / 2))));
    
    if(radius > 8){

        let idx1 = extractIndices(leftEye);
        let idx2 = extractIndices(rightEye);

        // shade in eye nodes
        
        createWallNode(getNodeId(idx1[0], (idx1[1] + 1)) ,true, 40 * i);
        createWallNode(getNodeId((idx1[0] + 1), (idx1[1] + 1)) ,true, 40 * i);
        createWallNode(getNodeId((idx1[0] + 1), idx1[1]), true, 40 * i);
        createWallNode(getNodeId(idx2[0], (idx2[1] + 1)) ,true, 40 * i);
        createWallNode(getNodeId((idx2[0] + 1), (idx2[1] + 1)) , true, 40 * i);
        createWallNode(getNodeId((idx2[0] + 1), idx2[1]), true, 40 * i);
    }

    createWallNode(leftEye, true, 40 * i);
    createWallNode(rightEye, true, 40 * i);


    let arcIds = squares.map(x => {

        let indices = extractIndices(x.id);
        let distFromCentre = Math.round(Math.pow((indices[0] - centreRow), 2) + 
        Math.pow((indices[1] - centreCol), 2));
        
        if(distFromCentre >= Math.pow(radius / 1.5, 2) - ((radius / 1.5) - 1) && 
        distFromCentre <= Math.pow((radius / 1.5), 2) + ((radius / 1.5) + 1)){
            
            return x.id;
        }

        return 0;
    })

    for(const elem of arcIds){

        if(elem != 0){

            let idx = extractIndices(elem);

            if(idx[0] > centreRow + 1){

                gridArray[idx[0]][idx[1]] = "X";
                createWallNode(elem, true, 40 * i);
                i++;

            }
            
        }
        
    }
    
    setTimeout(() => {

        document.getElementById(source).classList.add("startNode");
        document.getElementById(destination).classList.add("endNode");

    }, (40 * i) + 1);


}

// Modified version of createPyramid for mobile devices. 
// createSpiral makes use of sequences to find the number of left, right, up and down
// moves to create the spiral. 

let createPyramidM = function(elemId){
    
    let startIdx = extractIndices(elemId);
    let idx1 = startIdx[0];
    let idx2 = startIdx[1];
    let k = 0;
    let i = 10;
    let rowChange = "*"
    for(let j = 0; j < gridCol; j++){
        
        i++;
        
        setTimeout(() => {
            
            if(getNodeId(idx1 - j, idx2) != null){
                createWallNode(getNodeId(idx1 - j, idx2));
            }

            if(idx2 + j < Math.round(gridCol / 2) && getNodeId(idx1 - j, idx2 + j) != null){
                createWallNode(getNodeId(idx1 - j, idx2 + j));
            }

            if(getNodeId(idx1, idx2 + j) != null){
                createWallNode(getNodeId(idx1, idx2 + j));
            }
        
            if(idx2 + j == Math.round(gridCol / 2)){
                rowChange = idx1 - j;
                k++;
            }

            if(k > 0 &&  rowChange + k + 1 != gridRow - 2){

                if(getNodeId(rowChange - (k + 1), idx2 + j) != null){
                    
                    createWallNode(getNodeId(rowChange + k + 1, idx2 + j));
                    k++;

                }

            }
            
        }, 10 * i)
   
    }

}