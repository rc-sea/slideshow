import axios from 'axios';

require('dotenv').config();

const clientId = process.env.AUTH_API_ID;
const clientSecret = process.env.AUTH_SECRET;
const auth_domain = process.env.AUTH_DOMAIN;

export default async function (req, res, next) {
  const id = req.query.id;

  try {
    console.log('Trying to get token for auth0');
    const { data: { access_token, token_type } } = await axios.post(`https://${auth_domain}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${auth_domain}/api/v2/`,
    });

    if (access_token) { console.log('Received Token'); }
    try {
      console.log('Trying to get roles');
      const { data: roles } = await axios.get(`https://${auth_domain}/api/v2/users/${id}/roles`, {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      });

      console.log('Received roles: ', roles);
      res.json(roles);
    } catch (err) {
      console.log(err);
      next(err);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
}
