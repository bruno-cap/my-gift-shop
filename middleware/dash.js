const dashboardLoader = (req,res) =>{

    if(req.session.userInfo.isClerk) {

        res.render("user/clerkDashboard", {
            title: "Clerk Dashboard",
            headingInfo: "mygiftshop - clerk dashboard"
        })

    } else {
        res.render("user/userDashboard", {
            title: "Dashboard",
            headingInfo: "mygiftshop - dashboard"
        })      
    }

}

module.exports = dashboardLoader;