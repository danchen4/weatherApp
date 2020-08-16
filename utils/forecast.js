const request = require('request');

const URL_WS = 'http://api.weatherstack.com/current';
const KEY_WS = '5e62c033b3ca246599492c9eaeab39d6';

const forecast = (lat, long, callback) => {
  const url = `${URL_WS}?access_key=${KEY_WS}&query=${lat},${long}&units=f`;
  request({ url, json: true }, (error, response, body) => {
    if (error) {
      callback('Unable to connect', undefined);
    } else if (!body.location) {
      callback('Unable to find location. Try another search', undefined);
    } else {
      const temp = body.current.temperature;
      const precip = body.current.precip;
      const data = `It is ${temp} degrees out, with a ${precip}% chance of rain`;
      callback(null, data);
    }
  });
};

const forecastAsync = async (lat, long) => {
  let data;
  const url = `${URL_WS}?access_key=${KEY_WS}&query=${lat},${long}&units=f`;

  let promise = new Promise((resolve, reject) => {
    request({ url, json: true }, (error, response, body) => {
      if (error) {
        reject('Unable to connect');
      } else if (!body.location) {
        reject('Unable to find location. Try another search');
      } else {
        const temp = body.current.temperature;
        const precip = body.current.precip;
        resolve({ temp, precip });
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

module.exports = { forecast, forecastAsync };
