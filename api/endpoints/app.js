'use strict'

const express = require('express')
const cors = require('cors') // Allow Crossdomain
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const app = express()
const api = require('./routes')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ extended: true}))
app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs'
}))
app.set('view engine', '.hbs')
app.use(express.static('static'))

app.use(api)

app.get('/login', (req, res) => {
  res.render('login')
})

module.exports = app
