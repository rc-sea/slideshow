const cloudinary = require('./cloudinary').cloudinary;

export default async function (req, res, next) {
  cloudinary.api.tags({
    max_results: 160,
  },
  // eslint-disable-next-line handle-callback-err
  function (error, result) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.json(result);
  });
}
