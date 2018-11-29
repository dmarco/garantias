'use strict'

const User = require('../models/user')
const service = require('../services')

const fs = require('fs')
const pathFiles = './uploads/'
const mime = require('mime-types')

const Mailer = require('../services/mailer')
const cron = require('cron')


/**************************************************************************** 
 * SIGNUP
 */
function signUp (req, res) {
  
  let user = new User()
  user.email = req.body.email
  user.password = req.body.password

  user.save((err, userStored) => {
    if (err) {
      if (err.code == 11000) {
        return res.status(200).send({
          message: `El email ya está registrado!`,
          responseStatus: `danger`
        })
      }
    }else{
      
      let dataUser = {
        email: userStored.email,
        url: process.env.FRONTEND_DOMAIN
      }
      Mailer.signUp(userStored.email, dataUser)
      res.status(200).send({ 
        user: userStored,
        message: `Registro exitoso`,
        responseStatus: `success` 
      })
    }
  })

}


/**************************************************************************** 
 * SIGNIN
 */
function signIn (req, res) {
  
  var query = User.findOne({ email: req.body.email })
  query.select('email password name status role')
  // query.limit(5)
  query.exec(function (err, user) {
    
    if (err) return res.status(200).send({ message: err, responseStatus: `danger` })
    if (!user) return res.status(200).send({ message: 'No existe el usuario', responseStatus: 'danger' })
    
    // console.log('is a %s', user);
    if ( user.password === req.body.password && user.role === req.body.role ){
      return res.status(200).send({
        message: 'Te has logueado correctamente',
        responseStatus: `success`,
        token: service.createToken(user),
        user: {
            email: user.email,
            name: user.name,
            status: user.status
        }
      })
    }else{
      return res.status(200).send({ message: 'Password incorrecta', responseStatus: `danger` })
    }
  
  });

}



/**************************************************************************** 
 * GET USERS
 */
function getUsers (req, res) {
  User.find({}, (err, user) => {
    
    if (err) return res.status(500).send({message: `Error al realizar la petición: ${err}`})
    if (!user) return res.status(404).send({message: 'No existen productos'})

    req.user = user
    res.status(200).send({
      user
    })
  })
}



/**************************************************************************** 
 * GET USERS
 */
function getUsersWithWarranty (req, res) {
  User.find({}, (err, users) => {
    
    if (err) return res.status(500).send({ message: err, responseStatus: `danger` })
    if (!users) return res.status(404).send({ message: 'No existe el usuario', responseStatus: 'danger' })

    let warranties = []
    users.forEach(function(user) {
      if(user.status !== 'false'){
        warranties.push(user)
      }
    });

    res.status(200).send({
      warranties
    })
  })
}



/**************************************************************************** 
 * GET USER
 */
function getUserId (req, res) {

  let id = req.params.id
  User.findById(id, function (err, user) {

    if (err) return res.status(200).send({ message: err, responseStatus: `danger` })
    if (!user) return res.status(200).send({ message: 'No existe el usuario', responseStatus: 'danger' })

    req.user = user
    res.status(200).send({
      user
    })
  })
  
  
}


/**************************************************************************** 
 * GET USER
 */
function getUserEmail (req, res) {

  // console.log(req.params.email);
  var query = User.findOne({ email: req.params.email })
  query.exec(function (err, user) {
    
    if (err) return res.status(200).send({ message: err, responseStatus: `danger` })
    if (!user) return res.status(200).send({ message: 'No existe el usuario', responseStatus: 'danger' })
    
    if( user.status ){
      return res.status(200).send({
        message: 'Te has logueado correctamente',
        responseStatus: `success`,
        user: user
      })
    }else{
      return res.status(200).send({
        message: 'Solicitud incompleta',
        responseStatus: `danger`
      })
    }
  
  });
  
  
}



/**************************************************************************** 
 * GET USER
 */
function getUserFiles (req, res) {
  
  
  
  fs.readFile(pathFiles + req.params.img, function(err, data) {
    if (err) {
      return res.status(200).send({
        message: `No files in thrre.`,
        responseStatus: `danger`
      })
    }else{
      res.writeHead(200, {'Content-Type': mime.lookup(pathFiles + req.params.img)})
      res.write(data)
      res.end()
    }
  })
  
}


module.exports = {
  signUp,
  signIn,
  getUserId,
  getUserEmail,
  getUsers,
  getUsersWithWarranty,
  getUserFiles
}
