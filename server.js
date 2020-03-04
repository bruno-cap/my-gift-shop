const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');

// load the environment variable file
require('dotenv').config({path:"./config/keys.env"});

const app = express();

//Set Handlebars as the Express enginge for the app
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"));

// load controllers
const generalController = require("./controllers/general");
const productController = require("./controllers/product");

// map each controller to the app object
app.use("/", generalController);
app.use("/", productController); // this will be updated to /products as we include product ramifications

// sets up server
const PORT = process.env.PORT;
app.listen(PORT , ()=>
{
        console.log(`The application is up and running!`);
});