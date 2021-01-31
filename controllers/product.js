/*********************USER ROUTES***************************/
const express = require("express");
const router = express.Router();
const path = require("path");
const moment = require("moment"); // to manipulate date format
const productModel = require("../models/product");

// middlewares
const isAuthenticated = require("../middleware/auth");
const isClerk = require("../middleware/clerk");

router.get("/all", (req, res) => {
  productModel
    .find()
    .then((products) => {
      const filteredProduct = products.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          price: parseFloat(product.price).toFixed(2),
          description: product.description,
          category: product.category,
          quantity: product.quantity,
          isBestseller: product.isBestseller,
          picture: product.picture,
        };
      });

      res.render("product/productList", {
        headingInfo: "mygiftshop - products",
        title: "All Products",
        productData: filteredProduct,
        headerReference: "products",
      });
    })
    .catch((err) =>
      console.log(`Error happened when pulling from the database: ${err}`)
    );
});

router.get("/add", (req, res) => {
  res.render("product/productAdd", {
    headingInfo: "mygiftshop - add products",
    title: "Add Products",
    headerReference: "products",
  });
});

router.post("/addToCart/:id", (req, res) => {
  const addToCartErrorMessages = [];
  let numberFound = 0;

  if (!res.locals.user) {
    // if session is not active
    addToCartErrorMessages.push(`Please login / signup first.`);

    productModel
      .findById(req.params.id)
      .then((product) => {
        const {
          _id,
          name,
          price,
          description,
          category,
          quantity,
          isBestseller,
          picture,
          dateCreated,
        } = product;

        // update dropdown to reflect stock - products already added
        const quantityToAdd = [];
        for (let i = 0; i < quantity - numberFound; i++) {
          quantityToAdd.push(i + 1);
        }

        res.render("product/productDetails", {
          headingInfo: `mygiftshop - ${name}`,
          title: name,
          _id,
          name,
          price: parseFloat(price).toFixed(2),
          description,
          category,
          quantity,
          isBestseller,
          picture,
          dateCreated,
          errors: addToCartErrorMessages,
          quantityToAdd,
        });
      })

      .catch((err) =>
        console.log(`Error happened when pulling from the database: ${err}`)
      );
  } else {
    // if session is active
    // adds products to cart
    for (let i = 0; i < req.body.selectedQuantityToAdd; i++) {
      req.session.cartProducts.push(req.params.id);
    }

    // updates quantity in cart
    req.session.cartQuantity += parseInt(req.body.selectedQuantityToAdd);

    res.redirect("/product/" + req.params.id);
  }
});

// product categories
router.get("/category/:category", (req, res) => {
  productModel
    .find({ category: req.params.category })
    .then((products) => {
      const filteredProduct = products.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          price: parseFloat(product.price).toFixed(2),
          description: product.description,
          category: product.category,
          quantity: product.quantity,
          isBestseller: product.isBestseller,
          picture: product.picture,
        };
      });

      res.render("product/productList", {
        headingInfo: `mygiftshop - ${req.params.category}`,
        title: req.params.category,
        productData: filteredProduct,
        headerReference: "products",
      });
    })
    .catch((err) =>
      console.log(`Error happened when pulling from the database: ${err}`)
    );
});

// product items
router.get("/:id", (req, res) => {
  productModel
    .findById(req.params.id)
    .then((product) => {
      let productInShoppingCartMessage = [];

      // checks and counts occurences of current item in the shopping cart
      let numberFound = 0;

      for (let i = 0; i < req.session.cartQuantity; i++) {
        if (req.session.cartProducts[i] == req.params.id) {
          numberFound++;
        }
      }

      if (numberFound == 1) {
        productInShoppingCartMessage.push(
          `${numberFound} unit is currently in your shopping cart.`
        );
      } else if (numberFound > 1) {
        productInShoppingCartMessage.push(
          `${numberFound} units are currently in your shopping cart.`
        );
      }

      const {
        _id,
        name,
        price,
        description,
        category,
        quantity,
        isBestseller,
        picture,
        dateCreated,
      } = product;

      // update dropdown to reflect stock - products already added
      const quantityToAdd = [];
      for (let i = 0; i < quantity - numberFound; i++) {
        quantityToAdd.push(i + 1);
      }

      res.render("product/productDetails", {
        headingInfo: `mygiftshop - ${name}`,
        title: name,
        _id,
        name,
        price: parseFloat(price).toFixed(2),
        description,
        category,
        quantity,
        isBestseller,
        picture,
        dateCreated,
        quantityToAdd,
        productInShoppingCart: productInShoppingCartMessage,
        headerReference: "products",
      });
    })

    .catch((err) =>
      console.log(`Error happened when pulling from the database: ${err}`)
    );
});

