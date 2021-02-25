class Set {
    constructor(index) {
        this.id = index;
        if(typeof index != 'string') {
            this.id = index.toString();
        }
        this.updateMode();
        this.updateTime();
        this.updateDate();
        this.updateLocation();
    }
    updateMode() { this.mode = document.getElementById(this.id).getElementsByTagName("select")[0].value; }
    updateTime() { this.time = document.getElementById(this.id).getElementsByTagName("input")[0].value; }
    updateDate() { this.date = document.getElementById(this.id).getElementsByTagName("input")[1].value; }
    updateLocation() { this.location = document.getElementById(this.id).getElementsByTagName("input")[2].value; }
    getAddress() { return this.location.replace(/ /g,'+'); }
}

let numOfLocations = 1;
let list = [new Set("1")];

document.getElementById("selector1").addEventListener('change',list[0].updateMode());
document.getElementById("time1").addEventListener('change',list[0].updateTime());
document.getElementById("date1").addEventListener('change',list[0].updateDate());
document.getElementById("location1").addEventListener('input',list[0].updateLocation());
document.getElementById("addLoc").addEventListener('click', addLocSet);

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
        mode.addEventListener('change', function(){ list[numOfLocations-1].updateMode() });
        set.appendChild(mode);
        
        let time = document.createElement("input");
        time.type="time";
        time.id="time" + index;
        time.name="time";
        time.min="00:00";
        time.max="24:00";
        time.addEventListener('change', function(){ list[numOfLocations-1].updateTime() });
        set.appendChild(time);
        
        let date = document.createElement("input");
        date.type = "date";
        date.id = "date" + index;
        date.name = "trip-start";
        date.value = "2018-07-22";
        date.addEventListener('change', function(){ list[numOfLocations-1].updateDate()});
        set.appendChild(date);
        
        let location = document.createElement("input");
        location.placeholder = "location";
        location.id = "location" + index;
        location.addEventListener('input', function(){ list[numOfLocations-1].updateLocation() });
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

function calculator() {
    //Build Calendar
    debugger
    //Build Map
    let map = "https://www.google.com/maps/embed/v1/directions?key=" + config.MY_KEY;
    map += "&origin=" + list[0].getAddress();
    if(numOfLocations > 1) {
        map += "&destination=" + list[numOfLocations - 1].getAddress();
    }
    if(numOfLocations > 2) {
        map += "&waypoints=" + list[1].getAddress();
        for(let i = 2; i < numOfLocations - 1; i++) {
            map += "|" + list[i].getAddress(); 
        }
    }
    map += "&avoid=tolls";
    document.getElementById("map").src = map;
}

function removeSet(num) {
    document.getElementById(num).remove();
    delete list[num-1];
    list.splice(num-1,1);
    numOfLocations--;
}