//API key added
let APIKey = "28ccc1976154c3dfd88e7d0dd2a6153b";
//Display the city's current weather alongside future weather searched for
function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

//Variable which stores searched city
let city = "";

let currentTemperature = $("#temperature");
let currentWSpeed = $("#wind-speed");
let currentHumidty = $("#humidity");
let searchCity = $("#search-city");
let searchButton = $("#search-button");
let clearButton = $("#clear-history");
let currentCity = $("#current-city");


let newCity = [];

function find(c) {
    for (var i = 0; i < newCity.length; i++) {
        if (c.toUpperCase() === newCity[i]) {
            return -1;
        }
    }
    return 1;
}

// Here we create the AJAX call
function currentWeather(city) {
    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        console.log(response);
        
        const weathericon = response.weather[0].icon;
        const iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
       
        const date = new Date(response.dt * 1000).toLocaleDateString();
        
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");

        const tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
        
        $(currentHumidty).html(response.main.humidity + "%");

        const ws = response.wind.speed;
        const windsmph = (ws * 2.237).toFixed(1);

        $(currentWSpeed).html(windsmph + "MPH");
    
        forecast(response.id);
        if (response.cod == 200) {
            newCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(newCity);
            if (newCity == null) {
                newCity = [];
                newCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname", JSON.stringify(newCity));
                addToList(city);
            }
            else {
                if (find(city) > 0) {
                    newCity.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(newCity));
                    addToList(city);
                }
            }
        }

    });
}


function forecast(cityid) {
    const dayover = false;
    const queryforcastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
    $.ajax({
        url: queryforcastURL,
        method: "GET"
    }).then(function (response) {

        for (i = 0; i < 5; i++) {
            const date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            const iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            const iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
            const tempK = response.list[((i + 1) * 8) - 1].main.temp;
            const tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
            const humidity = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#Day" + i).html(date);
            $("#Img" + i).html("<img src=" + iconurl + ">");
            $("#dayTemp" + i).html(tempF + "&#8457");
            $("#dayHumidity" + i).html(humidity + "%");
        }

    });
}


function addToList(c) {
    const listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}

function invokePastSearch(event) {
    const liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }

}


function loadlastCity() {
    $("ul").empty();
    const newCity = JSON.parse(localStorage.getItem("cityname"));
    if (newCity !== null) {
        newCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < newCity.length; i++) {
            addToList(newCity[i]);
        }
        city = newCity[i - 1];
        currentWeather(city);
    }

}

function clearHistory(event) {
    event.preventDefault();
    newCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();

}


$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);


