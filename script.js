let numOfLocations = 1;

function addLocSet() {
    if(numOfLocations < 22) {
        numOfLocations++;
        let index = numOfLocations.toString();
        let set = document.createElement("div");
        set.className = "location-set";
        set.id = index;

        let mode = document.createElement("select");
        mode.id="selector" + index;
        mode.innerHTML = "<option value=\"arrive\">Arrive at</option><option value=\"depart\">Leave at</option>"
        set.appendChild(mode);
        
        let time = document.createElement("input");
        time.type="time";
        time.id="time" + index;
        time.name="time";
        time.min="00:00";
        time.max="24:00";
        set.appendChild(time);
        
        let date = document.createElement("input");
        date.type = "date";
        date.id = "date" + index;
        date.name = "trip-start";
        date.value = "2018-07-22";
        set.appendChild(date);
        
        let location = document.createElement("input");
        location.placeholder = "location";
        location.id = "location" + index;
        set.appendChild(location);
        
        let exitButton = document.createElement("p");
        exitButton.className = "exit";
        exitButton.id = "exit" + index;
        exitButton.innerHTML = "X";
        exitButton.addEventListener('click', function(){ removeSet(index) });
        set.appendChild(exitButton);
        document.getElementById("location-list").appendChild(set);
        list.push(new Set(index));
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
    debugger
    //Find number of days
    
    //Build Map
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

function removeSet(num) {
    document.getElementById(num).remove();
    numOfLocations--;
}