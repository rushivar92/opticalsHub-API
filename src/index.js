var mongoose = require('mongoose');
const express = require('express');
//const config = require('../common/config/env.config');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const agent = require('../route/ac-route');
require('dotenv').config()
console.log(process.env.PORT)
app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});
 
app.use(express.json());
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
mongoose.promise = global.promise;
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true,parameterLimit:50000}));
agent.routesConfig(app)



app.use(function(err, req, res, next){
    res.send({error: err.message});
    });
    
    
app.listen(process.env.PORT, function () {
    console.log('app listening at port %s', process.env.PORT);
    });
    