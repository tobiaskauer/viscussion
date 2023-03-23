const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const multer = require("multer");
var vhost = require('vhost')
dotenv.config()



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



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

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

  //https://www.bezkoder.com/node-js-express-sequelize-mysql/



  const fs = require('fs');
