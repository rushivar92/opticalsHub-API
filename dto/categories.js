const Joi = require('joi');
var mongoose = require('mongoose');
const config = require('../common/config/env.config');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});
//const dbConnectionUrl = () => "mongodb://localhost:27017/test"//process.env.DB_CONNECTION_URL + process.env.DB_NAME;
//mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});


const Categories = mongoose.model('categories', new mongoose.Schema({ 
   
    name: { type: String },
    category_id: {type: String}
    // group_ids:{type: Array}
    

}, { versionKey: false }));

exports.Categories = Categories;
