'use strict'

const User = require('../models/user')
// const service = require('../services')
const moment = require('moment')
const MP = require ("mercadopago")
const http = require("http")
const Mailer = require('../services/mailer')
const cron = require('cron')





/*****************************************
* Chequea todos los dias a la medianoche
* si no pago
* Manda mail informando al usuario
*/
new cron.CronJob({
  cronTime: '0 0 0 * * *', // Todos los dias a las 00:00:00 horas
  onTick: function() {
    console.log("Cron 4")
    User.find({}, (err, user) => {
      if (err) return console.log(`Error al ejecutar el Cron4: ${err}`)
      if (!user) return console.log(`No existe usuario`)
      user.forEach(function(u) {
        if (u.preferences && !u.notifications) {
          let dataForm = {
            email: u.email,
            payment_link: JSON.parse(u.preferences).init_point,
            url: process.env.FRONTEND_DOMAIN
          }
          Mailer.rememberPayment(u.email, dataForm)
        }
      })
    
    })
    
  },
  start: true,
  timeZone: 'America/Argentina/Buenos_Aires'
})

/*****************************************
* Chequea todos los dias a la medianoche
* si no completo el formulario
* Manda mail informando al usuario
*/
new cron.CronJob({
  cronTime: '0 0 0 * * *', // Todos los dias a las 00:00:00 horas
  onTick: function() {
    console.log("Cron 3")
    User.find({}, (err, user) => {
      if (err) return console.log(`Error al ejecutar el Cron3: ${err}`)
      if (!user) return console.log(`No existe usuario`)
      user.forEach(function(u) {
        if (u.status === 'false' && u.role === 'default') {
          let dataForm = {
            email: u.email,
            url: process.env.FRONTEND_DOMAIN
          }
          Mailer.rememberForm(u.email, dataForm)
        }
      })
    
    })
    
  },
  start: true,
  timeZone: 'America/Argentina/Buenos_Aires'
})

/*****************************************
* Chequea la fecha de expiración
* Manda mail informando al usuario
*/
new cron.CronJob({
  // cronTime: '15 40 12 * * 1-5',
  cronTime: '0 0 */3 * * *', // Cada 3 horas
  // cronTime: '*/15 * * * * *', // Cada 3 horas
  onTick: function() {
    console.log("Cron 1")
    User.find({}, (err, user) => {
      if (err) return console.log(`Error al ejecutar el Cron1: ${err}`)
      if (!user) return console.log(`No existe usuario`)
      
      user.forEach(function(u) {
        if (u.expiration_date) {
          if( moment().isAfter(u.expiration_date) === false ) {
            console.log("Expiró")
            
            let userEmail = u.email
            let dataForm = {
              user_fullname: u.name + " " + u.last_name,
              expiration_date: moment(u.expiration_date).format('D-M-YYYY'),
              url: process.env.FRONTEND_DOMAIN,
              tems: 'https://cycwp.dmarcote.avatarla.io/app/uploads/2018/06/cyc-demo.pdf'
            }
            Mailer.policyExpired(userEmail, dataForm)
            
          }
        }
      })
    
    })
    
  },
  start: true,
  timeZone: 'America/Argentina/Buenos_Aires'
})

