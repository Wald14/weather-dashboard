// BUG: The textarea doesn't refresh when either the search or one of the saved city buttons is pressed

// BUG: icons/imgs don't have "alt". Can add by pulling the description from the API. `Icon depicting ${x}`.

// "BUG": Not mobile friendly


var currentWeatherDiv = $("#currentWeatherDiv")
var fiveDayMainDiv = $("#fiveDayMainDiv")
var searchBtn = $("#searchBtn")
var searchField = $("#searchField")
var searchHistoryDiv = $("#searchHistoryDiv")

var dateToday = dayjs();
var startUpLoaded = false;
var searchedCities = [];


// Load Search History and generate a button for each, clearing out any old list of buttons
function loadSeachHistory() {
  searchHistoryDiv.empty();
  searchedCities = JSON.parse(localStorage.getItem("Weather-Dashboard-Cities"));
  if (searchedCities === null) {
    searchedCities = [];
  }
  // $(searchHistoryDiv).append($("<h3>Search History</h>"))
  for (var i = 0; i < searchedCities.length; i++) {
    $(searchHistoryDiv).append(
      $("<button></button>").attr("class", "cityBtn").attr("value", searchedCities[i]).addClass("btn btn-primary").text(searchedCities[i])
    )
  }

  // Loads the last saved city on page load
  if (startUpLoaded === false && searchedCities.length > 0) {
    startUpLoaded = true;
    getCityInfo(searchedCities[0])
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
      console.log(data)
      if (data.cod === 200) {
        // Removes old city weather data
        currentWeatherDiv.empty();
        fiveDayMainDiv.empty();

        // Calls function to generate the Current Weather Tab
        currentWeather(data.name, Math.round(data.main.temp), Math.round(data.main.feels_like), Math.round(data.wind.speed), data.main.humidity, data.weather[0].icon)

        // Calls function to generate and determine the Five Day Forcast
        generateFiveDayForcast(data.coord.lat, data.coord.lon);

        // If city is already in the array, remove it so it'll get added again to the front
        if (searchedCities.indexOf(data.name) > -1) {
          var removedCity = searchedCities.splice(searchedCities.indexOf(data.name), 1);
          removedCity = [];
        }

        // Add city to the top of the search list
        searchedCities.unshift(data.name)

        // Remove any cities after Top 5 recent searches
        while (searchedCities.length > 5) {
          searchedCities.pop();
        }

        // Save city name to array and then that array to local storage
        localStorage.setItem("Weather-Dashboard-Cities", JSON.stringify(searchedCities));

        // load newly saved buttons
        loadSeachHistory();

      } else {
        alert("City not found. Please try again.")
      }

    })
}


// Generates the current weather div
function currentWeather(cityName, temp, feelsLike, wind, humidity, icon) {
  $(currentWeatherDiv).append(
    $("<h3></h3>").text(`${cityName} ${dateToday.format("(dddd, MMM Do)")}`).append(
      $("<img></img>").attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`)
    ),
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
          $("<p></p>").text(`${dateToday.add(i, "day").format("dddd, MMM Do")}`),
          $("<img></img>").attr("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`),
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

// $("#searchHistoryDiv").on("click", ".cityBtn", getCityInfo(this.value)
// )
$("#searchHistoryDiv").on("click", ".cityBtn", function(){
  getCityInfo(this.value)}
)




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