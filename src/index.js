var mongoose = require('mongoose');
const express = require('express');
const path = require('path')
const cors = require('cors');
var bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const multer = require('multer');

require('dotenv').config()

const user = require('../route/user-route');
const item = require('../route/item-route');

//const config = require('../common/config/env.config');
const app = express();

app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
AWS.config.update({
  region: "ap-south-1"
});
const s3 = new AWS.S3({
  accessKeyId: "AKIAVRID7OZH37NGKYVD",
  secretAccessKey: "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"
});




mongoose.promise = global.promise;


app.use(cors());
app.use(function (req, res, next) {
  console.log("testing")
  console.log(req.method)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    console.log("insode options method")
    return res.send(200);
  } else {
    return next();
  }
});





const test = (req, res) => {


  res.status(200).json({ status: 'success' })
}


app.get('/', test);
user.routesConfig(app)
item.routesConfig(app)

app.use(express.static(path.join(__dirname, 'public')));
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '')
  }
});
const upload = multer({ storage }).single('image');
app.post('/api/v1/uploadFile', upload, async (req, res) => {

  try {
    const params = {
      Bucket: "opticshub-data",
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: "image"
    }

    s3.upload(params, (error, data) => {
      if (error) {
        res.status(500).send({ "msg": "upload error", "error": error })
      }
      console.log("data", data)
      return res.status(200).send(data);

    })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ "msg": "Invalid Token" })
  }

})
const port = process.env.PORT || 3700
module.exports = app.listen(port, () => {
  console.log(`Connector listening on port ${port}.`)
})


