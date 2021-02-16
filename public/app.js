// global variables.



let container = document.getElementById("container");
let grid = document.getElementById("mainGrid");
let sENodeBtn = document.getElementById("sENodeBtn");
let wallBtn = document.getElementById("wallBtn");
let BFSBtn = document.getElementById("BFSBtn");
let DFSBtn = document.getElementById("DFSBtn");
let DijBtn = document.getElementById("DijBtn");
let resetBtn = document.getElementById("resetBtn");
let findPathBtn = document.getElementById("findPathBtn");
let wallEraseBtn = document.getElementById("wallEBtn");
let spiralBtn = document.getElementById("spiralBtn");
let pyrBtn = document.getElementById("pyrBtn");
let randBtn = document.getElementById("randBtn");
let faceBtn = document.getElementById("faceBtn");
let status = document.getElementById("status");
let progress = document.getElementById("progress");         
let burgerIcon = document.getElementById("burger1");
let navbarMenu = document.getElementById("navbarMain");
let sENodeFlag = false;
let sNodeIsActive = false;
let eNodeIsActive = false;
let wallIsActive = false;
let wallEraseIsActive = false;
let sNodeIsSet = false;
let eNodeIsSet = false;
let wallStarted = false;
let wallErase = false; 
let isResultDisplayed = false;
let source;
let destination;
let gridCol = 50;  
let gridRow = 27;   
let gridArray;
let nodeWeights = [];

// Creates the grid internally as well as in the DOM. Decides the values of gridCol
// and gridRow based on screen size.

window.onload = (e) => {
    if(window.outerWidth <= 768){
        gridCol = 40;
        gridRow = 60;
    }
    gridArray = Array(gridRow).fill(0);
    gridArray = gridArray.map(x => []);
    createGrid(gridRow,gridCol)
    
};

// Event Listeners

burgerIcon.addEventListener('click', () => {
    
    navbarMenu.classList.toggle('is-active');

})

document.addEventListener('click', (e) => {
    
    if(e.target.classList.contains("gridSq")){
        
        let sqIndices = extractIndices(e.target.id);
        let rowIdx = sqIndices[0];
        let colIdx = sqIndices[1];

        // set start node.
        
        if(sNodeIsActive && !(sENodeFlag)){

            e.target.classList.add("startNode");
            e.target.classList.remove("wall");
            
            gridArray[rowIdx][colIdx] = 0;
            source = getNodeId(rowIdx, colIdx);
            
            dispMessage("Start Node selected successfully!");
            
            sNodeIsSet = true;
            sENodeFlag = true;
            sNodeIsActive = false;
            
            setTimeout(() => {
                status.classList.add("dispMessage");
                status.innerHTML = "Waiting for end node selection...";
            }, 1000)
                       
            
        } else if(eNodeIsActive && sENodeFlag){

            // set end node.

            e.target.classList.add("endNode");
            e.target.classList.remove("wall");
            
            gridArray[rowIdx][colIdx] = '*';
            destination = getNodeId(rowIdx, colIdx);
            
            eNodeIsSet = true;
            sENodeFlag = false;
            eNodeIsActive = false;
            
            dispMessage("End node selected successfully!");
                 
        }

        // click to stop drawing wall

        if(wallStarted){
            wallIsActive = false;
            wallStarted = false;
            dispMessage("Wall drawn successfully!");
        }

        // click to start drawing wall

        if(wallIsActive){
            wallStarted = true;
            status.classList.add("dispMessage");
            status.innerHTML = "Drawing wall... Please select a node to stop drawing.";
        } 

        // click to stop erasing wall

        if(wallErase){
            wallEraseIsActive = false;
            wallErase = false;
            dispMessage("Erased successfully!");
        }

        // click to start erasing wall

        if(wallEraseIsActive){
            wallErase = true;
            status.classList.add("dispMessage");
            status.innerHTML = "Erasing wall... Please select a node to stop erasing.";
        }

        
    }

})


