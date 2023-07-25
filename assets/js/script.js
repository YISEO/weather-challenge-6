// Global variables
let apiKey = "518d0e123089c0d09e3582308a7feb25";
let searchBtn = document.querySelector(".search-btn");
let cityName = document.querySelector(".city-input");
let searchHistoryUl = document.querySelector(".history-ul");
let resultCurrent = document.querySelector(".result-current");
let resultFuture = document.querySelector(".result-future");
let cityLists = localStorage.getItem("cityName");
if(!cityLists){
    cityLists = [];
}else{
    cityLists = JSON.parse(cityLists);
}

searchBtn.addEventListener("click", function(event){
    event.preventDefault();

    let cityValue = cityName.value.trim();
    if (cityValue === ""){
        alert("Please enter a city name");
        return;
    }

    if(!cityLists.includes(cityValue)){
        cityLists.push(cityValue);
        localStorage.setItem("cityName", JSON.stringify(cityLists));
    }

    getLocalStorageData();
    getWeatherData(cityValue);
})

// Get weather data lists by using latitude and longitude
function getWeatherData(cityValue) {
    getCityCoordinates(cityValue)
        .then(function(coordinates) {
            let { lat, lon } = coordinates;
            let WeatherListsUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
            
            fetch(WeatherListsUrl)
                .then(function(response){
                    return response.json()
                })
                .then(function(data){
                    displayCurrentWeather(cityValue, data.daily[0]);
                    displayForecastWeather(data.daily.slice(1,6));
                })
        })
        .catch(function(error){
            console.log(error);
        })
}


// When the search button is clicked, get a city coordinates using the API
function getCityCoordinates(cityValue){
    let getCoordinatesUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&appid=${apiKey}`;
    
    return fetch(getCoordinatesUrl)
        .then(function(response) {
            return response.json()
        })
        .then(function(data){
            if(data.length === 0){
                alert("City not found");
                throw new Error("City not found");
            }
            return {
                lat: data[0].lat,
                lon: data[0].lon
            }
        })
}

// Get current weather data and display on the page
function displayCurrentWeather(cityName, currentData){
    let date = new Date(currentData.dt * 1000).toLocaleDateString("en-US");
    let iconUrl = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`;
    let temperature = currentData.temp.day;
    let windSpeed = currentData.wind_speed;
    let humidity = currentData.humidity;

    let currentEl = `
        <div class="current-text">
            <h2 class="current-title">${cityName} (${date})</h2>
            <img src="${iconUrl}" alt="Weather icon" />
        </div>
        <p class="current-text">Temp: ${temperature} ℉</p>
        <p class="current-text">Wind: ${windSpeed} MPH</p>
        <p class="current-text">Humidity: ${humidity} %</p>
    `

    resultCurrent.innerHTML = currentEl;
    resultCurrent.style.border = "1px solid var(--grey)";
}


// Get a 5-Day forecast data and display on the page
function displayForecastWeather(forecastData){
    let forecastTitle = `<div class="forecast-title">5-Day Forecast</div>`;
    resultFuture.innerHTML = forecastTitle;

    let forecastUl = document.createElement("ul");
    forecastUl.classList.add("forecast-box");
    
    for(let i = 0; i < forecastData.length; i++){
        let date = new Date(forecastData[i].dt * 1000).toLocaleDateString("en-US");
        let iconUrl = `https://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}.png`;
        let temperature = forecastData[i].temp.day;
        let windSpeed = forecastData[i].wind_speed;
        let humidity = forecastData[i].humidity;

        let forecastLi = document.createElement("li");
        forecastLi.classList.add("forecast-lists");
        

        let forecastEl = `
            <h3 class="forecast-text">${date}</h3>
            <img src="${iconUrl}" alt="Weather icon" />
            <p class="forecast-text">Temp: ${temperature} ℉</p>
            <p class="forecast-text">Wind: ${windSpeed} MPH</p>
            <p class="forecast-text">Humidity: ${humidity} %</p>
        `

        forecastLi.innerHTML = forecastEl;
        forecastUl.append(forecastLi);
    }

    resultFuture.append(forecastUl);
}


// Get lists of seaching data from local storage
function getLocalStorageData(){
    let historyAddEl = "";
    for(let i = 0; i < cityLists.length; i++){
        let historyEl = `
        <li>
            <button type="button" data-value="${cityLists[i]}" class="history-btn">
                ${cityLists[i]}
            </button>
        </li>
        `;
        historyAddEl += historyEl;
    }
    
    searchHistoryUl.innerHTML = historyAddEl;
    handleHistoryButton();
}
getLocalStorageData();


// When the history items are clicked, display selected local weather
function getHistoryData(){
    let dataValue = this.getAttribute("data-value");
    getWeatherData(dataValue);
}

function handleHistoryButton(){
    let historyBtns = document.querySelectorAll(".history-btn");
    historyBtns.forEach(function(button){
        button.addEventListener("click", getHistoryData);
    });    
}
handleHistoryButton();

