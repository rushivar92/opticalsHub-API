const Joi = require('joi');
const mongoose = require('mongoose');
// const config = require('../common/config/env.config');
// mongoose.connect(config.dbstring, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});


const Geners= mongoose.model('geners', new mongoose.Schema({
    parent_id: { type: String },
    gen_name: { type: String },
    sort_order: { type: String },
    // created_by: { id: {type: String}, user_name: {type: String} },
    // created_time: { type: Date, default: Date.now},
    // updated_by: { id: {type: String}, user_name: {type: String} },
    // updated_time: {type: Date, default: Date.now},
    // is_active:{type: Boolean,default:true},
    // create_ip :{type: String},
    // create_agent :{type: String},
    // update_ip :{type: String},
    // update_agent :{type: String}

}, { versionKey: false }));

exports.Geners = Geners;
