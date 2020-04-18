const isClerk = (req,res,next)=>{

    if(req.session.userInfo.isClerk) {
        next();
    } else {
        res.redirect("/user/login")
    }

}

module.exports = isClerk;