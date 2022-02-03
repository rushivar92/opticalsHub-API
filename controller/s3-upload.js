const AWS = require('aws-sdk');
const multer = require('multer');
const express = require('express');
const app = express();
const s3 = new AWS.S3({
  accessKeyId: "AKIAVRID7OZH37NGKYVD",
  secretAccessKey:"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"
});
const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({ storage }).single('image')
AWS.config.update({
    region: "ap-south-1"
});
exports.uploadFile = async(req,res)=> {
    console.log("req",req.file)
     const params = {
         Bucket: 'opticshub-data', // pass your bucket name
         Key: req.file.originalname, // file will be saved as testBucket/contacts.csv
         Body: req.file.buffer,
         ContentType: "image"
     };
     s3.upload(params, function(s3Err, result) {
         if (s3Err) throw s3Err
         console.log('File uploaded successfully at',result)
     });
};
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
            console.log(req.file.originalname)
            return res.status(200).send({
                "user_msg": "data saved successfully"
            });

        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ "msg": "Invalid Token" })
    }

})