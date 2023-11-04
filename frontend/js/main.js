let longitude = "1.360321";
let latitude = "103.846733";

function loadSite() {
  if (navigator.geolocation) { // device can return its location
    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      latitudeStr = latitude >= 0 ? "+" + latitude : latitude.toString();
      longitudeStr = longitude >= 0 ? "+" + longitude : longitude.toString();
      getFromProxy();
    });
  }
}

function getFromProxy() {
  const url = `http://127.0.0.1:5000/proxy?lat=${latitude}&lon=${longitude}`
  fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error("ERROR");
        }
        return response.json();
      })
      .then(json => {
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
        document.getElementById("data_city").innerHTML = json.city;
        document.getElementById("location").innerHTML = json.country + ", " + json.region;
        document.getElementById("description").innerHTML = description;
        document.getElementById("data_temperature").innerHTML = json.temp + "°C";
        document.getElementById("data_humidity").innerHTML = json.humidity + "%";
        document.getElementById("data_wind_speed").innerHTML = json.wind_speed + "m/s";
        document.getElementById("data_wind_direction").innerHTML = json.wind_degrees + "º";
        document.getElementById("data_pressure").innerHTML = json.feels_like + "°C";
        document.getElementById("data_sunrise").innerHTML = new Date(json.sunrise * 1000).toLocaleTimeString();
        document.getElementById("data_sunset").innerHTML = new Date(json.sunset * 1000).toLocaleTimeString();

      })
      .catch(error => {
        console.log(error);
      });
}
