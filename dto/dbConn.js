var mongoose = require('mongoose');
const dbConnectionUrl = () => process.env.MONGO_URI//process.env.DB_CONNECTION_URL + process.env.DB_NAME;

console.log("connecting to db-> " + dbConnectionUrl());

mongoose.connect(dbConnectionUrl(), {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then((conn) => {
        console.log("connected to db-> " + conn);
        global.mongoose = conn;
    }, err => {
        console.error("Error while connecting to database: " + dbConnectionUrl() + " err " + err);
        process.exit(-1);
    });