const cloudinary = require('./cloudinary').cloudinary;
const axios = require('axios')

export default function(req, res, next){
    const searchtag = req.query.searchtag;
    const type = req.query.type | 0;
    let tags;
    console.log(searchtag);
    if (searchtag) {
        tags = searchtag.split('-');
        let expression = `tags=${tags[0]}`;
        for (var i = 1; i < tags.length; i ++) {
            if (type === 0) {
                expression += ` || tags=${tags[i]}`;
            }
            else {
                expression += ` && tags=${tags[i]}`;
            }
        }
        cloudinary.search
            .expression(expression)
            .max_results(500)
            .execute()
            .then( result => res.json(result) );
    } else {
        cloudinary.api.resources({
            tags: true,
            max_results: 500
        }, function(error, result) {
            res.json(result);
        });
    }
}
