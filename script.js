var apiKey = "9484421180d6e59390060d61c96e0844";
var searchInput = document.querySelector("#search-bar");
var searchButton = document.querySelector(".search-button");
var city = document.querySelector(".city-name");
var currentCond = document.querySelector(".current-conditions");
var futureCond = document.querySelector(".future-conditions")
var cityName = "";
var currentTemp = document.querySelector(".temp");
var currentWind = document.querySelector(".wind");
var currentHumidity = document.querySelector(".humidity");
var currentUVI = document.querySelector(".uv-index");
var weatherArr = [];
var currentConditions = [];
var futureConditions = [];
var currentDay = moment();


searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    currentConditions = [];
    var city = searchInput.value;
    findCity(city);
})

function findCity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json()) 
        .then(data => {
            cityName = data.name;
            var coordinates = data.coord;
            return coordinates;
        }).then(coordinates => {
            submitCity(coordinates);
        })
        .catch(err => console.log(err))
}

function submitCity(coordinates) {
    var lat = coordinates.lat;
    var lon = coordinates.lon;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            weatherArr = data;
            currentConditions = weatherArr.current;
            futureConditions = weatherArr.daily;
            displayCurrentConditions();
            displayFutureConditions();
        });
}

function displayCurrentConditions() {
    currentCond.classList.remove("hidden");
    city.textContent = cityName;
    $(".current-day").text(currentDay.format("l"));
    currentTemp.textContent = currentConditions.temp;
    currentWind.textContent = currentConditions.wind_speed;
    currentHumidity.textContent = currentConditions.humidity;
    currentUVI.textContent = currentConditions.uvi;
}

function displayFutureConditions() {
    futureCond.classList.remove("hidden");
    for (var i = 0; i < 5; i++) {
        var futureDay = moment().add(i + 1, 'days');
        $("<div>").attr(
            {
                id: `card-${[i]}`,
                class: "future-cards"
            }
        ).appendTo(".future-conditions");
        $("<h3>").addClass("future-day").text(futureDay.format("l")).appendTo(`#card-${[i]}`);
        $("<p>").addClass("future-temp").text(`Temp: ${futureConditions[i].temp.day}℉`).appendTo(`#card-${[i]}`);
        $("<p>").addClass("future-wind").text(`Wind: ${futureConditions[i].wind_speed} MPH`).appendTo(`#card-${[i]}`);
        $("<p>").addClass("future-humidity").text(`Humidity: ${futureConditions[i].humidity}%`).appendTo(`#card-${[i]}`);
    }
}