
require('dotenv').config();
const axios = require('axios');

const api_key = process.env.DISCOURSE_API_KEY;
const api_username = process.env.DISCOURSE_API_USERNAME;

function generate_random (length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function generate_id (nickname, sub) {
  var str = nickname + '-' + sub.substr(sub.length - 4);

  return str.replace(/[^a-zA-Z0-9_.-]/g, '');
}
async function create_user (name, email, username) {
  try {
    const res_data = await axios.post('https://chat.rememberinglouise.com/users',
      {
        name: name,
        email: email,
        username: username,
        active: true,
        approved: true,
        password: generate_random(15),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': api_key,
          'Api-Username': api_username,
        },
      });

    return res_data;
  } catch (err) {
    console.log(err);
  }
}

export default async function (req, res, next) {
  const { name, email, nickname, sub } = JSON.parse(req.query.user);
  const id = generate_id(nickname, sub);

  let user;

  const g_email = email || (id + '@tw.hudl.us');

  try {
    console.log('Trying to get user by id:', id);
    const { data } = await axios.get(`https://chat.rememberinglouise.com/users/${id}.json`, {
      params: {
        api_key: api_key,
        api_username: api_username,
      },
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': api_key,
        'Api-Username': api_username,
      },
    });

    user = data.user;
    console.log('Found user with username: ', user.username);
  } catch (error) {
    console.log("Couldn't find user, trying to create a user");
    let res_data = await create_user(name, g_email, id);

    if (res_data && res_data.data && !res_data.data.success) {
      if (res_data.data.message === 'Primary email has already been taken') {
        console.log('Trying to recreate with email:', (id + '@tw.hudl.us'));
        res_data = await create_user(name, (id + '@tw.hudl.us'), id);
      }
      if (res_data && res_data.data && !res_data.data.success) { console.log("Couldn't create a user: ", res_data.data.message); }
    }
    if (res_data && res_data.data && res_data.data.user_id) {
      const user_data = await axios.get(`https://chat.rememberinglouise.com/admin/users/${res_data.data.user_id}.json`, {
        params: {
          api_key: api_key,
          api_username: api_username,
        },
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': api_key,
          'Api-Username': api_username,
        },
      });

      user = user_data.data;
      console.log('Created a user with username: ', user.username);
    } else {
      console.log('Creation Failed!');
      console.log(JSON.parse(req.query.user));
    }
  }
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.json(user);
}
