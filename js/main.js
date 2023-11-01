let longitude = "1.360321";
let latitude = "103.846733";

function loadSite() {
  if (navigator.geolocation) { // device can return its location
    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      latitudeStr = latitude >= 0 ? "+" + latitude : latitude.toString();
      longitudeStr = longitude >= 0 ? "+" + longitude : longitude.toString();
      console.log(latitude, longitude);
      getCity();
      getWeather();
    });
  }
}

function getCity() {
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${latitudeStr}${longitudeStr}/nearbyCities?radius=100`;
  const settings = {
    async: true,
    crossDomain: true,
    url: url,
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '611a569c35msh65ff74f34b25d3ap19724bjsne5db4e1e1809',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    city = response.data[response.data.length - 1].city;
    country = response.data[response.data.length - 1].country;
    region = response.data[response.data.length - 1].region;
    document.getElementById("data_city").innerHTML = city;
    document.getElementById("location").innerHTML = country + ", " + region;
  });
}

function getWeather() {
  // let url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b0c6d8d5f20f85d670a683fcd8447d05`
  const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?lat=${latitude}&lon=${longitude}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '611a569c35msh65ff74f34b25d3ap19724bjsne5db4e1e1809',
      'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
    }
  };
  fetch(url, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log(json);
      if (json.humidity > 70) {
        document.body.style.backgroundImage = "url('./img/rainy.jpg')";
        description = "It's raining.";

      } else if (json.cloud_pct > 70) {
        document.body.style.backgroundImage = "url('./img/cloudy.jpg')";
        description = "It's cloudy.";

      } else if (json.cloud_pct < 50 || json.humidity < 50) {
        document.body.style.backgroundImage = "url('./img/partly_cloudy.jpg')";
        description = "It's partly cloudy.";

      } else if (json.temp > 20 && json.cloud_pct < 30) {
        document.body.style.backgroundImage = "url('./img/clear.jpg')";
        description = "It's clear.";

      } else {
        document.body.style.backgroundImage = "url('./img/fair.jpg')";

      }


      document.getElementById("temperature").innerHTML = json.temp + "°C";

      document.getElementById("description").innerHTML = description;
      document.getElementById("data_temperature").innerHTML = json.temp + "°C";
      document.getElementById("data_humidity").innerHTML = json.humidity + "%";
      document.getElementById("data_wind_speed").innerHTML = json.wind_speed + "m/s";
      document.getElementById("data_wind_direction").innerHTML = json.wind_degrees + "º";
      document.getElementById("data_pressure").innerHTML = json.feels_like + "°C";
      document.getElementById("data_sunrise").innerHTML = new Date(json.sunrise * 1000).toLocaleTimeString();
      document.getElementById("data_sunset").innerHTML = new Date(json.sunset * 1000).toLocaleTimeString();
    });
}
