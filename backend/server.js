const http = require('http');
require('dotenv').config({path:'../.env'});

const app = require('./app');


const server = http.createServer(app);

server.listen(process.env.PORT || 3000);

