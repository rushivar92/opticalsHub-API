const Joi = require('joi');
var mongoose = require('mongoose');
const config = require('../common/config/env.config');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});
//const dbConnectionUrl = () => "mongodb://localhost:27017/test"//process.env.DB_CONNECTION_URL + process.env.DB_NAME;
//mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});


const Item = mongoose.model('items', new mongoose.Schema({ 
    name: { type: String },
    group_id: { type: String },
    model: { type: String },
    price:{type: Number},
    frameshape:{type: String},
    frametype:{type: String},
    framecolor:{type: String},
    framematerial:{type: String},
    lensecolor:{type: String},
    lensematerial:{type: String},
    lensefeature:{type: String},
    usage:{type: String},
    sizefor:{type: String},
    item_id:{type:String},
    similar_items:{type:Array},
    Images:{type:Array}
}, { versionKey: false }));

exports.Item = Item;
