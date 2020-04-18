var express = require('express');
var router = express.Router();

// module insertion
const productModel = require("../models/product");

router.get("/",(req,res)=>{

    productModel.find({isBestseller:true})
    .then((products)=>{ 

        const filteredProduct = products.map(product=>{
            return {
                _id: product._id,
                name: product.name,
                price: parseFloat(product.price).toFixed(2),
                description: product.description,
                category: product.category,
                quantity: product.quantity,
                isBestseller: product.isBestseller,
                picture: product.picture,
            }
        });
            res.render("general/home", {
                headingInfo: "mygiftshop - home",
                productData: filteredProduct
            });
    })
    .catch(err=>console.log(`Error happened when pulling from the database: ${err}`));
});


module.exports = router;