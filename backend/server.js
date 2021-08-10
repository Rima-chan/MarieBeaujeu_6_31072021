const http = require('http');
require('dotenv').config();

const app = require('./app');


const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("listening on port " + port);
});