document.addEventListener("mouseover", (e) => {

    // draw wall by hovering over grid square.
    
    if(wallStarted && e.target.classList.contains("gridSq") && 
    !(e.target.classList.contains("startNode") || 
    e.target.classList.contains("endNode") || 
    e.target.classList.contains("weightNode"))){

        e.target.classList.add("wall");
        let sqIndices = extractIndices(e.target.id);
        let rowIdx = sqIndices[0];
        let colIdx = sqIndices[1];
        gridArray[rowIdx][colIdx] = 'X';
       
    }

    // erase wall by hovering over grid square.

    if(wallErase && e.target.classList.contains("gridSq") && 
    !(e.target.classList.contains("startNode") || 
    e.target.classList.contains("endNode"))){
        
        e.target.classList.remove("wall");
        let sqIndices = extractIndices(e.target.id);
        let rowIdx = sqIndices[0];
        let colIdx = sqIndices[1];
        gridArray[rowIdx][colIdx] = 1;
       
    }

})


sENodeBtn.addEventListener("click", () => {

    // activate start and end node selection.
    
    navbarMenu.classList.remove('is-active');
    
    if(eNodeIsSet || sNodeIsSet){
        
        eNodeIsSet = false;
        sNodeIsSet = false;
        
        let destinationIdx = extractIndices(destination);
        let sourceIdx = extractIndices(source);
        
        gridArray[destinationIdx[0]][destinationIdx[1]] = 1;
        gridArray[sourceIdx[0]][sourceIdx[1]] = 1;
        
        document.getElementById(source).classList.remove("startNode");
        document.getElementById(destination).classList.remove("endNode");
        
        resetFormatting();

    } 

    sNodeIsActive = true;
    eNodeIsActive = true;
    status.classList.add("dispMessage");
    status.innerHTML = "Waiting for start node selection...";
    
})

wallBtn.addEventListener("click", (e) => {

    // activate wall drawing mode
    
    navbarMenu.classList.toggle('is-active');
    wallEraseIsActive = false;
    wallErase = false;
    
    resetFormatting()
    
    wallIsActive = true;
    status.classList.add("dispMessage");
    status.innerHTML = "Click on a node to begin drawing wall.";
     
})

resetBtn.addEventListener("click", (e) => {

    resetGrid();
    dispMessage("Reset complete!");
    navbarMenu.classList.toggle('is-active');
    
})

// findPathBtn will initiate the visualisation. 

findPathBtn.addEventListener("click", (e) => {
    
    navbarMenu.classList.toggle("is-active");
    navbarMenu.classList.add("locked");
    
    resetFormatting();

    progress.classList.add("dispMessage");
    progress.innerHTML = "Please Wait";
    
    if(source == destination && source && destination){
        dispMessage("Already at destination.");
        navbarMenu.classList.remove("locked");
        progress.classList.remove("dispMessage");
        progress.innerHTML = "";

        if(window.outerWidth <= 768){
            alert("Already at destination.");
        }
    }
    
    if(!sNodeIsSet || !eNodeIsSet){
        progress.classList.remove("dispMessage");
        progress.innerHTML = "";
        dispMessage("Please set start node and end node first.");
        navbarMenu.classList.remove("locked");

        if(window.outerWidth <= 768){
            alert("Please set start node and end node first.");
        }
    }

    else if(BFSBtn.classList.contains("is-active")){
        visualiseBFS();
        isResultDisplayed = true;

    } 
    
    else if(DFSBtn.classList.contains("is-active")){
        visualiseDFS();
        isResultDisplayed = true;
    } 
    
    else if(DijBtn.classList.contains("is-active")){
        visualiseDijkstra(nodeWeights);
        isResultDisplayed = true;
    }

    else{
        dispMessage("Please select an algorithm.");
        navbarMenu.classList.remove("locked");
        progress.classList.remove("dispMessage");
        progress.innerHTML = "";

        if(window.outerWidth <= 768){
            alert("Please select an algorithm.");
        }
    }
    
    setTimeout(() => {
        progress.classList.remove("dispMessage");
        progress.innerHTML = "";
        navbarMenu.classList.remove("locked");
    }, 3500);
    
    
})

