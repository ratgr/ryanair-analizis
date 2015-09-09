var https = require('https');
var fs = require('fs');
var readline = require('readline');

var rl = readline.createInterface({input: process.stdin,output: process.stdout });
var routes = require('./routes.js');
var iata = require('./iata.js');
var airports = require('./airports.js');

var b = [];

var matrix ={};

//fillZeroes();

/*Set Data*/
for( var j = 0; j < routes.length; j++){
    
    if(!matrix[routes[j].airportFrom]) matrix[routes[j].airportFrom] = {};
    //console.log(routes[j].airportFrom);
    //matrix[routes[j].airportFrom][routes[j].airportTo] = 1;
    setDistance(j);
}

/*for(var key in matrix){
    console.log(key + ":" + JSON.stringify(matrix[key]));
} */
 Dijkstra("AAR");


function Dijkstra(iataFrom){
    var dij = {};
    var count  = 0;
    for(var key in matrix) {
        dij[key] = {val: Infinity, route: [], finished: false};
        count++;
    }
    dij[iataFrom].val = 0; 
    rl.question('step by step?\n[NO]', function(ans){
        if(/yes|y/i.test(ans)) DijkstraStep(dij,0, count, true);
        DijkstraStep(dij,0, count, false);
    });
    
}
    
function DijkstraStep(dij,step,count,stepstep){
    var from = GetMinKey(dij);
    
    if(from === undefined) {
        for(var k in dij) delete dij[k].finished;
        //console.log('finished dijkstra');
        rl.question('Finished dijkstra. Want to Save?(Yes/No)\n[yes]',function(ans){
            if(!/n|NO/.test(ans)) 
                rl.question('filename: [test.js]?',function(ans){
                    if(ans == "") ans = "test.js";
                    if(!/^.*\.js$/i.test(ans)) ans = ans+ ".js"
                    fs.writeFileSync(ans, JSON.stringify(dij));
                    rl.close();
                });
            else rl.close();
        });
        return;
    }
   
    console.log("--->" +from);
    dij[from].finished = true; 
    for(var key in matrix[from]){

        if(dij[key].finished == false && dij[key].val > dij[from].val + matrix[from][key]){
            dij[key].val = dij[from].val + matrix[from][key];
            dij[key].route = dij[from].route.slice();
            dij[key].route.push(from);
            console.log(key + ":"); 
            console.log(dij[key]);
        }
            
    } 

    
    if(stepstep == true){
        rl.question("another Step(" + step + "/" + count+ ")?", function(answer){
            if(/N|NO/i.test(answer)) return;
            step++;
            DijkstraStep(dij,step, count, stepstep);

        });
        return;
    }
    else{
        DijkstraStep(dij,step, count, stepstep);
    }
    
}

function GetMinKey(dij){
    var minK;
    var minVal = Infinity; 
    for(var key in dij) 
        if(dij[key].finished == false && dij[key].val < minVal) minK = key;
    //console.log(dij);
    
    //console.log(minK);
    //console.log(dij[minK]);
    return minK;
    
}



function setDistance(j){
    var iataFrom = routes[j].airportFrom;
    var iataTo = routes[j].airportTo;
    
    var fromAirport = getAirport(iataFrom);
    var toAirport = getAirport(iataTo);
    
    //console.log("fromAirport:" + JSON.stringify(fromAirport));
     matrix[iataFrom][iataTo] = 
         CalcDistanceBetween(fromAirport.latitude, fromAirport.longitude, toAirport.latitude, toAirport.longitude);
    

}

function CalcDistanceBetween(lat1, lon1, lat2, lon2) {
    
    //console.log("lat:" + lat1 +", lon:" + lon1);
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    var R = 6357; // Radius of earth in Miles 
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

/** Converts numeric degrees to radians */
function toRad(Value) {
    return Value * Math.PI / 180;
}

/* Write File*/
fs.writeFileSync("exports.js", JSON.stringify(matrix));

function fillZeroes(){
    for(var i = 0; i <airports.length; i++){

        if(!matrix[airports[i].iataCode]) matrix[airports[i].iataCode] = {};
        for(var j = 0; j < airports.length; j++) matrix[airports[i].iataCode][airports[j].iataCode] = 0 ;
    }
}

function getAirport(iataVal){
    var search = iataVal;
    var fin = airports.length -1; 
    var med = 0;
    //console.log("iata:" + iata.length)
    
    while(med <= fin){
        //console.log("Searching " + search + " vs " + iata[med][1]);
        ////console.log("med:" + med + ", fin: " + fin + "med < fin :" +  med < fin);

        if(search == airports[med].iataCode) return  airports[med];
        
        med++;
        
       // console.log("med:" + med + ", fin: " + fin )//+ "med < fin :" +  med < fin);

    }
    console.log(search + "not Found");

} 

function IATA_info(iataVal){
    var search = iataVal;
    var fin = iata.length -1; 
    var ini = 0;
    var med = Math.round(ini + (fin - ini) /2);
    //console.log("iata:" + iata.length)
    
    while(med < fin){
        //console.log("Searching " + search + " vs " + iata[med][1]);
        ////console.log("med:" + med + ", fin: " + fin + "med < fin :" +  med < fin);
        
        if(search > fin) return null;
        else if(search == iata[med][0]) return iata[med];
        else if(search > iata[med][0] && search < iata[fin][0]) ini = med;
        else if(search > iata[ini][0] && search < iata[med][0]) fin = med;
        
        med = Math.round(ini + (fin - ini) /2);
        
        //console.log("med:" + med + ", fin: " + fin + "med < fin :" +  med < fin);

    }
    console.log(search + "not Found");

} 
