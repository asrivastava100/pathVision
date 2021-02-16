
// trackBack recovers the shortest path after the algorithm is run.
// It does this by working backwards from destination (nodeToFind),
// and appending its parent node to the path list. It will then continue
// to add the parent node of the most recently added node until source is reached.

let trackBack = function(parent, source, nodeToFind){

    let path = [nodeToFind];

    while(path[path.length - 1] != source){

        path.push(parent[path[path.length - 1]]);

    } 
    
    path.reverse();

    return path;

}

// carries out Breadth First Search

let BFS = function(source, nodeToFind){

    let queue = [];
    let animatedNodes = [];
    let alreadyVisited = {};
    let parent = {};

    alreadyVisited[source] = true;

    queue.push(source);

    while(queue.length != 0 ){

        let currentNode = queue.shift();
        animatedNodes.push(currentNode);

        if(currentNode == nodeToFind){

            return [currentNode, animatedNodes, trackBack(parent, source, nodeToFind)];
        }

        for(const elem of getNodeNeighbours(currentNode)){

            if(!(elem in alreadyVisited)){

                queue.push(elem);
                alreadyVisited[elem] = true;
                parent[elem] = currentNode;

            }

        }

    }

    return ["*", animatedNodes, []];

}

// carries out Depth First Search

let DFS = function(source, nodeToFind){

    let stack = [];
    let alreadyVisited = {};
    let parent = {};

    stack.push(source);

    while(stack.length > 0 ){
        let currentNode = stack.pop();
        
        alreadyVisited[currentNode] = true;

        if(currentNode == nodeToFind){
            return [currentNode, Object.keys(alreadyVisited), trackBack(parent, source, nodeToFind)];
        }
        
        for(const elem of getNodeNeighbours(currentNode)){

            if(!(elem in alreadyVisited)){

                stack.push(elem);
                parent[elem] = currentNode;

            }   

        }
 
    }

    return ["*", Object.keys(alreadyVisited),[]];

        
}


let visualiseBFS = function(){
    
    let res = BFS(source, destination);
    let i = 0;
    
    // illuminate nodes explored

    for(const elem of res[1]){

        setTimeout(() => {

            let node = document.getElementById(elem);
            if(!(node.classList.contains("startNode") || 
            node.classList.contains("endNode"))){

                node.classList.add("seen");

            } 

        }, i * 1.3);
        
        i++;

    }

    if(res[0] == "*"){

        dispMessage("No path found.");

    } else{

        // restore nodes to original to prepare to show path.

        for(const elem of res[1]){

            setTimeout(() => {

                let node = document.getElementById(elem);

                if(!(node.classList.contains("startNode") || 
                node.classList.contains("endNode"))){

                    node.classList.remove("seen");

                } 

            }, i * 1.5);
            
            i++;
            
        }

        let path = res[2];

        // show final path

        for(const elem of path){

            setTimeout(() => {

                let node = document.getElementById(elem);
                if(!(node.classList.contains("startNode") || node.classList.contains("endNode"))){
                    node.classList.add("found");
                    node.classList.add("path");
                } 
                
            }, i * 1.7);
        
            i++;
            
        }
        
    }
}


let visualiseDFS = function(){

    let res = DFS(source, destination);
    
    let i = 0;
    
    // illuminate explored nodes

    for(const elem of res[1]){

        setTimeout(() => {

            let node = document.getElementById(elem);

            if(!(node.classList.contains("startNode") || 
            node.classList.contains("endNode"))){

                node.classList.add("seen");

            }
            
        }, i * 1.3);
        
        i++;

    }

    if(res[0] == "*"){

        dispMessage("No path found.");

    } else{

        // restore nodes to original to prepare to show path.

        for(const elem of res[1]){

            setTimeout(() => {

                let node = document.getElementById(elem);

                if(!(node.classList.contains("startNode") || 
                node.classList.contains("endNode"))){

                    node.classList.remove("seen");

                }
                
            }, i * 1.7);
            
            i++;

        }

        let path = res[2];

        // show final path

        for(const elem of path){
            
            setTimeout(() => {
                
                let node = document.getElementById(elem);

                if(node.classList.contains("startNode") || 
                node.classList.contains("endNode")){

                } else{
                    
                    node.classList.add("found");
                    node.classList.add("path");
                       
                }
                
                
            }, i * 1.9);

            i++;

        }

    }

}

