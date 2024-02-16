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

  return `${day} ${hours}:${minutes}`;
}

let currentDateELement = document.querySelector("p #current-date");
let currentDate = new Date();

currentDateELement.innerHTML = formatDate(currentDate);

function displayTemp(response) {
  let currentTemp = Math.round(response.data.temperature.current);

  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = `${currentTemp}`;
}

function searchInput(event) {
  event.preventDefault();

  let now = new Date();
  let searchInput = document.querySelector("#search-input");
  let currentCity = document.querySelector("#current-city");

  let currentDate = document.querySelector("p #current-date");
  currentDate.innerHTML = formatDate(now);

  // Weather API
  let city = searchInput.value.toLowerCase();
  currentCity.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);

  let apiKey = "241ff083e917bb12t439a7aco17d1be3";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(displayTemp);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchInput);
