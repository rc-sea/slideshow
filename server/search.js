const cloudinary = require('./cloudinary').cloudinary;

export default function(req, res, next){
    const searchtag = req.query.searchtag;
    const type = req.query.type | 0;
    const next_cursor = req.query.next_cursor;
    let tags;
    console.log(searchtag);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (searchtag) {
        tags = searchtag.split('-');
        let expression = `tags=${tags[0]}`;
        for (let i = 1; i < tags.length; i ++) {
            if (type === 0) {
                expression += ` || tags=${tags[i]}`;
            }
            else {
                expression += ` && tags=${tags[i]}`;
            }
        }
        cloudinary.search
            .expression(expression)
            .next_cursor(next_cursor)
            .max_results(24)
            .execute()
            .then( result => res.json(result) );
    } else {
        cloudinary.search
            .next_cursor(next_cursor)
            .max_results(24)
            .execute()
            .then( result => res.json(result) );
    }
}
