const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./app');

const options = {
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/private.crt')
  };

/**Creating server */
var server = http.createServer(app);

/**Creating https server */
// var server = https.createServer(options, app);

/**start server */ 
server.listen(process.env.PORT,()=>console.log(`Running at ${process.env.PORT}`));