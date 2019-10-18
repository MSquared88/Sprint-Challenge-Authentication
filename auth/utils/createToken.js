const jwt = require('jsonwebtoken');

const envSecret = require('./secret')

module.exports = function createToken(user) {
    const payload = {
      subject: user.id,
      username: user.username
    }
    const options = {
      expiresIn: '1h'
    }
  
    const secret = envSecret.jwtSecret
  
    return jwt.sign(payload, secret, options)
  }