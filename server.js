const express = require("express");
const db = require("./utils/db-connection");
const app = express();

const PORT = process.env.PORT;

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
