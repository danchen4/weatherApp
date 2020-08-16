const request = require('request');

const URL_MAPBOX = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const KEY_MAPBOX =
  'pk.eyJ1IjoiaGVyYjQzIiwiYSI6ImNrZHJ5MGwzcTBpd2kydG55ZnFsbGIzeWgifQ.4rk_QHIa8UeGUF1YsAZ-8A';

const geocode = (address, callback) => {
  const url =
    URL_MAPBOX + encodeURIComponent(address) + '.json?access_token=' + KEY_MAPBOX + '&limit=1';

  request({ url, json: true }, (error, response, body) => {
    if (error) {
      callback('Unable to connect!', undefined);
    } else if (!response.body.features.length) {
      callback('Unable to find location. Try another search', undefined);
    } else {
      long = body.features[0].center[0];
      lat = body.features[0].center[1];
      place = body.features[0].place_name;
      callback(null, { lat, long, place });
    }
  });
};

const geocodeAsync = async (address) => {
  let data;
  const url =
    URL_MAPBOX + encodeURIComponent(address) + '.json?access_token=' + KEY_MAPBOX + '&limit=1';

  let promise = new Promise((resolve, reject) => {
    request({ url, json: true }, (error, response, body) => {
      if (error) {
        reject('Unable to connect!');
      } else if (!response.body.features.length) {
        reject('Unable to find location. Try another search');
      } else {
        long = body.features[0].center[0];
        lat = body.features[0].center[1];
        place = body.features[0].place_name;
        resolve({ lat, long, place });
      }
    });
  });

  try {
    data = await promise;
  } catch (err) {
    console.log(err);
  }

  return data;
};

module.exports = { geocode, geocodeAsync };
