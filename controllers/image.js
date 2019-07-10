const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({
  apiKey: 'ca1c72aa19f8471da18fbda80cd8fafc'
});

// start face detection with the specified image URL
const handleImageUrl = (req, res) => {
  clarifaiApp.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with Clarifai API'));
};

// increment entries count in database
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleImage: handleImage,
  handleImageUrl: handleImageUrl
}