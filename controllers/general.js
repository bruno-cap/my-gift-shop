var express = require("express");
var router = express.Router();

// module insertion
const productModel = require("../models/product");
const subscriberModel = require("../models/subscriber");

router.get("/", (req, res) => {
  productModel
    .find({ isBestseller: true })
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
      res.render("general/home", {
        headingInfo: "mygiftshop - home",
        productData: filteredProduct,
        headerReference: "home",
      });
    })
    .catch((err) =>
      console.log(`Error happened when pulling from the database: ${err}`)
    );
});

router.get("/careers", (req, res) => {
  res.render("general/careers", {
    headingInfo: "mygiftshop - careers",
    title: "Careers",
    headerReference: "careers",
  });
});

router.get("/about", (req, res) => {
  res.render("general/about", {
    headingInfo: "mygiftshop - about",
    title: "About",
    headerReference: "about",
  });
});

router.post("/mailinglist", (req, res) => {
  const emailToSubscribe = req.body.emailToSubscribe;

  let statusMessage = "";

  subscriberModel
    .findOne({ email: emailToSubscribe })
    .then((user) => {
      if (user == null) {
        // e-mail address not found -> add to database
        const newSubscriber = {
          email: emailToSubscribe,
        };
        const subscriber = new subscriberModel(newSubscriber);
        subscriber
          .save()
          .then(() => {
            res.render("general/mailinglist", {
              headingInfo: "mygiftshop - mailing list",
              title: "Mailist List",
              subscriptionStatus: `${emailToSubscribe} was added successfully - thank you!`,
            });
          })
          .catch((err) =>
            console.log(`Error while inserting the new subscriber: ${err}`)
          );
      } else {
        // e-mail address is already subscribed -> no action
        res.render("general/mailinglist", {
          headingInfo: "mygiftshop - mailing list",
          title: "Mailist List",
          subscriptionStatus: `${emailToSubscribe} is already subscribed - thank you!`,
        });
      }
    })
    .catch((err) => console.log(`Error while inserting into the data: ${err}`));
});

module.exports = router;
