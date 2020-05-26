
require('dotenv').config()
const axios = require('axios');
const api_key = process.env.DISCOURSE_API_KEY
const photo_category = process.env.PHOTO_CATEGORY

export default function(req, res, next){
    let body = [];
    req.on('data', chunk => {
        body.push(chunk)
    });
    req.on('end', async () => {
        const { topic_id, title, user, text } = JSON.parse(body)   
        let params = {
            api_key: api_key,
            api_username: user,
            raw: text,
            category: photo_category
        };
        if (topic_id) {
            params['topic_id'] = topic_id;
        } else {
            params['title'] = title;
        }
        console.log(params);
        try {
            let { data }  = await axios.post(`https://chat.rememberinglouise.com/posts.json`, 
            params, { 
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': api_key,
                    'Api-Username': user
                }
            });
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.json(data); 
        } catch(error) {
            console.log(error);
        }
        
    });
}
