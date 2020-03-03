const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');

// insert models here
const productModel = require("./model/productscript");

const app = express();

//Set Handlebars as the Express enginge for the app
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"));


app.get("/",(req,res)=>{

        res.render("home",{
                title: "Home Page",
                headingInfo: "mygiftshop - home",
                categories: productModel.getCategories(),
                bestSellers: productModel.getBestSellers(),
        });
        
});

app.get("/products",(req,res)=>{

        res.render("products",{
                title: "products",
                headingInfo: "mygiftshop - products",
                categories: productModel.getCategories(),
                allProducts: productModel.getAllProducts(),
        });

});


const PORT = 3000;
app.listen(PORT , ()=>
{
        console.log(`Web application is up and running!!!`);
});