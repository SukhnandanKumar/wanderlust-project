const User=require("../models/user.js")

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup=async(req,res)=>{
    try{
        let {password, username,email}=req.body;
        const newUser=new User({email,username})
        const registerdUser=await User.register(newUser,password)
        console.log(registerdUser)
        req.logIn(registerdUser,(err)=>{
            if(err){
               return next(err)
            }
            req.flash("success", "welcome to wanderlust!")
            res.redirect("/listing")
        })
    }catch(error){
        req.flash("error", error.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.logIn=async(req,res)=>{
    req.flash("success", "Welcome Back Your Account!")
    // console.dir(req.locals.redirectUr)
    // console.log("post login",res.locals.redirectUrl)
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl)

}

module.exports.logOut=(req, res, next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success", "You logout!")
        res.redirect("/listing")
    })
}