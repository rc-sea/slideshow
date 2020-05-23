const cloudinary = require('./cloudinary').cloudinary;

export default function(req, res, next){
    const public_id = req.query.public_id;
    console.log(public_id);
    cloudinary.api.resource(public_id, (error, result) => {
        res.json(result);
    });
}
