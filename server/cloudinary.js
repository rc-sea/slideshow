require('dotenv').config();

var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'louise',
  api_key: process.env.VUE_APP_CLOUDINARY_KEY,
  api_secret: process.env.VUE_APP_CLOUDINARY_SECRET,
});

module.exports = {
  cloudinary,
};
