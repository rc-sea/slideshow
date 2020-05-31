const cloudinary = require('./cloudinary').cloudinary;

export default async function(req, res, next){
    const { public_id, tag } = req.query;
    console.log(public_id)
    console.log(tag)
    cloudinary.uploader.add_tag(tag, [public_id], function(error, result) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.json(result);
    });
}
