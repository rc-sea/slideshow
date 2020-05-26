
require('dotenv').config()
const axios = require('axios');
const api_key = process.env.DISCOURSE_API_KEY
const api_username = process.env.DISCOURSE_API_USERNAME

function generate_random(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

export default async function(req, res, next){
    const { name, email, nickname } = JSON.parse(req.query.user);
    console.log("*****Getting Exisitng User******");
    let user;
    try {
        let { data }  = await axios.get(`https://chat.rememberinglouise.com/users/${nickname}.json`, {
            params: {
                api_key: api_key,
                api_username: api_username
            }
        })
        user = data.user;
        console.log("Existing User: ", user);
    } catch(error) {
        console.log("*****Creating a User******");
        let  res_data  = await axios.post(`https://chat.rememberinglouise.com/users`, 
            {
                name: name,
                email: email,
                username: nickname,
                active: true,
                approved: true,
                password: generate_random(15)
            }, 
            { 
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': api_key,
                    'Api-Username': api_username
            }
        });
        console.log("Created User ID: ", res_data.data.user_id);
        console.log("*****Getting User By ID******");
        if (res_data.data.user_id) {
            let user_data  = await axios.get(`https://chat.rememberinglouise.com/admin/users/${res_data.data.user_id}.json`, {
                params: {
                    api_key: api_key,
                    api_username: api_username
                }
            });
            user = user_data.data;
            console.log("Created User", user);
        } else {
            console.log("Creation Failed!");
        }
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json(user);
}
