'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

function createToken (user) {
  const payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
    // exp: moment().add('10', 'seconds').unix()
  }
  
  return jwt.encode(payload, config.SECRET_TOKEN)
}

function decodeToken (token) {
  
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.SECRET_TOKEN)
      
      if (payload.exp <= moment().unix()) {
        reject({
          status: 200,
          message: 'El token ha expirado'
        })
      }
      resolve(payload.sub)
    } catch (err) {
      reject({
        status: 200,
        message: 'Invalid Token'
      })
    }
  })
  
  return decoded
}

module.exports = {
  createToken,
  decodeToken
}
