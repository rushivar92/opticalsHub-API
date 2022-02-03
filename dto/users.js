const Joi = require('joi');
var mongoose = require('mongoose');
const config = require('../common/config/env.config');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});
//const dbConnectionUrl = () => "mongodb://localhost:27017/test"//process.env.DB_CONNECTION_URL + process.env.DB_NAME;
//mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});


const User = mongoose.model('tbl_users', new mongoose.Schema({
    user_name: { type: String },
    mobile_no: { type: String },
    name: { type: String },
    email:{type: String},
    password:{type: String},
    otp:{type: String},
    otp_verify:{type: Boolean,default:false},
    is_active:{type: Boolean,default:true},
    address:{type:Array},
    token:{type: String}

}, { versionKey: false }));

exports.User = User;