// router.get("/search", (req, res) => {
//   res.redirect("/");
// });

router.get("/search/:keyword", (req, res) => {
  productModel
    .find()
    .then((products) => {
      const filteredProduct = products
        .filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(req.params.keyword.toLowerCase()) ||
            product.category
              .toLowerCase()
              .includes(req.params.keyword.toLowerCase())
        )
        .map((product) => {
          return {
            _id: product._id,
            name: product.name,
            price: parseFloat(product.price).toFixed(2),
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            isBestseller: product.isBestseller,
            picture: product.picture,
          };
        });

      res.render("product/productSearch", {
        headingInfo: `mygiftshop - search`,
        title: `Search results for: ${req.params.keyword}`,
        productData: filteredProduct,
        headerReference: "products",
      });
    })
    .catch((err) =>
      console.log(`Error happened when pulling from the database: ${err}`)
    );
});

router.post("/search", (req, res) => {
  const { searchKeyword } = req.body;
  res.redirect(`/product/search/${searchKeyword}`);
});

router.post("/category/search", (req, res) => {
  const { categorySearch } = req.body;

  if (categorySearch == "All") {
    res.redirect("/product/all");
  } else {
    productModel
      .find({ category: categorySearch })
      .then((products) => {
        const filteredProduct = products.map((product) => {
          return {
            _id: product._id,
            name: product.name,
            price: parseFloat(product.price).toFixed(2),
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            isBestseller: product.isBestseller,
            picture: product.picture,
          };
        });

        res.render("product/productList", {
          headingInfo: `mygiftshop - ${categorySearch}`,
          title: categorySearch,
          productData: filteredProduct,
          headerReference: "products",
        });
      })
      .catch((err) =>
        console.log(`Error happened when pulling from the database: ${err}`)
      );
  }
});

// ---------------- Clerk options ------------------ //

router.get("/add/list", isAuthenticated, isClerk, (req, res) => {
  productModel.find().then((products) => {
    const filteredProduct = products.map((product) => {
      return {
        _id: product._id,
        name: product.name,
        price: parseFloat(product.price).toFixed(2),
        description: product.description,
        category: product.category,
        quantity: product.quantity,
        isBestseller: product.isBestseller,
        picture: product.picture,
        dateCreated: moment(product.dateCreated).format(
          "MMMM Do YYYY, h:mm:ss a"
        ),
      };
    });

    res.render("product/productAddedList", {
      headingInfo: `mygiftshop - added products`,
      title: "Added Products",
      data: filteredProduct,
      headerReference: "products",
    });
  });
});

