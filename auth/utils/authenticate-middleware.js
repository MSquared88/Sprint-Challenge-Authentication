/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken')

const secret = require('./secret')

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if(token){
      jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
          if(err){
              res.status(401).json({message: 'You shall not pass!!'})
          }
          else {
              req.username = decodedToken.username
              next()
          }
      })
  }
  else{
      res.status(400).json({message: 'a authorization token is required in the header'})
  }
};