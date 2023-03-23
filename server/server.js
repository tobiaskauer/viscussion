const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const multer = require("multer");
const http = require('http');
const https = require('https');
const fs = require('fs');
dotenv.config()

const credentials = {} 
const ENVIRONMENT = process.env.ENVIRONMENT || 'local';
if(ENVIRONMENT == "STAGING" || ENVIRONMENT == "PRODUCTION") {
  const CREDDIR = process.env.ENVIRONMENT
  
  const privateKey = fs.readFileSync(CREDDIR+'privkey.pem', 'utf8');
  const certificate = fs.readFileSync(CREDDIR+'cert.pem', 'utf8');
  const ca = fs.readFileSync(CREDDIR+'chain.pem', 'utf8');

	credentials.key = privateKey,
	credentials.cert = certificate,
	credentials.ca = ca
}

if(credentials.cert) {
  console.log('has credentials')
}



const app = express();

const CORS = process.env.CORS || 'http://localhost';
var corsOptions = {
  origin: CORS
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(multer({dest:'./static'}).single('image'))

require("./routes/trace.routes")(app);
require("./routes/image.routes")(app);

app.use('/static', express.static('static'))

const PORT = process.env.PORT || 8080;
var httpServer = http.createServer(app);
httpServer.listen(PORT);
console.log(`HTTPS is running on port ${PORT}.`);

if(credentials.cert) {
  const HTTPSPORT = process.env.HTTPSPORT || 8443;
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(HTTPSPORT);
  console.log(`HTTPS is running on port ${HTTPSPORT}.`);

}


const db = require("./models");


db.sequelize.sync(
  //{force:true} //dont use force in prod
)

  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });