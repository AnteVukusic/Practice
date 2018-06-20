const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const ideas = require("./routes/api/ideas");

const app = express();

//  Allow control alllow origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

//  Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  DB config
const db = require("./config/keys").mongoURI;

//  Map global promise - get rid of warrnings
mongoose.Promise = global.Promise;

//  Connect to Mongoose
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

//  Passport middleware

app.use(passport.initialize());

//  Passport Config
require("./config/passport")(passport);

//  Use Routes
app.use("/api/users", users);
app.use("/api/ideas", ideas);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
