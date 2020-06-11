
require('dotenv').config()
const axios = require('axios');
const api_key = process.env.DISCOURSE_API_KEY
const api_username = process.env.DISCOURSE_API_USERNAME
const photo_category = process.env.PHOTO_CATEGORY


export default async function(req, res, next){
    let { data }  = await axios.get(`https://chat.rememberinglouise.com/c/${photo_category}.json`, {
        params: {
            api_key: api_key,
            api_username: api_username
        },
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': api_key,
            'Api-Username': api_username
        }
    })
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json(data);
}
