'use strict'

const fs = require('fs')
const path = require('path');
const multer  = require('multer')
const pathFiles = './uploads/'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathFiles)
  },
  filename: function (req, file, cb) {
    let newname = path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname)
    cb(null, newname )
  }
})
const upload = multer({ storage: storage }).single('file')


function uploadFiles (req, res) {
  
  upload(req, res, function (err) {
    if (err) {
      return res.status(200).send({
        message: `No files were uploaded.`,
        responseStatus: `danger`
      })
    }else{
      return res.status(200).send({
        message: `Files uploaded.`,
        responseStatus: `success`,
        newname: req.file.filename
      })
    }
  })
  
}

function removeFiles (req, res) {
  fs.unlink( pathFiles + req.body.file, function(err){
    if(err) {
      return res.status(200).send({
        message: `No such file or directory.`,
        responseStatus: `danger`
      })
    }else{
      return res.status(200).send({
        message: `Files deleted.`,
        responseStatus: `success`
      })
    }
 })
}

module.exports = {
  uploadFiles,
  removeFiles
}