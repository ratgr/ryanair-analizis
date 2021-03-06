var fs = require('fs');


var g = [[null, 2,      2,      5],
         [2,    null,   3,      3],
         [null, 3,      null,   9],
         [5,    3,      9,      null]];

Prim(g);


function Prim(Matrix){
    var Nodes = [];     //Los nodos ya agregados
    var Segments = [];  //El Arbol generandoce
    var Stack = [];     //lista de los por agregar
    var last = 0;    
    Nodes.push(last);
    for(var i = 0; i < Matrix.length; i++){
        Paso(Matrix, last, Nodes, Segments, Stack);
    }  
}

function Paso(Arbol, last, Nodes, Segments, Stack){
    //Add Segments to Stacks
    for(var i = 0; i< Arbol.length; i++){
        console.log(i + ","+ isIn(Nodes,i));
        if(!isIn(Nodes,i) && g[last][i] != null) 
            Push(Stack, last, i, g[last][i]);
    }
    var min = getMin(Stack);
    
    Segments.push(min);
    Nodes.push(min[1]);
    last = min[1];
   
    console.log("---------- Paso ---------- ");
    console.log("nodes:" + JSON.stringify(Nodes));
   
    console.log("Segments:" + JSON.stringify(Segments));
    console.log("stack:" + JSON.stringify(Stack));
    
    sanitize(Stack, Nodes);
    console.log("Sanitized stack:" + JSON.stringify(Stack));
    
        
    //remove from stack
    var index = Stack.indexOf(min);
    Stack.splice(index,1);
}

function sanitize(Stack, Nodes){
    var toremove = [];
    for(var i = 0; i < Stack.length; i++)
        for(var j = 0; j < Nodes.length; j++)
            if(Stack[i][1] == Nodes[j]) toremove.push(Stack[i]);
    
    for(var i = 0; i < toremove.length; i++){
        var index = Stack.indexOf(toremove[i]);
         Stack.splice(index,1);
    }
    
}

function isIn(array, i){
    for(var j= 0; j < array.length; j++) 
        if(array[j] == i) return true;
    return false; 
}

function Push(Segments, i, j, lenght){
    Segments.push([i,j,lenght]);
}

function getMin(Stack){
    var min = Stack[0];
    for(var i = 1; i <Stack.length; i++)
        if(Stack[i][3] < min[3]) min = Stack[i];
    return min;
}