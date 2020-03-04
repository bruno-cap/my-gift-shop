var express = require('express');
var router = express.Router();

// module insertion
const productModel = require("../model/productscript");

router.get("/",(req,res)=>{
    res.render("home",{
            title: "Home Page",
            headingInfo: "mygiftshop - home",
            categories: productModel.getCategories(),
            bestSellers: productModel.getBestSellers(),
    });

});

router.post("/",(req,res)=>{
    // validation process - login
    const loginIdErrorMessages = [];
    const loginPasswordErrorMessages = [];

    if(req.body.loginuserid=="")
    {
            loginIdErrorMessages.push("You must enter your first name");
    }

    if(req.body.loginpassword=="")
    {
            loginPasswordErrorMessages.push("You must enter a password");
    }

    // in case the information was not properly enterered
    if(loginIdErrorMessages.length > 0 || loginPasswordErrorMessages.length > 0) {

            const {loginuserid,loginpassword} =req.body;
            res.render("home",{
                    title: "Home Page",
                    headingInfo: "mygiftshop - home",

                    categories: productModel.getCategories(),
                    bestSellers: productModel.getBestSellers(),

                    errorsLoginId: loginIdErrorMessages,
                    errorsLoginPassword: loginPasswordErrorMessages,

                    loginInputId: loginuserid,
                    loginInputPassword: loginpassword
            });
    } 
    
    // in case the information was properly entered
    else {
        res.render("home",{
            title: "Home Page",
            headingInfo: "mygiftshop - home",
            categories: productModel.getCategories(),
            bestSellers: productModel.getBestSellers(),
    });
    }        
});


router.get("/dashboard",(req,res)=>{

    res.render("dashboard",{
            title: "dashboard",
            headingInfo: "mygiftshop - dashboard"
    });

});


router.post("/dashboard",(req,res)=>{
    // validation process - registration
    const signupNameErrorMessages = [];
    const signupEmailErrorMessages = [];
    const signupPasswordErrorMessages = [];
    const signupPasswordConfirmationErrorMessages = [];

    // validate name
    const nameLengthRegex = /^.{2,}$/;
    const nameStartRegex = /^[a-zA-Z].*$/;

    if(req.body.signupusername=="")
    {
            signupNameErrorMessages.push("You must enter your name");
    } else {
            if(!nameLengthRegex.test(req.body.signupusername))
            {
                    signupNameErrorMessages.push("Your name must be at least 2 characters long");
            }
            
            if(!nameStartRegex.test(req.body.signupusername))
            {
                    signupNameErrorMessages.push("Your name must begin with a letter");
            }
    }

    // validate e-mail
    const emailLengthCheck = /^.{3,}$/;
    const emailCharacterCheck = /@/;

    if(req.body.signupemail=="")
    {
            signupEmailErrorMessages.push("You must enter your e-mail address");
    } else {
            if(!emailLengthCheck.test(req.body.signupemail)) {
                    signupEmailErrorMessages.push("Your e-mail must be at least 3 characters long");
            }

            if(!emailCharacterCheck.test(req.body.signupemail)) {
                    signupEmailErrorMessages.push("Your e-mail must contain @");
            }

    }

    // validate password
    const passwordComponentsRegex = /^[a-zA-Z0-9]+$/;
    const passwordLengthRegex = /^.{6,12}$/;

    if(req.body.signuppassword=="")
    {
            signupPasswordErrorMessages.push("You must enter a password");
    } else {
            if(!passwordLengthRegex.test(req.body.signuppassword))
            {
                    signupPasswordErrorMessages.push("Your password must be 6-12 characters long");
                    
            }
    
            if(!passwordComponentsRegex.test(req.body.signuppassword))
            {
                    signupPasswordErrorMessages.push("Your password must only contain alphanumeric digits");
            }
    }


    // validate password re-entry
    if(req.body.signuppasswordconfirmation=="")
    {
            signupPasswordConfirmationErrorMessages.push("You must re-enter the password");
    } else {
            if (req.body.signuppassword != req.body.signuppasswordconfirmation) {
                    signupPasswordConfirmationErrorMessages.push("Both passwords must match");
            }
    }

    // in case the information was not properly enterered
    if(signupNameErrorMessages.length > 0 || signupEmailErrorMessages.length > 0 || signupPasswordErrorMessages.length > 0 || signupPasswordConfirmationErrorMessages.length > 0) {

            const {signupusername, signupemail, signuppassword, signuppasswordconfirmation} =req.body;
            res.render("home",{
                    title: "Home Page",
                    headingInfo: "mygiftshop - home",

                    categories: productModel.getCategories(),
                    bestSellers: productModel.getBestSellers(),
                    
                    errorsSignupName: signupNameErrorMessages,
                    errorsSignupEmail: signupEmailErrorMessages,
                    errorsSignupPassword: signupPasswordErrorMessages,
                    errorsSignupPasswordConfirmation: signupPasswordConfirmationErrorMessages,

                    signupInputName: signupusername,
                    signupInputEmail: signupemail,
                    signupInputPassword: signuppassword,
                    signupInputPasswordConfirmation: signuppasswordconfirmation
            });

    } 
    
    // in case the information was properly entered
    else {

        const {signupusername, signupemail, signuppassword, signuppasswordconfirmation} = req.body;

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
          to: 'bpinto3@myseneca.ca',
          from: `${signupemail}`,
          subject: 'Registration Form Submission',
          html: `${signupusername}, welcome to mygiftshop!`,
        };

        // Asynchronous operation
        sgMail.send(msg)
        .then(()=>{
            
            res.render("dashboard", {
                title: "dashboard",
                headingInfo: "mygiftshop - dashboard",
                userId: signupusername,
                userEmail: signupemail,
            })
        })
        .catch(err=>{
            console.log(`Error ${err}`);
        });
    }        
});    

module.exports = router;