const customIcons = {
  "clear sky": "<i class='wi wi-day-sunny' ></i>",
  "sky is clear": "<i class='wi wi-day-sunny' ></i>",
  "few clouds": "<i class='wi wi-day-cloudy'></i>",
  "scattered clouds": "<i class='wi wi-day-cloudy-high'></i>",
  "broken clouds": "<i class='wi wi-cloudy'></i>",
  "overcast clouds": "<i class='wi wi-cloudy'></i>",
  "shower rain": "<i class='wi wi-showers'></i>",
  "rain": "<i class='wi wi-rain'></i>",
  "light rain": "<i class='wi wi-rain'></i>",
  "moderate rain": "<i class='wi wi-rain'></i>",
  "heavy intensity rain": "<i class='wi wi-rain'></i>",
  "thunderstorm": "<i class='wi wi-thunderstorm'></i>",
  "thunderstorm with rain": "<i class='wi wi-thunderstorm'></i>",
  "thunderstorm with heavy rain": "<i class='wi wi-thunderstorm'></i>",
  "snow": "<i class='wi wi-snow'></i>",
  "mist": "<i class='wi wi-fog'></i>",
  "haze": "<i class='wi wi-fog'></i>",
  "smoke": "<i class='wi wi-fog'></i>",
};


let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatDate(date) {
  let day = days[date.getDay()];
  let minutes = date.getMinutes();
  let hours = date.getHours();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  return `${day} ${hours}:${minutes}, `;
}

function getCurrentDate() {
  let now = new Date();
  return formatDate(now);
}

function capitalizeFirstLetter(str) {
  let words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(" ");
}

function displayWeather(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let temperature = Math.round(response.data.temperature.current);
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#description")
  let humidityElement = document.querySelector("#humidity")
  let windElement = document.querySelector("#wind-speed")
  let iconElement = document.querySelector("#current-temperature-icon")

  let description = response.data.condition.description;
  description = capitalizeFirstLetter(description);
  console.log(description)

  let humidity = response.data.temperature.humidity;
  let wind = Math.round(response.data.wind.speed);

  let customIcon = customIcons[description.toLowerCase()];

  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = temperature;
  descriptionElement.innerHTML = description;
  humidityElement.innerHTML = `${humidity}%`;
  windElement.innerHTML = `${wind}km/h`;
  

  if (customIcon) {
    iconElement.className = '';
    iconElement.id = 'current-temperature-icon';
    iconElement.innerHTML = customIcon;
  } else {
    
    iconElement.innerHTML = response.data.condition.icon_url; 
  }

  getForecast(response.data.city);
}

function searchCity(city) {
  let apiKey = "241ff083e917bb12t439a7aco17d1be3";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function(response) {
    displayWeather(response);
    
    document.querySelector("#current-temperature-unit-c").innerHTML = "°C";
    
    handleTemperatureUnitToggle();
  });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");

  searchCity(searchInput.value);

  let currentDateElement = document.querySelector("#current-date");
  currentDateElement.innerHTML = getCurrentDate();
}

// Converting Celcius/Fahrenheit
function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9 / 5) + 32);
}

function fahrenheitToCelsius(fahrenheit) {
  return Math.round((fahrenheit - 32) * 5 / 9);
}

function handleTemperatureUnitToggle(event) {
  if (event) {
    event.preventDefault();
  }

  let currentTempElement = document.querySelector("#current-temp");
  let currentTempUnitElement = document.querySelector("#current-temperature-unit-c");
  let currentTempToggle = document.querySelector("#current-temperature-unit-f");
  let forecastMaxTemps = document.querySelectorAll(".weather-forecast-temp-max");
  let forecastMinTemps = document.querySelectorAll(".weather-forecast-temp-min");

  if (currentTempUnitElement.innerHTML === "°C") {
   
    currentTempElement.innerHTML = celsiusToFahrenheit(parseFloat(currentTempElement.innerHTML));
    currentTempUnitElement.innerHTML = "°F";
    currentTempToggle.innerHTML = "°C";

    
    forecastMaxTemps.forEach(function(maxTempElement) {
      let celsiusTemp = parseInt(maxTempElement.innerHTML);
      maxTempElement.innerHTML = celsiusToFahrenheit(celsiusTemp) + "°";
    });

    forecastMinTemps.forEach(function(minTempElement) {
      let celsiusTemp = parseInt(minTempElement.innerHTML);
      minTempElement.innerHTML = celsiusToFahrenheit(celsiusTemp) + "°";
    });
  } else {

    currentTempElement.innerHTML = fahrenheitToCelsius(parseFloat(currentTempElement.innerHTML));
    currentTempUnitElement.innerHTML = "°C";
    currentTempToggle.innerHTML = "°F";

    forecastMaxTemps.forEach(function(maxTempElement) {
      let fahrenheitTemp = parseInt(maxTempElement.innerHTML);
      maxTempElement.innerHTML = fahrenheitToCelsius(fahrenheitTemp) + "°";
    });

    forecastMinTemps.forEach(function(minTempElement) {
      let fahrenheitTemp = parseInt(minTempElement.innerHTML);
      minTempElement.innerHTML = fahrenheitToCelsius(fahrenheitTemp) + "°";
    });
  }
}



//Displaying Forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city){
  let apiKey = "241ff083e917bb12t439a7aco17d1be3";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  if (response && response.data && response.data.daily) {
    response.data.daily.forEach(function(day, index) {
      if (index < 5) {
        let description = day.condition?.description || '';
        description = capitalizeFirstLetter(description);
        let customIcon = customIcons[description.toLowerCase()] || '';

        
        let tempUnit = document.querySelector("#current-temperature-unit-c").innerHTML;

        
        let maxTemp = tempUnit === "°C" ? Math.round(day.temperature.maximum) + "°" : celsiusToFahrenheit(Math.round(day.temperature.maximum)) + "°";
        let minTemp = tempUnit === "°C" ? Math.round(day.temperature.minimum) + "°" : celsiusToFahrenheit(Math.round(day.temperature.minimum)) + "°";

        forecastHtml += `
          <div class="weather-forecast">
            <div class="row">
              <div class="col-2">
                <div class="weather-forecast-date">${formatDay(day.time)}</div>
                <i class="wi" id="forecast-icon-${index}">${customIcon}</i>
                <div class="weather-forecast-temps">
                  <span class="weather-forecast-temp-max">${maxTemp}</span>
                  <span class="weather-forecast-temp-min">${minTemp}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    });

    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = forecastHtml;
  }
}

let temperatureUnitButton = document.querySelector("#current-temperature-unit-f");
temperatureUnitButton.addEventListener("click", handleTemperatureUnitToggle);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearchSubmit);

let currentDateElement = document.querySelector("#current-date");
currentDateElement.innerHTML = getCurrentDate();

searchCity("Raleigh");



