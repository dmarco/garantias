'use strict'

const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
// const fs = require('fs')
const path = require('path');
const ABSPATH = path.dirname(process.mainModule.filename)

let transporter
let mailOptions
let options

nodemailer.createTestAccount((err, account) => {
    
  if (err) {
    console.log('Mail Account has not been created')
  }
  
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS // generated ethereal password
    }
  }) 
  
  options = {
   viewPath: 'views/email/',
   extName: '.hbs'
  }

})

function rememberForm (to, user) {
  
  mailOptions = {
    from: process.env.EMAIL_CONTACT_FROM,
    to: to,
    subject: 'Recordatorio formulario incompleto',
    template: 'remember-form',
    context: user
  }
  
  transporter.use('compile', hbs(options));
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(info.envelope);
      console.log(info.messageId);
    }
  })

}


function rememberPayment (to, user) {
  
  mailOptions = {
    from: process.env.EMAIL_CONTACT_FROM,
    to: to,
    subject: 'Recordatorio de pago',
    template: 'remember-payment',
    context: user
  }
  
  transporter.use('compile', hbs(options));
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(info.envelope);
      console.log(info.messageId);
    }
  })

}


function signUp (to, user) {
  
  mailOptions = {
    from: process.env.EMAIL_CONTACT_FROM,
    to: to,
    subject: 'Registro exitoso',
    template: 'registered',
    context: user
  }
  
  transporter.use('compile', hbs(options));
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(info.envelope);
      console.log(info.messageId);
    }
  })

}

function formCompleted (to, dataForm) {
  
  mailOptions = {
    from: process.env.EMAIL_CONTACT_FROM,
    to: to,
    subject: 'Formulario Completo',
    template: 'form-completed',
    context: dataForm
  }
  
  transporter.use('compile', hbs(options));
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(info.envelope);
      console.log(info.messageId);
    }
  })

}

function statusChanged (to, dataForm) {
  
  mailOptions = {
    from: process.env.EMAIL_CONTACT_FROM,
    to: to,
    subject: 'Cambio en estado de su solicitud',
    template: 'status-changed',
    context: dataForm
  }
  
  transporter.use('compile', hbs(options));
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('the status mail has not been sent!')
    }
  })

}


function policyExpired (to, dataForm) {
  
  mailOptions = {
    from: process.env.EMAIL_CONTACT_FROM,
    to: to,
    subject: 'Su Póliza ha expirado',
    template: 'policy-expired',
    context: dataForm
  }
  
  transporter.use('compile', hbs(options));
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('the policy expired mail has not been sent!')
    }
  })

}


function policySent (to, dataForm) {
  // console.log('1.', process.env.FRONTEND_DOMAIN)
  // console.log('2.', JSON.parse(dataForm.policy)[0].name)
  mailOptions = {
    from: process.env.EMAIL_CONTACT_FROM,
    to: to,
    subject: 'Envío de Póliza',
    template: 'policy-sent',
    context: dataForm,
    attachments: [
      {
        filename: 'Poliza.pdf',
        // path: process.env.FRONTEND_DOMAIN + '/api/file/' + JSON.parse(dataForm.policy)[0].name
        path: ABSPATH + '/uploads/' + JSON.parse(dataForm.policy)[0].name
        // path: 'https://cyc.dmarcote.avatarla.io/api/file/cyc-demo-1531490386684.pdf'
      }
    ]
  }
  
  transporter.use('compile', hbs(options));
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('the policy mail has not been sent!')
    }
  })

}


function paymentGenerated (to, link) {
  
  mailOptions = {
    from: process.env.EMAIL_CONTACT_FROM,
    to: to,
    subject: 'CyC Link de pago',
    template: 'payment-generated',
    context: link
  }
  
  transporter.use('compile', hbs(options));
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('the payment generated mail has not been sent!')
    }
  })
  
}


module.exports = {
  rememberForm,
  rememberPayment,
  signUp,
  formCompleted,
  statusChanged,
  policySent,
  policyExpired,
  paymentGenerated
}