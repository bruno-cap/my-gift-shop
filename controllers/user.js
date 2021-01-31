/*********************USER ROUTES***************************/
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// module insertion
const userModel = require("../models/user");
const productModel = require("../models/product");
const isAuthenticated = require("../middleware/auth");
const dashboardLoader = require("../middleware/dash");

router.post("/authentication", (req, res) => {
  // validation process - login
  const loginIdErrorMessages = [];
  const loginPasswordErrorMessages = [];

  if (req.body.loginuserid == "") {
    loginIdErrorMessages.push("You must enter your first name");
  }

  if (req.body.loginpassword == "") {
    loginPasswordErrorMessages.push("You must enter a password");
  }

  // in case the information was not properly enterered
  if (
    loginIdErrorMessages.length > 0 ||
    loginPasswordErrorMessages.length > 0
  ) {
    const { loginuserid, loginpassword } = req.body;
    res.render("user/login", {
      title: "Login",
      headingInfo: "mygiftshop - login",
      errorsLoginId: loginIdErrorMessages,
      errorsLoginPassword: loginPasswordErrorMessages,
      loginInputId: loginuserid,
      loginInputPassword: loginpassword,
    });
  }

  // in case the fields were properly filled, proceed checking credentials
  else {
    const loginErrorMessages = [];

    // this checks if the username exists
    userModel
      .findOne({ email: req.body.loginuserid })
      .then((user) => {
        if (user == null) {
          loginErrorMessages.push("Invalid account - e-mail not found.");

          res.render("user/login", {
            title: "Login",
            headingInfo: "mygiftshop - login",
            errorsLogin: loginErrorMessages,
            loginInputId: req.body.loginuserid,
            loginInputPassword: req.body.password,
          });
        } else {
          bcrypt
            .compare(req.body.loginpassword, user.password)
            .then((isMatch) => {
              if (isMatch) {
                req.session.userInfo = user;
                req.session.cartProducts = [];
                req.session.cartQuantity = 0;

                res.redirect("profile");
              } else {
                loginErrorMessages.push("Invalid password - Please try again");

                res.render("user/login", {
                  title: "Login",
                  headingInfo: "mygiftshop - login",
                  errorsLogin: loginErrorMessages,
                  loginInputId: req.body.loginuserid,
                  loginInputPassword: req.body.password,
                });
              }
            });
        }
      })
      .catch((err) => console.log(`Error ${err}`));
  }
});

