const Joi = require('joi');
const mongoose = require('mongoose');
// const config = require('../common/config/env.config');
// mongoose.connect(config.dbstring, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});


const User = mongoose.model('tbl_users', new mongoose.Schema({
    user_name: { type: String },
    mobile_no: { type: String },
    email:{type: String},
   password:{type: String},
   otp:{type: String},
   otp_verify:{type: Boolean,default:false},
   is_active:{type: Boolean,default:true},

}, { versionKey: false }));

exports.User = User;
