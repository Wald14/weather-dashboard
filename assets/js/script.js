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


// Kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
  let x = (kelvin - 273.15) * (9 / 5) + 32;
  return x.toFixed(2);
}




// Get Weather API
function getCityInfo(city) {

  // fetch request gets a list of all avaliable through the OpenWeather API
  let requestCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b590e1e6cab1a4667e5be277471ec18c`

  fetch(requestCity)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      console.log(data)

      let cityInfo = {
        lat: data.coord.lat,
        lon: data.coord.lon,
        name: data.name,
        temp: kelvinToFahrenheit(data.main.temp),
        temp_max: kelvinToFahrenheit(data.main.temp_max),
        temp_min: kelvinToFahrenheit(data.main.temp_min),
        humidity: data.main.humidity,
        // weather: data.weather[0].main,
        wind_speed: data.wind.speed
      }

      console.log(cityInfo)
    })
}

getCityInfo("Minneapolis");
// console.log(getCityInfo("Minnesapolis"))




// Get Weather API
function getFiveDayForcast(lat, lon) {

  // fetch request gets a list of all avaliable through the OpenWeather API
  let requestFiveDayForcast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b590e1e6cab1a4667e5be277471ec18c`

  fetch(requestFiveDayForcast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      console.log(data)

      let fiveDayForcast = [];

      // Gives 40 data points, 8 per day
          // Day 1: 0-7
          // Set 1: 12am - 2am
          // Set 2: 3am - 5am
          // Set 3: 6am - 8am
          // Set 4: 9am - 11am
          // Set 5: 12pm - 2pm
          // Set 6: 3pm - 5pm
          // Set 7: 6pm - 8pm
          // Set 8: 9pm - 11pm
          // Day 2: 8-15
          // Day 3: 16-23
          // Day 4: 24-31
          // Day 5: 32-39
      // Currently just grabbing the days first data point
      // Later grab all and determine the days true high and low
      for (i = 5; i < 40; i += 8) {
        let singleDayForcast = {
          humidity: data.list[i].main.humidity,
          name: data.city.name,
          temp_max: kelvinToFahrenheit(data.list[i].main.temp_max),
          temp_min: kelvinToFahrenheit(data.list[i].main.temp_min),
          weather: data.list[i].weather[0].main,
          wind_speed: data.list[i].wind.speed
        }
        fiveDayForcast.push(singleDayForcast)
      }

      console.log(fiveDayForcast)
    })
}

getFiveDayForcast(44.98, -93.2638);