/*****************************************
* Chequea el estado del pago
* Actualiza el estado segun respuesta de MP
*/
new cron.CronJob({
  cronTime: '0 0 */2 * * *', // Cada 2 horas
  onTick: function() {
    console.log("Cron 2")
    User.find({}, (err, user) => {
      if (err) return console.log(`Error al ejecutar el Cron2: ${err}`)
      if (!user) return console.log(`No existe usuario`)
      
      user.forEach(function(u) {
        if (u.notifications) {
          if ( JSON.parse(u.notifications).status !== 'approved' ) { // Chequea el estado en la base
            let ID = JSON.parse(u.notifications).id
            // console.log("ID >>>", ID)
            let mp = new MP (process.env.MP_CLIENT_ID, process.env.MP_CLIENT_SECRET)
            let paymentInfo = mp.get("/v1/payments/" + ID)
              .then((paymentResult) => {
                console.log("Status en MP >>>", paymentResult.response.status)
                if( paymentResult.response.status !== 'approved' ){ // Chequea el estado en MP
                  console.log("Cambia el estado en la base de datos >>>", u.email)
                  console.log("paymentResult.response >>>", paymentResult.response)
                  // '{"acquirer":null,"acquirer_reconciliation":[],"additional_info":{},"authorization_code":null,"binary_mode":false,"call_for_authorize_id":null,"captured":true,"card":{"cardholder":{"identification":{"number":"11111111","type":"DNI"},"name":"CONT"},"date_created":"2018-07-16T14:20:05.000-04:00","date_last_updated":"2018-07-16T14:20:05.000-04:00","expiration_month":2,"expiration_year":2024,"first_six_digits":"503175","id":null,"last_four_digits":"0604"},"collector_id":331899823,"counter_currency":null,"coupon_amount":0,"currency_id":"ARS","date_approved":null,"date_created":"2018-07-16T14:20:05.000-04:00","date_last_updated":"2018-07-16T14:20:06.000-04:00","date_of_expiration":null,"deduction_schema":null,"description":"Gestione su garantía inmobiliaria con mínimos requisitos, en menos de 48hs y desde la comodidad de su casa.","differential_pricing_id":null,"external_reference":"5b35393ecefd000010e688b6","fee_details":[],"id":3939848782,"installments":1,"issuer_id":"3","live_mode":true,"merchant_account_id":null,"merchant_number":null,"metadata":{},"money_release_date":null,"money_release_schema":null,"notification_url":"https://cyc.dmarcote.avatarla.io/api/notifications","operation_type":"regular_payment","order":{"id":"781789933","type":"mercadopago"},"payer":{"email":null,"entity_type":null,"first_name":null,"id":"331896082","identification":{},"last_name":null,"operator_id":null,"phone":{},"type":"registered"},"payment_method_id":"master","payment_type_id":"credit_card","processing_mode":"aggregator","refunds":[],"shipping_amount":0,"sponsor_id":null,"statement_descriptor":null,"status":"in_process","status_detail":"pending_contingency","transaction_amount":2,"transaction_amount_refunded":0,"transaction_details":{"acquirer_reference":null,"external_resource_url":null,"financial_institution":null,"installment_amount":2,"net_received_amount":0,"overpaid_amount":0,"payable_deferral_period":null,"payment_method_reference_id":null,"total_paid_amount":2}}'
                  // let dataForm = {
                  //   notifications: JSON.stringify(paymentResult.response),
                  // }
                  // User.findOneAndUpdate({ 'email': u.email }, dataForm ).then((data) =>{
                  //   if(data === null) console.log('User Not Found')
                  //   Mailer.statusChanged(u.email, dataForm)
                  // })
                  // .catch((error) => {
                  //   console.log("Error findOneAndUpdate >>>", err)
                  // })
                  
                }
              })
              .catch((err) => {
                console.log("Error paymentInfo >>>", err)
              })
            
          }
        }
      })
    
    })
    
  },
  start: true,
  timeZone: 'America/Argentina/Buenos_Aires'
})

    


function myFunc(arg) {
 
  User.find({}, (err, user) => {
    if (err) return console.log(`Error al ejecutar el Cron1: ${err}`)
    if (!user) return console.log(`No existe usuario`)
    
    user.forEach(function(u) {
      if(u.name){
        // if (u.expiration_date) {
          // if( moment().isAfter(u.expiration_date) === false ) {
            
            let userEmail = u.email
            let dataForm = {
              user_fullname: u.name + " " + u.last_name,
              expiration_date: moment(u.expiration_date).format('D-M-YYYY'),
              url: process.env.FRONTEND_DOMAIN,
              tems: 'https://cycwp.dmarcote.avatarla.io/app/uploads/2018/06/cyc-demo.pdf'
            }
            console.log("Expiró", dataForm)
            Mailer.policyExpired(userEmail, dataForm)
            
          // }
        // }
      }
    })
  
  })
}
// setTimeout(myFunc, 1500, 'funky');




