const express = require("express");
const db = require("./utils/db-connection");
const cors = require('cors');
const path = require('path');
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//import models
require('./models');


//import routes
const userRoute = require('./routes/userRoute');
const serviceRoute = require('./routes/serviceRoute');
const staffRoute= require('./routes/staffRoute')
const appointmentRoute= require('./routes/appointmentRoute')
const paymentRoute= require('./routes/paymentRoute')

const PORT = process.env.PORT;


app.use('/api/user', userRoute);
app.use('/api/service', serviceRoute);
app.use('/api/staff', staffRoute);
app.use('/api/appointment', appointmentRoute);
app.use('/api/payment', paymentRoute);


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