router.post("/registration", (req, res) => {
  // validation process - registration
  const signupFirstNameErrorMessages = [];
  const signupLastNameErrorMessages = [];
  const signupEmailErrorMessages = [];
  const signupPasswordErrorMessages = [];
  const signupPasswordConfirmationErrorMessages = [];

  // validate names
  const nameLengthRegex = /^.{2,}$/;
  const nameStartRegex = /^[a-zA-Z].*$/;

  // validate first name
  if (req.body.signupfirstname == "") {
    signupFirstNameErrorMessages.push("You must enter your first name");
  } else {
    if (!nameLengthRegex.test(req.body.signupfirstname)) {
      signupFirstNameErrorMessages.push(
        "Your first name must be at least 2 characters long"
      );
    }

    if (!nameStartRegex.test(req.body.signupfirstname)) {
      signupFirstNameErrorMessages.push(
        "Your first name must begin with a letter"
      );
    }
  }

  // validate last name
  if (req.body.signuplastname == "") {
    signupLastNameErrorMessages.push("You must enter your last name");
  } else {
    if (!nameLengthRegex.test(req.body.signuplastname)) {
      signupLastNameErrorMessages.push(
        "Your last name must be at least 2 characters long"
      );
    }

    if (!nameStartRegex.test(req.body.signuplastname)) {
      signupLastNameErrorMessages.push(
        "Your last name must begin with a letter"
      );
    }
  }

  // validate e-mail
  const emailLengthCheck = /^.{3,}$/;
  const emailCharacterCheck = /@/;

  if (req.body.signupemail == "") {
    signupEmailErrorMessages.push("You must enter your e-mail address");
  } else {
    if (!emailLengthCheck.test(req.body.signupemail)) {
      signupEmailErrorMessages.push(
        "Your e-mail must be at least 3 characters long"
      );
    }

    if (!emailCharacterCheck.test(req.body.signupemail)) {
      signupEmailErrorMessages.push("Your e-mail must contain @");
    }
  }

  // validate password
  const passwordComponentsRegex = /^[a-zA-Z0-9]+$/;
  const passwordLengthRegex = /^.{6,12}$/;

  if (req.body.signuppassword == "") {
    signupPasswordErrorMessages.push("You must enter a password");
  } else {
    if (!passwordLengthRegex.test(req.body.signuppassword)) {
      signupPasswordErrorMessages.push(
        "Your password must be 6-12 characters long"
      );
    }

    if (!passwordComponentsRegex.test(req.body.signuppassword)) {
      signupPasswordErrorMessages.push(
        "Your password must only contain alphanumeric digits"
      );
    }
  }

  // validate password re-entry
  if (req.body.signuppasswordconfirmation == "") {
    signupPasswordConfirmationErrorMessages.push(
      "You must re-enter the password"
    );
  } else {
    if (req.body.signuppassword != req.body.signuppasswordconfirmation) {
      signupPasswordConfirmationErrorMessages.push("Both passwords must match");
    }
  }

  // in case the information was not properly enterered
  if (
    signupFirstNameErrorMessages.length > 0 ||
    signupLastNameErrorMessages > 0 ||
    signupEmailErrorMessages.length > 0 ||
    signupPasswordErrorMessages.length > 0 ||
    signupPasswordConfirmationErrorMessages.length > 0
  ) {
    const {
      signupfirstname,
      signuplastname,
      signupemail,
      signuppassword,
      signuppasswordconfirmation,
    } = req.body;
    res.render("user/signup", {
      title: "Signup",
      headingInfo: "mygiftshop - signup",

      errorsSignupFirstName: signupFirstNameErrorMessages,
      errorsSignupLastName: signupLastNameErrorMessages,
      errorsSignupEmail: signupEmailErrorMessages,
      errorsSignupPassword: signupPasswordErrorMessages,
      errorsSignupPasswordConfirmation: signupPasswordConfirmationErrorMessages,

      signupInputFirstName: signupfirstname,
      signupInputLastName: signuplastname,
      signupInputEmail: signupemail,
      signupInputPassword: signuppassword,
      signupInputPasswordConfirmation: signuppasswordconfirmation,
    });
  } else {
    // in case the information was properly entered

    const signupErrorMessages = [];

    // checks if e-mail already exists
    // uses the entered e-mail to query the database and retrieve session info
    userModel.findOne({ email: req.body.signupemail }).then((user) => {
      if (user != null) {
        // account already exists
        signupErrorMessages.push(
          "Account already exists - Please use a different e-mail address."
        );

        const {
          signupfirstname,
          signuplastname,
          signupemail,
          signuppassword,
          signuppasswordconfirmation,
        } = req.body;

        res.render("user/signup", {
          title: "Signup",
          headingInfo: "mygiftshop - signup",

          errorsSignup: signupErrorMessages,

          signupInputFirstName: signupfirstname,
          signupInputLastName: signuplastname,
          signupInputEmail: signupemail,
          signupInputPassword: signuppassword,
          signupInputPasswordConfirmation: signuppasswordconfirmation,
        });
      } else {
        // account doesn't exist - proceed
        const {
          signupfirstname,
          signuplastname,
          signupemail,
          signuppassword,
        } = req.body;

        // saves the user in the database
        const newUser = {
          firstName: signupfirstname,
          lastName: signuplastname,
          email: signupemail,
          password: signuppassword,
        };

        const user = new userModel(newUser);
        user
          .save()
          .then(() => {
            // uses the entered e-mail to query the database and retrieve session info
            userModel
              .findOne({ email: req.body.signupemail })
              .then((user) => {
                req.session.userInfo = user;
                req.session.cartProducts = [];
                req.session.cartQuantity = 0;

                // sends a confirmation e-mail
                const sgMail = require("@sendgrid/mail");
                sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                const msg = {
                  to: `${signupemail}`,
                  from: "brunop.dev@gmail.com",
                  subject: "mygiftshop - Welcome!",
                  html: `${signupfirstname}, welcome to mygiftshop!`,
                };

                sgMail
                  .send(msg)
                  .then(() => {
                    res.redirect("profile");
                  })

                  // catches errors if sending message wasn't successful
                  .catch((err) => {
                    console.log(`Error ${err}`);
                  });
              })
              .catch((err) => console.log(`Error ${err}`));
          })
          // catches errors if user insertion wasn't successful
          .catch((err) =>
            console.log(`Error while inserting into the data ${err}`)
          );
      }
    });
  }
});

