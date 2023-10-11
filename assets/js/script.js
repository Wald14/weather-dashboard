// Search Bar for cities

// Save the city into local storage 
// Add to front of array
// If not already searched for, move to front
// load historical cities

// load current weather:
// an icon for current weather condition, 
// time loaded
// temp
// humidity
// wind speed

// load 5 day forcast and display
// date
// icon for weather condition
// temp
// humidity
// wind speed

//  need to replace the lat and lon in this based off the Geocoding API
//  info on api https://openweathermap.org/current
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=b590e1e6cab1a4667e5be277471ec18c"
// "https://api.openweathermap.org/data/2.5/weather?id=524901&appid=b590e1e6cab1a4667e5be277471ec18c"

var currentWeatherDiv = $("#currentWeatherDiv")
var fiveDaySubDiv = $("#fiveDaySubDiv")
var dateToday = dayjs()
// .format("(M/D/YYYY)");



getCityInfo("Minneapolis");

// Get Weather API
function getCityInfo(city) {

  let requestCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b590e1e6cab1a4667e5be277471ec18c`

  fetch(requestCity)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // let cityInfo = {
      //   lat: data.coord.lat,
      //   lon: data.coord.lon,
      //   name: data.name,
      //   temp: data.main.temp,
      //   humidity: data.main.humidity,
      //   weather: data.weather[0].main,
      //   wind_speed: data.wind.speed
      // }
      // console.log(cityInfo)

      // Calls function to generate the Current Weather Tab
      currentWeather(data.name, Math.round(data.main.temp), Math.round(data.wind.speed), data.main.humidity)

      // Calls function to generate and determine the Five Day Forcast
      generateFiveDayForcast(data.coord.lat, data.coord.lon);

    })
}

// Generates the current weather div
function currentWeather(cityName, temp, wind, humidity) {
  $(currentWeatherDiv).append(
    $("<h3>").text(`${cityName} ${dateToday.format("(M/D/YYYY)")}`),
    $("<p></p>").text(`Temp: ${temp}\xB0F`),
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
      // let fiveDayForcast = [];
      // Currently just grabbing the days 5th data point (12pm-2pm)
      for (i = 5; i < 40; i += 8) {
        // let singleDayForcast = {
        //   humidity: data.list[i].main.humidity,
        //   temp_max: data.list[i].main.temp_max,
        //   temp_min: data.list[i].main.temp_min,
        //   weather: data.list[i].weather[0].main,
        //   wind_speed: data.list[i].wind.speed
        // }
        // fiveDayForcast.push(singleDayForcast)
        let dayCard = $("<div></div>");
        $(dayCard).append(
          $("<p></p>").text(`${dateToday.add(i, "day").format("M/D/YYYY")}`),
          $("<p></p>").text(`High: ${data.list[i].main.temp_max}\xB0F`),
          $("<p></p>").text(`Low: ${data.list[i].main.temp_min}\xB0F`),
          $("<p></p>").text(`Wind: ${data.list[i].wind.speed}mph`),
          $("<p></p>").text(`Humidity: ${data.list[i].main.humidity}%`)
        )
        $(dayCard).addClass("singleCard")
        $(fiveDaySubDiv).append(dayCard)
      }
      // console.log(fiveDayForcast)
    })
}

// Function to generate emoji

// Search Function

// Save to local storage

// Load from local storage





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