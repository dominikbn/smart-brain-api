const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY || 'ab3c86559f7947a99a810167ca5e114c'
});

const callClarifai = (req, res, model) => {
  const imageUrl = req.body.input;
  if (!imageUrl) {
    res.status(400).json('no image URL specified');
    return;
  }
  clarifaiApp.models
    .predict(model, imageUrl)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with Clarifai API'));
}

// start face detection with the specified image URL
const handleImageFace = () => (req, res) => {
  callClarifai(req, res, Clarifai.FACE_DETECT_MODEL);
};

// start detection of celebrities
const handleImageCelebrity = () => (req, res) => {
  callClarifai(req, res, 'e466caa0619f444ab97497640cefc4dc');
}

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
  handleImageFace: handleImageFace,
  handleImageCelebrity: handleImageCelebrity
}