router.get("/login", (req, res) => {
  res.render("user/login", {
    title: "Login",
    headingInfo: "mygiftshop - login",
  });
});

router.get("/signup", (req, res) => {
  res.render("user/signup", {
    title: "Signup",
    headingInfo: "mygiftshop - signup",
  });
});

router.get("/profile", isAuthenticated, dashboardLoader);

router.get("/logout", isAuthenticated, (req, res) => {
  // destroys session
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/");
    } else {
      return console.log(err);
    }
  });
});

router.get("/shoppingCart", (req, res) => {
  // get bestseller products
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

      // checks if session is active
      if (!req.session.userInfo) {
        res.render("user/shoppingCart", {
          title: "Shopping Cart",
          headingInfo: "mygiftshop - shopping cart",
          bestsellersData: filteredProduct,
        });
      } else {
        // gets products added to cart

        const curatedCartList = [];
        const idList = [];
        const quantityList = [];
        let addToCuratedList = true;
        let numberOfOccurrences = 0;

        // adds products to cart
        for (let i = 0; i < req.session.cartProducts.length; i++) {
          // push to curated List if not present there
          for (let j = 0; j < curatedCartList.length && addToCuratedList; j++) {
            if (req.session.cartProducts[i] == curatedCartList[j].id) {
              addToCuratedList = false;
            }
          }

          // get occurrences if we're adding to the curated list
          if (addToCuratedList) {
            // go over remaining items in the cart - start at position i
            for (let k = i; k < req.session.cartProducts.length; k++) {
              if (req.session.cartProducts[i] == req.session.cartProducts[k]) {
                numberOfOccurrences++;
              }
            }

            // create temporary object holding the push product name + quantity
            const tempObject = {
              id: req.session.cartProducts[i],
              quantity: numberOfOccurrences,
            };

            // push temporary object to array
            curatedCartList.push(tempObject);
            idList.push(req.session.cartProducts[i]);
            quantityList.push(numberOfOccurrences);
          }

          addToCuratedList = true;
          numberOfOccurrences = 0;
        }

        // get info for products in shopping cart
        productModel
          .find()
          .where("_id")
          .in(idList)
          .then((products) => {
            const productsInCart = products.map((product) => {
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

            // add quantityInCart attribute to the objects
            for (let i = 0; i < productsInCart.length; i++) {
              productsInCart[i].quantityInCart = quantityList[i];
            }

            let orderSubtotal = 0.0;
            // add pricePerCartQuantity attribute to the objects
            for (let i = 0; i < productsInCart.length; i++) {
              productsInCart[i].pricePerCartQuantity = (
                productsInCart[i].quantityInCart * productsInCart[i].price
              ).toFixed(2);
              orderSubtotal +=
                productsInCart[i].quantityInCart * productsInCart[i].price;
            }

            orderSubtotal = (orderSubtotal * 1.0).toFixed(2);

            let shipping = (0 * 1.0).toFixed(2);
            let tax = 0.13;
            let taxAmount = parseFloat(orderSubtotal * tax).toFixed(2);
            let orderTotal = (
              parseFloat(orderSubtotal) +
              parseFloat(shipping) +
              parseFloat(taxAmount)
            ).toFixed(2);

            // update dropdown to reflect stock
            for (let i = 0; i < productsInCart.length; i++) {
              productsInCart[i].quantityToAdd = [];
              // number of items in stock
              for (let j = 0; j < productsInCart[i].quantity; j++) {
                productsInCart[i].quantityToAdd.push(j + 1);
              }
            }

            res.render("user/shoppingCart", {
              title: "Shopping Cart",
              headingInfo: "mygiftshop - shopping cart",
              bestsellersData: filteredProduct,
              shoppingCartData: productsInCart,
              orderSubtotal,
              shipping,
              taxAmount,
              orderTotal,
            });
          })
          .catch((err) =>
            console.log(`Error happened when pulling from the database: ${err}`)
          );
      }
    })
    .catch((err) =>
      console.log(`Error happened when pulling from the database: ${err}`)
    );
});

