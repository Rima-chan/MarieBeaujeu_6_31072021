
const express = require('express');

require('dotenv').config({path:'../.env'});
const mongoose = require('mongoose');


const app = express();

mongoose.connect(process.env.DB_MONGO_URL, 
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true})
    .then(() => console.log('Successful Mongoose connexion !'))
    .catch((error) => console.log('Connexion to Mongoose failed : ' + error));

// Middleware to handle CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use((req,res) => {
    res.status(200).json({ message : 'premier test OK'});
});

module.exports = app;