// Function to generate emoji
// Function to clear search history
  // Prevent duplicate search history buttons
  // Reorder so most recent is at the front
  // Delete anything passed 5 searches
// CSS and mobile classes


var currentWeatherDiv = $("#currentWeatherDiv")
var fiveDayMainDiv = $("#fiveDayMainDiv")
var searchBtn = $("#searchBtn")
var searchField = $("#searchField")
var searchHistoryDiv = $("#searchHistoryDiv")

var dateToday = dayjs();

var searchedCities = [];


// Load Search History and generate a button for each, clearing out any old list of buttons
function loadSeachHistory() {
  searchHistoryDiv.empty();
  searchedCities = JSON.parse(localStorage.getItem("Weather-Dashboard-Cities"));
  if (searchedCities === null) {
    searchedCities = [];
  }
  $(searchHistoryDiv).append($("<h3>Search History</h>"))
  for (var i = 0; i < searchedCities.length; i++) {
    $(searchHistoryDiv).append(
      $("<button></button>").text(searchedCities[i])
    )
  }
}
loadSeachHistory();


// Uses user input to search for a particular cities weather
function search() {
  getCityInfo(searchField.val().trim());
}


// Get Weather API
function getCityInfo(city) {

  let requestCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b590e1e6cab1a4667e5be277471ec18c`

  fetch(requestCity)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      console.log(data.cod)

      if (data.cod === 200) {
        // Removes old city weather data
        currentWeatherDiv.empty();
        fiveDayMainDiv.empty();

        // Calls function to generate the Current Weather Tab
        currentWeather(data.name, Math.round(data.main.temp), Math.round(data.main.feels_like), Math.round(data.wind.speed), data.main.humidity)

        // Calls function to generate and determine the Five Day Forcast
        generateFiveDayForcast(data.coord.lat, data.coord.lon);

        // Save city name to local storage
        searchedCities.push(data.name)
        localStorage.setItem("Weather-Dashboard-Cities", JSON.stringify(searchedCities));

        // load newly saved buttons
        loadSeachHistory();

      } else {
        alert("City not found. Please try again.")
      }

    })
}

// Generates the current weather div
function currentWeather(cityName, temp, feelsLike, wind, humidity) {
  $(currentWeatherDiv).append(
    $("<h3>").text(`${cityName} ${dateToday.format("(M/D/YYYY)")}`),
    $("<p></p>").text(`Temp: ${temp}\xB0F`),
    $("<p></p>").text(`Feels Like: ${feelsLike}\xB0F`),
    $("<p></p>").text(`Wind: ${wind}mph`),
    $("<p></p>").text(`Humidity: ${humidity}%`)
  )
}

// Get Five Day Forcast
function generateFiveDayForcast(lat, lon) {

  // fetch request gets a list of all avaliable through the OpenWeather API
  let requestFiveDayForcast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=b590e1e6cab1a4667e5be277471ec18c`

  fetch(requestFiveDayForcast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Currently just grabbing the days 5th data point (12pm-2pm)
      let subDiv = $("<div></div>").attr("id", "fiveDaySubDiv").addClass("row")
      let sectionHead = $("<h3></h3>").text("5-day Forcast")

      for (i = 5; i < 40; i += 8) {
        let dayCard = $("<div></div>");
        $(dayCard).append(
          $("<p></p>").text(`${dateToday.add(i, "day").format("M/D/YYYY")}`),
          $("<p></p>").text(`High: ${data.list[i].main.temp_max}\xB0F`),
          $("<p></p>").text(`Low: ${data.list[i].main.temp_min}\xB0F`),
          $("<p></p>").text(`Wind: ${data.list[i].wind.speed}mph`),
          $("<p></p>").text(`Humidity: ${data.list[i].main.humidity}%`)
        )
        $(dayCard).addClass("singleCard col-2");
        $(subDiv).append(dayCard);
        $(fiveDayMainDiv).append(sectionHead, subDiv);
      }
    })
}


searchBtn.on("click", search)





// TODO

// Function to generate emoji
// Function to clear search history
// Function Load from local storage
// Prevent duplicate search history buttons
// Reorder so most recent is at the front
// Delete anything passed 5 searches
// CSS and mobile classes





/*
Gives 40 data points, 8 per day
    Day 1: 0-7
        Set 1: 12am - 2am
        Set 2: 3am - 5am
        Set 3: 6am - 8am
        Set 4: 9am - 11am
        Set 5: 12pm - 2pm
        Set 6: 3pm - 5pm
        Set 7: 6pm - 8pm
        Set 8: 9pm - 11pm
    Day 2: 8-15
    Day 3: 16-23
    Day 4: 24-31
    Day 5: 32-39
*/