router.put("/shoppingCart/update/:id", isAuthenticated, (req, res) => {
  let countOccurrences = 0;
  let occurrencesToSplice = 0;
  let alreadySpliced = 0;
  let occurrencesToAdd = 0;

  // find current occurrences of id
  for (let i = 0; i < req.session.cartProducts.length; i++) {
    if (req.session.cartProducts[i] == req.params.id) {
      countOccurrences++;
    }
  }

  // check if new quantity is lower than current
  if (req.body.updateToSelectedQuantity < countOccurrences) {
    occurrencesToSplice = countOccurrences - req.body.updateToSelectedQuantity;

    for (let i = 0; i < req.session.cartProducts.length; i++) {
      if (
        req.session.cartProducts[i] == req.params.id &&
        alreadySpliced < occurrencesToSplice
      ) {
        req.session.cartProducts.splice(i, 1);
        alreadySpliced++;
        i--;
      }
    }

    // update totals
    req.session.cartQuantity -= occurrencesToSplice;
  } else {
    // if not, add occurrences to shopping cart
    occurrencesToAdd = req.body.updateToSelectedQuantity - countOccurrences;

    for (let i = 0; i < occurrencesToAdd; i++) {
      req.session.cartProducts.push(req.params.id);
    }

    // update totals
    req.session.cartQuantity += occurrencesToAdd;
  }

  res.redirect("/user/shoppingCart");
});

//router to delete product from shopping cart
router.get("/shoppingCart/delete/:id", isAuthenticated, (req, res) => {
  let numberOfRemovals = 0;

  for (let i = 0; i < req.session.cartProducts.length; i++) {
    if (req.session.cartProducts[i] == req.params.id) {
      req.session.cartProducts.splice(i, 1);
      numberOfRemovals++;
      i--; // do NOT advance loop if an item was removed -> a new item will hold that position
    }
  }

  // update cart totals
  req.session.cartQuantity -= numberOfRemovals;

  // redirect to shopping cart
  res.redirect("/user/shoppingCart");
});

