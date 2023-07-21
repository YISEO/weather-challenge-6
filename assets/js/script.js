// Global variables
let searchBtn = document.querySelector(".search-btn");
let cityName = document.querySelector(".city-input");


function handleWeatherSearch(event){
    event.preventDefault();
    let cityValue = cityName.value;

    if(cityValue === ""){
        alert("Please enter the name of city");
        return;
    }

    getWeatherData(cityValue)
}

function getWeatherData(value) {
    console.log(value)
    // let WeatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${value}&appid=518d0e123089c0d09e3582308a7feb25`;
    let WeatherApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=518d0e123089c0d09e3582308a7feb25`;
    
    fetch(WeatherApiUrl)
    .then(function(response) {
        if(response.status == 200){
            response.json().then(function(data){
                console.log(data);
            })
        }else if(response.status == 404){
            alert("404 error");
        }
    })
    .catch(function(){
        console.log("error");
    })
}

// Event Listener
searchBtn.addEventListener("click", handleWeatherSearch);