// Find the minimum grid square in arr based on information from costMatrix 
// where costMatrix contains information about distance from source. 
// return the DOM id of this grid square.

let arrayMin = function(arr, costMatrix){

    let firstIdx = extractIndices(arr[0]);
    let currentMin = costMatrix[firstIdx[0]][firstIdx[1]];
    let currentMinIdx = [firstIdx[0],firstIdx[1]];

    for(let i = 1; i < arr.length; i++){

        let elemIdx = extractIndices(arr[i]);

        if(costMatrix[elemIdx[0]][elemIdx[1]] < currentMin){

            currentMin = costMatrix[elemIdx[0]][elemIdx[1]];
            currentMinIdx = [elemIdx[0], elemIdx[1]]; 

        }

    }

    return getNodeId(currentMinIdx[0], currentMinIdx[1]);

}


// carries out dijkstra's algorithm.

let dijkstra = function(weightNodes = []){

    let costMatrix = gridArray.map(x => x.map(y => y == 0 ? 0 : Infinity));
    let weightMatrix = gridArray.map(x => x.map(y => y == "X" ? Infinity : 1));

    let sourceIdx = extractIndices(source);
    weightMatrix[sourceIdx[0]][sourceIdx[1]] = 0;

    for(const weightNode of weightNodes){

        let wIdx = extractIndices(weightNode);
        
        weightMatrix[wIdx[0]][wIdx[1]] = 4;
        
    }
    
    let queue = Array.from(document.getElementsByClassName("gridSq")).map(x => x.id);
    let parent = {};
    let exploredNodes = [];
    
    while(queue.length > 0){

        let v = arrayMin(queue, costMatrix);
        
        if(costMatrix[extractIndices(v)[0]][extractIndices(v)[1]] == Infinity){
            break;
        }
    
        queue = queue.filter(item => item != v);
        
        let vIdx = extractIndices(v);
        exploredNodes.push(v);

        let neighbours = getNodeNeighbours(v);

        for(const elem of neighbours){

            let elemIdx = extractIndices(elem);
            
            let altPath = costMatrix[vIdx[0]][vIdx[1]] + weightMatrix[elemIdx[0]][elemIdx[1]];

            if(altPath < costMatrix[elemIdx[0]][elemIdx[1]]){

                parent[elem] = v;
                costMatrix[elemIdx[0]][elemIdx[1]] = altPath;

            }

            if(elem == destination){
                
                return [costMatrix, trackBack(parent,source,destination), exploredNodes];

            } 

        }

    } 
    
    return [costMatrix, null, exploredNodes];

}


let visualiseDijkstra = function(weightNodes = []){

    let res = dijkstra(weightNodes);
    
    let i = 0;

    // illuminate explored nodes.
    
    for(const elem of res[2]){

        setTimeout(() => {

            let node = document.getElementById(elem);

            if(!(node.classList.contains("startNode") || 
            node.classList.contains("endNode") || 
            node.classList.contains("weightNode"))){

                node.classList.add("seen");

            }
            
        }, i * 1.3);
        
        i++;

    }

    if(res[1] == null){

        dispMessage("No path found.");

    } else{

        // restore nodes to original to prepare to show path.

        for(const elem of res[2]){

            setTimeout(() => {

                let node = document.getElementById(elem);

                if(!(node.classList.contains("startNode") || 
                node.classList.contains("endNode"))){

                    node.classList.remove("seen");

                }
                
            }, i * 1.7);
            
            i++;

        }

        let path = res[1];

        if(path){

            // show final path

            for(const elem of path){
            
                setTimeout(() => {
                    
                    let node = document.getElementById(elem);
    
                    if(node.classList.contains("startNode") || 
                    node.classList.contains("endNode")){
    
                    } else{
                        
                        node.classList.add("found");
                        node.classList.add("path");
                           
                    }
                    
                    
                }, i * 1.9);
    
                i++;
    
            }

        }
        

    }

}