router.get("/placeOrder", isAuthenticated, (req, res) => {
  const curatedCartList = [];
  const idList = [];
  const quantityList = [];
  let addToCuratedList = true;
  let numberOfOccurrences = 0;

  // adds products to cart
  for (let i = 0; i < req.session.cartProducts.length; i++) {
    // push to curated List if not present there
    for (let j = 0; j < curatedCartList.length && addToCuratedList; j++) {
      if (req.session.cartProducts[i] == curatedCartList[j].id) {
        addToCuratedList = false;
      }
    }

    // get occurrences if we're adding to the curated list
    if (addToCuratedList) {
      // go over remaining items in the cart - start at position i
      for (let k = i; k < req.session.cartProducts.length; k++) {
        if (req.session.cartProducts[i] == req.session.cartProducts[k]) {
          numberOfOccurrences++;
        }
      }

      // create temporary object holding the push product name + quantity
      const tempObject = {
        id: req.session.cartProducts[i],
        quantity: numberOfOccurrences,
      };

      // push temporary object to array
      curatedCartList.push(tempObject);
      idList.push(req.session.cartProducts[i]);
      quantityList.push(numberOfOccurrences);
    }

    addToCuratedList = true;
    numberOfOccurrences = 0;
  }

  // get info for products in shopping cart
  productModel
    .find()
    .where("_id")
    .in(idList)
    .then((products) => {
      const productsInCart = products.map((product) => {
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

      // add quantityInCart attribute to the objects
      for (let i = 0; i < productsInCart.length; i++) {
        productsInCart[i].quantityInCart = quantityList[i];
      }

      let orderSubtotal = 0.0;
      // add pricePerCartQuantity attribute to the objects
      for (let i = 0; i < productsInCart.length; i++) {
        productsInCart[i].pricePerCartQuantity = (
          productsInCart[i].quantityInCart * productsInCart[i].price
        ).toFixed(2);
        orderSubtotal +=
          productsInCart[i].quantityInCart * productsInCart[i].price;
      }

      orderSubtotal = (orderSubtotal * 1.0).toFixed(2);

      let shipping = (0 * 1.0).toFixed(2);
      let tax = 0.13;
      let taxAmount = parseFloat(orderSubtotal * tax).toFixed(2);
      let orderTotal = (
        parseFloat(orderSubtotal) +
        parseFloat(shipping) +
        parseFloat(taxAmount)
      ).toFixed(2);

      // clean shopping cart
      req.session.cartProducts = [];
      req.session.cartQuantity = 0;

      // create a variable to hold the order information to be added to the message HTML
      let orderDetailsToInsert = [];
      for (let i = 0; i < productsInCart.length; i++) {
        orderDetailsToInsert.push(`
        <tr>
          <th scope="row">${i + 1}</th>
          <td>${productsInCart[i].name.padEnd(20, " ")}</td>
          <td>$${productsInCart[i].price.toString().padEnd(5, " ")}</td>
          <td>${productsInCart[i].quantityInCart.toString().padEnd(4, " ")}</td>
          <td>$${parseFloat(
            productsInCart[i].price * productsInCart[i].quantityInCart
          ).toFixed(2)}</td>
          </tr>`);
      }

      // e-mail user indicating products, quantity for each, and order total

      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
      const msg = {
        to: `${req.session.userInfo.email}`,
        from: "brunop.dev@gmail.com",
        subject: "mygiftshop - Order Placed",
        html: `<p>${req.session.userInfo.firstName}, thank you for your order :)</p>
                <p>Here's your product summary:</p>
                <table>
                  <tr>
                    <th scope="col" align="left">#</th>
                    <th scope="col" align="left">Name</th>
                    <th scope="col" align="left">Price</th>
                    <th scope="col" align="left">Qtd</th>
                    <th scope="col" align="left">Total</th>
                  </tr>
                  <tbody>
                    ${orderDetailsToInsert}
                  </tbody>
                </table>
                <br>

                <table>
                  <tr>
                    <th align="left">Order Subtotal</th>
                    <td>$${orderSubtotal}</td>
                  </tr>
                  <tr>
                    <th align="left">Shipping and Handling</th>
                    <td>$${shipping}</td>
                  </tr>
                  <tr>
                    <th align="left">Tax - 13%</th>
                    <td>$${taxAmount}</td>
                  </tr>
                  <tr>
                    <th align="left">Total</th>
                    <td>$${orderTotal}</td>
                  </tr>
                </table>

                <p>Best regards,</p>
                <p>mygiftshop</p>`,
      };

      sgMail
        .send(msg)
        .then(() => {
          res.redirect("orderPlaced");
        })
        // catches errors if sending message wasn't successful
        .catch((err) => {
          console.log(`Error ${err}`);
        });
    });
});

router.get("/orderPlaced", isAuthenticated, (req, res) => {
  res.render("user/orderPlaced", {
    title: "Order Placed",
    headingInfo: "mygiftshop - order placed",
  });
});

module.exports = router;
