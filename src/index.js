const customIcons = {
  "clear sky": "<i class='wi wi-day-sunny'></i>",
  "few clouds": "<i class='wi wi-day-cloudy'></i>",
  "scattered clouds": "<i class='wi wi-day-cloudy-high'></i>",
  "broken clouds": "<i class='wi wi-cloudy'></i>",
  "overcast clouds": "<i class='wi wi-cloudy'></i>",
  "shower rain": "<i class='wi wi-showers'></i>",
  "rain": "<i class='wi wi-rain'></i>",
  "thunderstorm": "<i class='wi wi-thunderstorm'></i>",
  "snow": "<i class='wi wi-snow'></i>",
  "mist": "<i class='wi wi-fog'></i>",
  "haze": "<i class='wi wi-fog'></i>",
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
  let iconElement = document.querySelector("#current-temp-icon")

  let description = response.data.condition.description;
  description = capitalizeFirstLetter(description);

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
    iconElement.innerHTML = customIcon;
  } else {
    
    iconElement.innerHTML = response.data.condition.icon_url; 
  }
}

function searchCity(city) {
  let apiKey = "241ff083e917bb12t439a7aco17d1be3";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");

  searchCity(searchInput.value);

  let currentDateElement = document.querySelector("#current-date");
  currentDateElement.innerHTML = getCurrentDate();
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearchSubmit);

let currentDateElement = document.querySelector("#current-date");
currentDateElement.innerHTML = getCurrentDate();

searchCity("Raleigh");
