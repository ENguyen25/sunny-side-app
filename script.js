var apiKey = "9484421180d6e59390060d61c96e0844";
var searchInput = document.querySelector("#search-bar");
var searchButton = document.querySelector(".search-button");
var savedSearch = document.querySelector(".saved-search");
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
var citySearch = "";
var lat = "";
var lon = "";
var searchList = [];


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
            createNewButton(searchList);
        })
        .catch(err => console.log(err))
}

function submitCity(coordinates) {
    lat = coordinates.lat;
    lon = coordinates.lon;

    // if (coordinates.find(city) !== true) {
    //     saveCoordinates(lat, lon);
    // }
    console.log(cityName);

    var findCityArr = searchList.filter(function(item) {
        return item.city == cityName;
    })

    console.log(findCityArr);
    // if (findCityArr == true) {
    //     saveCoordinates(lat, lon);
    // } else {
    //     null;
    // }
    if (findCityArr.length === 0) {
        saveCoordinates(lat, lon);
    } else {
        null;
    }

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            weatherArr = data;
            currentConditions = weatherArr.current;
            futureConditions = weatherArr.daily;
            displayCurrentConditions();
            displayFutureConditions();
            uvIndex();
        });
}

function uvIndex() {
    if (currentConditions.uvi <= 2) {
        currentUVI.classList.add("favorable");
        currentUVI.classList.remove("severe");
        currentUVI.classList.remove("moderate");
    } else if (currentConditions.uvi >= 8) {
        currentUVI.classList.add("severe");        
        currentUVI.classList.remove("favorable");        
        currentUVI.classList.remove("moderate");        
    } else if (currentConditions.uvi < 8 && currentConditions.uvi > 2) {
        currentUVI.classList.add("moderate");        
        currentUVI.classList.remove("favorable");        
        currentUVI.classList.remove("severe");        
    }
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
    $(".future-row").text("").appendTo(".weather-conditions")

    for (var i = 0; i < 5; i++) {
        var futureDay = moment().add(i + 1, 'days');
        $("<div>").attr(
            {
                id: `card-${[i]}`,
                class: "future-cards"
            }
        ).appendTo(".future-row");
        $("<h3>").addClass("future-day").text(futureDay.format("l")).appendTo(`#card-${[i]}`);
        $("<p>").addClass("future-temp").text(`Temp: ${futureConditions[i].temp.day}℉`).appendTo(`#card-${[i]}`);
        $("<p>").addClass("future-wind").text(`Wind: ${futureConditions[i].wind_speed} MPH`).appendTo(`#card-${[i]}`);
        $("<p>").addClass("future-humidity").text(`Humidity: ${futureConditions[i].humidity}%`).appendTo(`#card-${[i]}`);
    }
}

function saveCoordinates(lat, lon) {
    var newCity = {
        city: cityName,
        lat: lat, 
        lon: lon
    }
    searchList.push(newCity);
    console.log(searchList);
    localStorage.setItem('search', JSON.stringify(searchList));
}

savedSearch.addEventListener('click', function(event) {
    var onClick = event.target;

    if (onClick.matches("button")) {
        var cityFilter = onClick.textContent
        var findCityArr = searchList.filter(function(item) {
            return item.city == cityFilter;
        })
        console.log(findCityArr);
        var findCoordinates = {
            city: cityFilter,
            lat: findCityArr[0].lat,
            lon: findCityArr[0].lon
        }
        console.log(findCoordinates);
        cityName = cityFilter;
        submitCity(findCoordinates);
    } else {
        return;
    }
});

localStorage.getItem("search") ? searchList = JSON.parse(localStorage.getItem("search")) : null;
createNewButton(searchList);

function createNewButton(list) {
    $(".saved-search").empty();

    for (var i = 0; i < list.length; i++) {
        var newButton = $("<button>").attr("id", list[i].city).addClass("search-history").text(list[i].city)
        $(".saved-search").append(newButton);
    }
}

const arr = [1, 2, 3, 4]
console.log(arr.find(function(num) {
  return num === 3
}))