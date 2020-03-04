
var express = require('express');
var router = express.Router();

// module insertion
const productModel = require("../model/productscript");

router.get("/products",(req,res)=>{

    res.render("products",{
            title: "products",
            headingInfo: "mygiftshop - products",
            categories: productModel.getCategories(),
            allProducts: productModel.getAllProducts(),
    });

});

module.exports = router;