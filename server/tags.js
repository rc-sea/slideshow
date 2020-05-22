const cloudinary = require('./cloudinary').cloudinary;

export default async function(req, res, next){
    cloudinary.api.tags({
        max_results: 500
     },function(error, result) {
        res.json(result);
    });
}