// Breadth First Search button

BFSBtn.addEventListener('click', (e) => {

    e.target.classList.add("is-active");
    DijBtn.classList.remove("is-active");
    DFSBtn.classList.remove("is-active");
    status.classList.add("dispMessage");
    status.innerHTML = "Breadth First Search";
    
})

// Depth First Search button

DFSBtn.addEventListener('click', (e) => {
    
    e.target.classList.add("is-active");
    DijBtn.classList.remove("is-active");
    BFSBtn.classList.remove("is-active");
    status.classList.add("dispMessage");
    status.innerHTML = "Depth First Search";

})

// Dijkstra button
    
DijBtn.addEventListener('click', (e) => {
    
    e.target.classList.add("is-active");
    BFSBtn.classList.remove("is-active");
    DFSBtn.classList.remove("is-active");
    status.classList.add("dispMessage");
    status.innerHTML = "Dijkstra";
    alert("Information - Please double click on a node to make it a weighted node");
    

})

wallEraseBtn.addEventListener('click', (e) => {
    
    wallIsActive = false;
    wallStarted = false;
    wallEraseIsActive = true;

    resetFormatting();
       
    status.classList.add("dispMessage");
    status.innerHTML = "Click on a node to begin erasing wall.";
})

spiralBtn.addEventListener('click', () => {
    
    navbarMenu.classList.remove('is-active');
    navbarMenu.classList.add("locked");
    
    resetGrid();
    createSpiral();
    
    setTimeout(() => {    
        navbarMenu.classList.remove("locked");
    }, 2000);
    
})

// creates a pyramid on the screen.

pyrBtn.addEventListener("click", () => {
    
    navbarMenu.classList.remove("is-active");
    navbarMenu.classList.add("locked");
    
    resetGrid();
    if(window.outerWidth <= 768){
        createPyramidM(getNodeId(gridRow - 1, 0)); 
    } else{
        createPyramid(getNodeId(gridRow - 1, 0));
    }
      
    
    source = getNodeId(gridRow - 3, 1);
    destination = getNodeId(gridRow - 4, Math.round(gridRow / 3)); 

    let sourceIdx = extractIndices(source);
    let destinationIdx = extractIndices(destination);
    
    gridArray[sourceIdx[0]][sourceIdx[1]] = 0;
    gridArray[destinationIdx[0]][destinationIdx[1]] = "*";
    
    sNodeIsSet = true;
    eNodeIsSet = true;
    
    setTimeout(() => {
        document.getElementById(source).classList.add("startNode");
        document.getElementById(destination).classList.add("endNode");
        navbarMenu.classList.remove("locked");
    }, 1000);

   
       
});

randBtn.addEventListener("click", () => {
    
    navbarMenu.classList.remove("is-active");
    navbarMenu.classList.add("locked");
    
    resetGrid();
    createRandomGrid("sqR15c5", "sqR16c25");
    
    setTimeout(() => {
        navbarMenu.classList.remove("locked");
    }, 1000);
    
})

faceBtn.addEventListener("click", () => {
    
    navbarMenu.classList.remove("is-active");
    navbarMenu.classList.add("locked");
    
    resetGrid();
    createFace();
    
    setTimeout(() => {
        navbarMenu.classList.remove("locked");
    }, 4000);

})

// double click to add weight nodes if Dijkstra is active.

document.addEventListener('dblclick', (e) => {

    if(DijBtn.classList.contains("is-active")){

        if(isResultDisplayed){

            resetFormatting();

        }

        if(e.target.classList.contains("gridSq")){

            if(!(e.target.classList.contains("startNode") || 
            e.target.classList.contains("endNode") || 
            e.target.classList.contains("wall")));{
               
                e.target.classList.add("weightNode");
                nodeWeights.push(e.target.id);
                
            }
        }

    }
    
})




