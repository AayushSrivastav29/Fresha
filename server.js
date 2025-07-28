const express = require("express");
const db = require("./utils/db-connection");
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//import models
require('./models');


//import routes
const userRoute = require('./routes/userRoute');
const serviceRoute = require('./routes/serviceRoute');
const PORT = process.env.PORT;


app.use('/api/user', userRoute);
app.use('/api/service', serviceRoute);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view", "home.html"));
});

db.sync() 
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
