const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Constants
const PORT = process.env.PORT || 3000;

// database connection
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(bodyParser.json());  // parse body to json
app.use(cors());  // enable CORS

// Endpoints
app.get('/', (req, res) => {
  res.send('server is running');
});
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get('/profile/:id', (req, res) => {
  profile.handleProfile(req, res, db);
});
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/image-face', image.handleImageFace());
app.post('/image-celebrity', image.handleImageCelebrity());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
