let numOfLocations = 1;

document.getElementById("addLoc").addEventListener('click', addLocSet);

function addLocSet() {
    if(numOfLocations < 22) {
        numOfLocations++;
        let set = document.createElement("div");
        set.className = "location-set";
        set.id = numOfLocations.toString();
        set.innerHTML = "<select id=\"selector\"><option value=\"arrive\">Arrive at</option><option value=\"depart\">Leave at</option></select><input type=\"time\" id=\"time\" name=\"time\" min=\"00:00\" max=\"24:00\"><p>on</p><input type=\"date\" id=\"start\" name=\"trip-start\" value=\"2018-07-22\"><p>to</p><input placeholder=\"location\" id=\"location\"><p class=\"exit\">X</p>";
        document.getElementById("location-list").appendChild(set);
    } else {
        alert("Max of 22 locations");
    }
}

document.getElementById("calculate").addEventListener('click', calculator);

function getAddress(setNum) {
    if(typeof setNum != "string") {
        setNum = setNum.toString();
    }
    return document.getElementById(setNum).getElementsByTagName("input")[2].value.replace(/ /g,'+');
}

function calculator() {
    //Build Calendar

    //Build Map
    debugger
    let map = "https://www.google.com/maps/embed/v1/directions?key=";
    map += "&origin=" + getAddress("1");
    if(numOfLocations > 1) {
        map += "&destination=" + getAddress(numOfLocations.toString());
    }
    if(numOfLocations > 2) {
        map += "&waypoints=" + getAddress("2");
        for(let i = 3; i < numOfLocations; i++) {
            map += "|" + getAddress(i.toString()); 
        }
    }
    map += "&avoid=tolls";
    document.getElementById("map").src = map;
}