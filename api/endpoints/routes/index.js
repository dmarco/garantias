'use strict'

const express = require('express')
const userCtrl = require('../controllers/user')
const formDataCtrl = require('../controllers/form-data')
const filesCtrl = require('../controllers/files')
// const mailCtrl = require('../controllers/mailer')
const auth = require('../middlewares/auth')
const api = express.Router()

/*
* AUTH
*/
api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)
api.get('/users', userCtrl.getUsers)
api.get('/users-with-warranty', userCtrl.getUsersWithWarranty)
api.get('/user-by-id/:id', userCtrl.getUserId)
api.get('/user-by-email/:email', userCtrl.getUserEmail)
api.get('/checktoken', auth, (req, res) => {
    res.status(200).send({ message: 'Tienes acceso' })
})
api.get('/file/:img', userCtrl.getUserFiles)
// api.get('/sendmail', mailCtrl.sendEmail)

/*
* SAVE FORM
*/
api.post('/formdata', formDataCtrl.saveFormData)
api.post('/update-status', formDataCtrl.updateStatus)
api.post('/update-status-policy', formDataCtrl.updateStatusPolicy)
api.post('/upload-files', filesCtrl.uploadFiles)
api.post('/remove-files', filesCtrl.removeFiles)
api.post('/notifications', formDataCtrl.notifications)
api.post('/generate-payment', formDataCtrl.generatePayment)

module.exports = api
