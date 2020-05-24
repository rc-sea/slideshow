
require('dotenv').config()
const axios = require('axios');
const api_key = process.env.DISCOURSE_API_KEY
const api_username = process.env.DISCOURSE_API_USERNAME


export default async function(req, res, next){
    const topic_id = req.query.topic_id;
    let { data }  = await axios.get(`https://chat.rememberinglouise.com/t/${topic_id}.json`, {
        params: {
            api_key: api_key,
            api_username: api_username
        }
    })
    res.json(data);
}
