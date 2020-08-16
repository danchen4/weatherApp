const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('../utils/geocode');
const forecast = require('../utils/forecast');

const app = express();
// Get PORT from Heroku from env object, or 3000 if local
const PORT = process.env.PORT || 3000;

const PATH_PUBLIC_DIR = path.join(__dirname, '..', '/public');
// create custom path for Handlbars views and partials
const PATH_VIEWS = path.join(__dirname, '../templates/views');
const PATH_PARTIALS = path.join(__dirname, '../templates/partials');

// Setup Handlbars engine adn views location
app.set('view engine', 'hbs');
app.set('views', PATH_VIEWS);
hbs.registerPartials(PATH_PARTIALS);

// Setup static directory to serve
app.use(express.static(PATH_PUBLIC_DIR));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
  }); //we set up the view to render above in the app.set
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
  }); //we set up the view to render above in the app.set
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'FUCK YOU',
  }); //we set up the view to render above in the app.set
});

// Route: app.com/weather
app.get('/weather', (req, res) => {
  const address = req.query.address;

  const URL_WS = 'http://api.weatherstack.com/current';
  const KEY_WS = '5e62c033b3ca246599492c9eaeab39d6';

  if (!address) {
    return res.send({
      error: 'You must provide an address',
    });
  }

  geocode.geocode(address, (error, { lat, long, place } = {}) => {
    if (error) {
      return res.send({ error });
    }

    // const url = `${URL_WS}?access_key=${KEY_WS}&query=${lat},${long}&units=f`;
    // console.log(url);

    forecast.forecast(lat, long, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        address: address,
        location: place,
        forecast: forecastData,
      });
    });
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    // Need to return, else you'll get error for two responses: Error: Cannot set headers after they are sent to the client.
    return res.send({
      error: 'You must provide a search term',
    });
  }

  console.log(req.query);

  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    message: 'Help article not found',
  }); //we set up the view to render above in the app.set
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    message: 'Page Not Found',
  }); //we set up the view to render above in the app.set
});

// Starts up server and listens on specific PORT (3000 for local)
// Server started asynchrounously
app.listen(PORT, () => {
  console.log(`Server is up on ${PORT}`);
});
