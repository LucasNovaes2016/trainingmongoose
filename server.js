const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const games = require("./routes/api/games");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config

const db = require("./config/keys").mongoURI;

// Conenct to MongoDB

mongoose
  .connect(db)
  .then(() => console.log("MongoDB connect"))
  .catch(err => console.log(err));

app.use("/api/games", games);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
