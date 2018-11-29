'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const moment = require('moment')
// const crypto = require('crypto')

const UserSchema = new Schema({
  
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  role: { type: String, default: 'default' },
  
  name: String,
  last_name: String,
  area_code: String,
  phone: String,
  contact_ws: Boolean,
  cuit_cuil: String,
  address_street: String,
  address_number: String,
  address_floor: String,
  address_apartment: String,
  state: String,
  city: String,
  postal_code: String,
  political_person: String,

  worker_type: String,
  salary: String,
  antiquity: Number,
  documentation: String,

  currency: String,
  contract_period: Number,
  first_month_amount: String,
  expenses: String,
  total_amount: String,
  total_amount_expenses: String,
  rental_policy: String,
  fee_income: Number,
  
  status: { type: String, default: 'false' },
  nosis: Boolean,
  
  comments: String,
  
  preferences: String,
  notifications: String,
  
  policy: String,
  expiration_date: Date,
  
  signupDate: { type: Date, default: moment().format('YYYY-M-D HH:mm:ss') },
  lastLogin: Date
})

UserSchema.pre('save', (next) => {
  let user = this
  // if (!user.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

/*UserSchema.methods.gravatar = function () {
  if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`

  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}*/

module.exports = mongoose.model('User', UserSchema)