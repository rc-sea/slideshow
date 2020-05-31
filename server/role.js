require('dotenv').config()
import axios from 'axios'

const clientId = process.env.AUTH_API_ID 
const clientSecret = process.env.AUTH_SECRET
const auth_domain = process.env.AUTH_DOMAIN

export default async function (req, res, next) {
  const email = req.query.email;
  try{
    const { data: { access_token, token_type } } = await axios.post(`https://${auth_domain}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${auth_domain}/api/v2/`
    })
    try{
      const { data: users } = await axios.get(`https://${auth_domain}/api/v2/users?q=email:"${email}"&search_engine=v3`, {
        headers: {
          "Authorization": `${token_type} ${access_token}`
        }
      })
      if (users[0]) {
        try{
          const { data: roles } = await axios.get(`https://${auth_domain}/api/v2/users/${users[0].user_id}/roles`, {
            headers: {
              "Authorization": `${token_type} ${access_token}`
            }
          })
          res.json(roles);
        } catch(err){
          console.log(err)
          next(err)
        }
      }
    }catch(err){
      console.log(err)
      next(err)
    }

  }catch(err){
    console.log(err)
    next(err)
  }
}
