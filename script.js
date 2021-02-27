let numOfLocations = 1;

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
    //Find number of days needed
if(numOfLocations > 1) {
    let firstDate = new Date(document.getElementById("date1").value + "T" + document.getElementById("time1").value + ":00"); 
    let lastDate = new Date(document.getElementById("date1").value + "T" + document.getElementById("time1").value + ":00");
    for(let i = 1; i < numOfLocations; i++) {
        let indexDate = new Date(document.getElementById("date" + i).value + "T" + document.getElementById("time" + i).value + ":00");
        if(firstDate > indexDate) {
            firstDate = indexDate;
        } else if(lastDate < indexDate) {
            lastDate = indexDate;
        } else {
            delete indexDate;
        }
    }
    let numDiff = (((lastDate.getTime() - (lastDate.getHours() * 1000*60*60)) - (firstDate.getTime() - (firstDate.getHours() * 1000*60*60))) / (1000*60*60*24));
    numDiff = Math.floor(numDiff) + 1;
    if(numDiff < 60) {
        for(let i = 1; i < (numDiff / 7); i++) {
            let calAdd = document.createElement("div");
            calAdd.className = "cal";
            calAdd.id = "cal" + (i + 1);
            calAdd.innerHTML = "<div class=\"hour-mark\"><p class=\"hour\">3:00am</p></div><div class=\"hour-mark\"><p class=\"hour\">6:00am</p></div><div class=\"hour-mark\"><p class=\"hour\">9:00am</p></div><div class=\"hour-mark\"><p class=\"hour\">12:00pm</p></div><div class=\"hour-mark\"><p class=\"hour\">3:00pm</p></div><div class=\"hour-mark\"><p class=\"hour\">6:00pm</p></div><div class=\"hour-mark\"><p class=\"hour\">9:00pm</p></div><div class=\"hour-mark\"><p class=\"hour\">12:00am</p></div>"
            document.getElementById("cal").appendChild(calAdd);
        }
    } else {
        alert("Range of dates is too large");
    }
    
    //Add dates to calendar
    debugger
    if(numDiff > 7) {
        let count = numDiff;
        for(let i = 1; i <= Math.floor(numDiff / 7) + 1; i++) {
            let cal = document.getElementById("cal" + i);
            for(let j = 0; j < 7; j++) {
                let day = document.createElement("div");
                let date = new Date(lastDate.getTime() - (count*24*60*60*1000))
                day.innerHTML = (date.getMonth() + 1) + "/" + date.getDate();
                day.id = (date.getMonth() + 1) + "/" + date.getDate();
                day.style.position = "absolute";
                day.style.right = (12.143 * (6 - j)) + "%";
                day.style.height = "100%";
                day.style.width = "12.143%";
                cal.appendChild(day);
                count--;
            }
        }
    } else {
        let width = 85 / numDiff;
        for(let j = 1; j <= numDiff; j++) {
            let day = document.createElement("div");
            let date = new Date(lastDate.getTime() - ((numDiff - j)*24*60*60*1000))
            day.innerHTML = (date.getMonth() + 1) + "/" + date.getDate();
            day.id = (date.getMonth() + 1) + "/" + date.getDate();
            day.style.position = "absolute";
            day.style.right = (width * (numDiff - j)) + "%";
            day.style.height = "100%";
            day.style.width = width + "%";
            document.getElementById("cal1").appendChild(day);
        }
    }

    //build url to request travel times
    let times = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="
    times += getAddress("1");
    for(let i = 2; i < numOfLocations; i++) {
        times += "|" + getAddress(i.toString());
    }
    times += "&destinations=" + getAddress("2");
    for(let i = 3; i <= numOfLocations; i++) {
        times += "|" + getAddress(i.toString());
    }
    times += "&avoid=tolls&key=" + config.MY_KEY;
    //"https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=H8MW%2BWP%20Kolkata%20India&destinations=GCG2%2B3M%20Kolkata%20India&key=" + config.MY_KEY
    fetch(times)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log(json);
            for(let i = 0; i < numOfLocations; i++) {
                let index = i + 1
                let event = document.createElement("div");
                event.className = "event";
                event.style.position = "absolute";
                let height = (40/24/60/60) * json.rows[i].elements[i].value;
                event.style.height = height;
                let date = new Date(document.getElementById("date" + index).value + "T" + document.getElementById("time" + index).value + ":00");
                let timeOffset = (40/24/60) * (date.getHours() * 60 + date.getMinutes())
                if(document.getElementById("selector" + index).value = "arrive") {
                    event.style.bottom = ((24*60) - timeOffset);
                } else {
                    event.style.top = timeOffset;
                }
                event.style.width = "100%";
                document.getElementById(date.getMonth() + "/" + date.getDate()).appendChild(event);
            }
        });
    

    //Build Map
    let map = "https://www.google.com/maps/embed/v1/directions?key=" + config.MY_KEY;
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
    } else {
        alert("Need more than one location.");
    }
}

function removeSet(num) {
    document.getElementById(num).remove();
    numOfLocations--;
}

function debugTester() {
    let time = ["05:34","12:34","08:23","01:54","10:01","9:43"];
    let date = ["2020-01-02","2020-01-02","2020-01-02","2020-01-06","2020-01-03"];
    let location = ["Camas, WA","Tustin, CA","Portland, OR","Provo, UT","New York City"];
    for(let i = 1; i <= numOfLocations; i++) {
        document.getElementById("time" + i).value = time[i];
        document.getElementById("date" + i).value = date[i];
        document.getElementById("location" + i).value = location[i];
    }
}