/*****************************************
* Salva formulario
*/
function saveFormData (req, res) {
  
  let userEmail = req.body.email
  let dataForm = { 

    name: req.body.name,
    last_name: req.body.last_name,
    area_code: req.body.area_code,
    phone: req.body.phone,
    contact_ws: req.body.contact_ws,
    cuit_cuil: req.body.cuit_cuil,
    address_street: req.body.address_street,
    address_number: req.body.address_number,
    address_floor: req.body.address_floor,
    address_apartment: req.body.address_apartment,
    state: req.body.state,
    city: req.body.city,
    postal_code: req.body.postal_code,
    political_person: req.body.political_person,

    worker_type: req.body.worker_type,
    salary: req.body.salary,
    antiquity: req.body.antiquity,
    documentation: req.body.documentation,

    currency: req.body.currency,
    contract_period: req.body.contract_period,
    first_month_amount: req.body.first_month_amount,
    expenses: req.body.expenses,
    total_amount: req.body.total_amount,
    total_amount_expenses: req.body.total_amount_expenses,
    rental_policy: req.body.rental_policy,
    fee_income: req.body.fee_income,
    
    status: req.body.status,
    nosis: false
  }
  // console.log(userEmail)
  
  let dataForm2 = {
    user_fullname: req.body.name + " " + req.body.last_name,
    status: req.body.status,
    nosis: req.body.nosis,
    comments: req.body.comments,
    url: process.env.FRONTEND_DOMAIN,
    tems: 'https://cycwp.dmarcote.avatarla.io/app/uploads/2018/06/cyc-demo.pdf'
  }
  
  User.findOneAndUpdate({ 'email': userEmail }, dataForm, {new: true} ).then((data) =>{
        if(data === null){
            console.log('User Not Found');
        }
        
        Mailer.formCompleted(userEmail, dataForm2)
        
        return res.status(200).send({
          message: `Solicitud enviada!`,
          responseStatus: `success`
        })
    }).catch( (error) => {
        return res.status(200).send({
          message: `${error}`,
          responseStatus: `danger`
        })
    })
  
}







/*****************************************
* Update status
*/
function updateStatus (req, res) {
  
  let userEmail = req.body.email
  let dataForm = {
    user_fullname: req.body.user_fullname,
    status: req.body.status,
    nosis: req.body.nosis,
    comments: req.body.comments,
    url: process.env.FRONTEND_DOMAIN,
    tems: 'https://cycwp.dmarcote.avatarla.io/app/uploads/2018/06/cyc-demo.pdf'
  }

  User.findOneAndUpdate({ 'email': userEmail }, dataForm, {new: true} ).then((data) =>{
        
      if(data === null){
          console.log('User Not Found');
      }
      
      /*
      * Envio de mails
      */
      Mailer.statusChanged(userEmail, dataForm)
      
      /*
      * Respuesta
      */
      return res.status(200).send({
        message: `Status Updated!`,
        responseStatus: `success`
      })
    }).catch( (error) => {
        return res.status(200).send({
          message: `${error}`,
          responseStatus: `danger`
        })
    })
  
}








/*****************************************
* Actualiza el status de la poliza
*/
function updateStatusPolicy (req, res) {
  
  let userEmail = req.body.email
  let dataForm = {
    user_fullname: req.body.user_fullname,
    status: req.body.status,
    nosis: req.body.nosis,
    comments: req.body.comments,
    policy: req.body.policy,
    expiration_date: moment(req.body.expiration_date).format('D-M-YYYY'),
    url: process.env.FRONTEND_DOMAIN,
    tems: 'https://cycwp.dmarcote.avatarla.io/app/uploads/2018/06/cyc-demo.pdf'
  }

  User.findOneAndUpdate({ 'email': userEmail }, dataForm, {new: true} ).then((data) =>{
        
      if(data === null){
          console.log('User Not Found');
      }
      
      /*
      * Envio de mails
      */
      Mailer.policySent(userEmail, dataForm)
      
      /*
      * Respuesta
      */
      return res.status(200).send({
        message: `Status Updated!`,
        responseStatus: `success`
      })
    }).catch( (error) => {
        return res.status(200).send({
          message: `${error}`,
          responseStatus: `danger`
        })
    })
  
}