router.post("/add", isAuthenticated, isClerk, (req, res) => {
  const {
    productName,
    productPrice,
    productDescription,
    productCategory,
    productQuantity,
    productBestseller,
  } = req.body;

  // the html form only sends isBestseller = true OR null.
  // we create an indermediate variable called bestsellerToPass and assign false if true wasn't captured in POST
  let bestsellerToPass = false;
  if (req.body.productBestseller) {
    bestsellerToPass = true;
  }

  // if it's null it means a new picture wasn't selected so we don't need to update that particular attribute
  if (req.files != null) {
    // check if attached file is an image and reject it if it's not
    if (
      req.files.productPic.mimetype != "image/jpeg" &&
      req.files.productPic.mimetype != "image/png" &&
      req.files.productPic.mimetype != "image/gif" &&
      req.files.productPic.mimetype != "image/bmp"
    ) {
      res.render("product/productAdd", {
        headingInfo: `mygiftshop - add products`,
        title: "Add Products",
        fileSubmissionError:
          "Image files - only .jpg, .jpeg, .png, .gif, and .bmp are allowed.",
        name: productName,
        price: productPrice,
        description: productDescription,
        category: productCategory,
        quantity: productQuantity,
        isBestseller: bestsellerToPass,
      });
    } else {
      // attached file is an image, proceed adding to database

      let bestsellerToProductModel;
      if (productBestseller == null) {
        bestsellerToProductModel = false;
      } else {
        bestsellerToProductModel = productBestseller; // which is going to be true as productBestseller is either true or null
      }

      const newProduct = {
        name: productName,
        price: productPrice,
        description: productDescription,
        category: productCategory,
        quantity: productQuantity,
        isBestseller: bestsellerToProductModel,
        createdBy: res.locals.user._id,
      };

      const product = new productModel(newProduct);
      product
        .save()
        .then((product) => {
          req.files.productPic.name = `admin_prod_pic_${product._id}${
            path.parse(req.files.productPic.name).ext
          }`;
          req.files.productPic
            .mv(`public/img/uploads/${req.files.productPic.name}`)

            .then(() => {
              productModel
                .updateOne(
                  { _id: product._id },
                  {
                    picture: req.files.productPic.name,
                  }
                )
                .then(() => {
                  res.render("user/clerkDashboard", {
                    headingInfo: "mygiftshop - clerk dashboard",
                    title: "Dashboard",
                  });
                })
                .catch((err) => console.log(`Error ${err}`));
            })
            .catch((err) => console.log(`Error ${err}`));
        })
        .catch((err) => console.log(`Error ${err}`));
    }
  }
});

router.get("/edit/:id", isAuthenticated, isClerk, (req, res) => {
  // attached file is an image, proceed adding to database
  productModel
    .findById(req.params.id)
    .then((product) => {
      const {
        _id,
        name,
        price,
        description,
        category,
        quantity,
        isBestseller,
        picture,
        dateCreated,
      } = product;

      res.render("product/productUpdate", {
        headingInfo: "mygiftshop - edit products",
        title: "Edit Products",
        _id,
        name,
        price,
        description,
        category,
        quantity,
        isBestseller,
        picture,
        dateCreated,
        headerReference: "products",
      });
    })

    .catch((err) =>
      console.log(`Error happened when pulling from the database: ${err}`)
    );
});

router.put("/edit/:id", (req, res) => {
  // the html form only sends isBestseller = true OR null.
  // we create an indermediate variable called bestsellerToPass and assign false if true wasn't captured in POST
  let bestsellerToPass = false;
  if (req.body.productBestseller) {
    bestsellerToPass = true;
  }

  const product = {
    name: req.body.productName,
    price: req.body.productPrice,
    description: req.body.productDescription,
    category: req.body.productCategory,
    quantity: req.body.productQuantity,
    isBestseller: bestsellerToPass,
  };

  if (
    req.files != null &&
    req.files.productPic.mimetype != "image/jpeg" &&
    req.files.productPic.mimetype != "image/png" &&
    req.files.productPic.mimetype != "image/gif" &&
    req.files.productPic.mimetype != "image/bmp"
  ) {
    res.redirect(`/product/edit/${req.params.id}`);
  } else {
    if (
      req.files != null &&
      (req.files.productPic.mimetype == "image/jpeg" ||
        req.files.productPic.mimetype == "image/png" ||
        req.files.productPic.mimetype == "image/gif" ||
        req.files.productPic.mimetype == "image/bmp")
    ) {
      req.files.productPic.name = `admin_prod_pic_${req.params.id}${
        path.parse(req.files.productPic.name).ext
      }`;
      req.files.productPic
        .mv(`public/img/uploads/${req.files.productPic.name}`)

        .then(() => {
          productModel.updateOne(
            { _id: product._id },
            {
              picture: req.files.productPic.name,
            }
          );
        })
        .catch((err) =>
          console.log(`Error uploading the picture to the database: ${err}`)
        );
    }

    // update the rest of the information
    productModel
      .updateOne({ _id: req.params.id }, product)
      .then(() => {
        res.redirect("/product/add/list");
      })
      .catch((err) =>
        console.log(
          `Error happened when updating data from the database: ${err}`
        )
      );
  }
});

router.get("/delete/:id", isAuthenticated, isClerk, (req, res) => {
  productModel
    .deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/product/add/list");
    })
    .catch((err) =>
      console.log(`Error happened when deleting record in the database: ${err}`)
    );
});

module.exports = router;
