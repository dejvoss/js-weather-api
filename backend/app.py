from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os


app = Flask(__name__)
CORS(app)


@app.route('/proxy', methods=['GET'])
def proxy():
    # get key, host from env for API
    api_key = os.environ.get('API_KEY')
    geo_key = os.environ.get('GEO_KEY')
    geo_host = os.environ.get('GEO_API_HOST')
    weather_host = os.environ.get('WEATHER_API_HOST')

    # get lat and lon from request
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    separator = '+' if float(lon) >= 0 else '-'

    # get city name from geo api
    geo_url = "https://opencage-geocoder.p.rapidapi.com/geocode/v1/json"
    geo_querystring = {
        "q": f"{lat},{lon}",
        "key": geo_key,
        "language": "en"
    }
    geo_headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": geo_host
    }

    geo_response = requests.get(geo_url, headers=geo_headers, params=geo_querystring)
    location_info = geo_response.json()['results'][0]['components']
    city_name = location_info['town'] if 'town' in location_info else location_info['_category']
    country = location_info['country'] if 'country' in location_info else location_info['_type']
    region = location_info['state'] if 'state' in location_info else location_info['formatted']

    # get weather info from weather api
    weather_url = "https://weather-by-api-ninjas.p.rapidapi.com/v1/weather"
    weather_querystring = {"lat": lat, "lon": lon}
    weather_headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": weather_host
    }

    response = requests.get(weather_url, headers=weather_headers, params=weather_querystring)

    # get weather info from response
    weather_info = response.json()

    # add city name, country, region to weather info
    weather_info['city'] = city_name
    weather_info['country'] = country
    weather_info['region'] = region

    return jsonify(weather_info)


if __name__ == "__main__":
    app.run(debug=False)
