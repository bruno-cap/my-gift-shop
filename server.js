const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");

// load the environment variable file
require("dotenv").config({ path: "./config/keys.env" });

const app = express();

// initiate session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Set Handlebars as the Express engine for the app
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      if_eq: function (param1, param2, options) {
        return param1 == param2 ? options.fn(this) : options.inverse(this);
      },

      if_lower: function (param1, param2, options) {
        return param1 < param2 ? options.fn(this) : options.inverse(this);
      },
    },
  })
);

// Manipulate forms/links so they can also send PUT and DELETE requests
app.use((req, res, next) => {
  if (req.query.method == "PUT") {
    req.method = "PUT";
  } else if (req.query.method == "DELETE") {
    req.method = "DELETE";
  }

  next();
});

app.set("view engine", "handlebars");

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// load controllers
const generalController = require("./controllers/general");
const productController = require("./controllers/product");
const userController = require("./controllers/user");

// custom middleware functions
app.use((req, res, next) => {
  res.locals.user = req.session.userInfo;
  res.locals.cart = req.session.cartQuantity;
  next();
});

// add fileUpload
app.use(fileUpload());

// map each controller to the app object
app.use("/", generalController);
app.use("/product", productController);
app.use("/user", userController);
app.use("/", (req, res) => {
  res.render("general/404");
});

// connect to Mongoose
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to MongoDB Database`);
  })
  .catch((err) => console.log(`Error occurred connecting to database ${err}`));

// sets up server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`The application is up and running!`);
});