/*****************************************
* (MERCADOPAGO) Genera el pago
*/
function generatePayment (req, res) {
  
  /*
  * Mercadopago
  */

  let userData = { 
    user_fullname: req.body.user_fullname,
    user_email: req.body.email,
    user_id: req.body.user_id,
    total_amount: req.body.total_amount
  }
  
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++", process.env.MP_CLIENT_ID, process.env.MP_CLIENT_SECRET, userData)
  let mp = new MP (process.env.MP_CLIENT_ID, process.env.MP_CLIENT_SECRET)

  let preference = {
      "items": [
          {
              "id": Date.now(),
        			"title": "Gestione su garantía inmobiliaria con mínimos requisitos, en menos de 48hs y desde la comodidad de su casa.",
        			"description": "Garantía inmobiliara",
        			"currency_id": "ARS",
        			"picture_url": process.env.FRONTEND_DOMAIN + "/api/logo.png",
        			"category_id": "others", // Available categories at https://api.mercadopago.com/item_categories
        			"quantity": 1,
        			"unit_price": 1 // Number(userData.total_amount)
          }
      ],
    	"back_urls": {
    		"success": "https://cyc.dmarcote.avatarla.io/pago/",
    		"failure": "https://cyc.dmarcote.avatarla.io/pago/",
    		"pending": "https://cyc.dmarcote.avatarla.io/pago/"
    	},
    	"auto_return": "all",
    	"notification_url": "https://cyc.dmarcote.avatarla.io/api/notifications",
    	"external_reference": userData.user_id,
    	"expires": true,
    	"expiration_date_from": "2020-02-01T12:00:00.000-04:00",
    	"expiration_date_to": "2020-02-28T12:00:00.000-04:00"
  }

  mp.createPreference (preference, function (err, preferenceResult){
    if (err) {
      console.log('Error!')
    } else {
      
      let updateData = { 
        name: req.body.name,
        last_name: req.body.last_name,
        status: req.body.status,
        nosis: req.body.nosis,
        comments: req.body.comments,
        preferences: JSON.stringify(preferenceResult.response),
        url: process.env.FRONTEND_DOMAIN,
        tems: 'https://cycwp.dmarcote.avatarla.io/app/uploads/2018/06/cyc-demo.pdf'
      }
      
      User.findOneAndUpdate({ '_id': userData.user_id }, updateData, {new: true} ).then((updatedData) => {
          if(updatedData === null){
              console.log('User Not Found');
          }
          
          let dataForm = {
            user_fullname: userData.user_fullname,
            link: preferenceResult.response.init_point,
            url: process.env.FRONTEND_DOMAIN
          }
          
          /*
          * Mail
          */
          Mailer.paymentGenerated(userData.user_email, dataForm)
          
          return res.status(200).send({
            message: `Preference saved!`,
            responseStatus: `success`,
            data: updatedData
          })
          
      }).catch( (error) => {
          return res.status(200).send({
            message: `${error}`,
            responseStatus: `danger`
          })
        })
      
      
    }
  })
  
}








/*****************************************
* (MERCADOPAGO) Recibe el status del pago desde MP
*/
function notifications (req, res) {

  console.log("????????????????????????????????????????????????????")
  
  if (req.body.type == "payment" || req.body.type == "test") { 
    
    let mp = new MP (process.env.MP_CLIENT_ID, process.env.MP_CLIENT_SECRET)
		let paymentInfo = mp.get("/v1/payments/" + req.body.data.id)
		  .then((paymentResult) => {
		    
		    console.log('<<< paymentResult >>>')
		    console.log(paymentResult)
        console.log('<<< paymentResult >>>')
	    
		    let userStatus = '0'
		    if( paymentResult.response.status === 'approved'){
		      userStatus = '4'
		    }else{
		      userStatus = '3'
		    }
        
        // console.log("result.response >>>", userStatus)
		    let updateData = { 
          notifications: JSON.stringify(paymentResult.response),
          status: userStatus
        }
        
        User.findOneAndUpdate({ '_id': paymentResult.response.external_reference }, updateData, {new: true} )
          .then((updatedData) =>{
            if(updatedData === null){
                console.log('User Not Found');
            }
            return res.status(200).send({
              message: `Notification saved!`,
              responseStatus: `success`
            })
          }).catch( (error) => {
            return res.status(200).send({
              message: `${error}`,
              responseStatus: `danger`
            })
          })
		    
		  })
		  .catch((err) => {
		    return res.status(200).send({
          message: `${err}`,
          responseStatus: `danger`
        })
		  })
		
  		if (paymentInfo.status == 200) {
  			console.log (paymentInfo.response)
  		}
	}
  
  res.statusCode = 200
  res.end()
  
}


module.exports = {
  saveFormData,
  updateStatus,
  updateStatusPolicy,
  generatePayment,
  notifications
}