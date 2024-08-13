const Listing=require("./models/listing.js")
const Review = require("./models/review.js")
const {listingSchema,reviewSchema}=require("./schema.js")
const ExpressError=require('./utils/ExpressError.js')

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.user)
    // console.log(req.path, "...", req.originalUrl)
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error", "You are not logged!")
        return res.redirect("/login")
    }
    next()
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
        // console.log("middleware",res.locals.redirectUrl)
    }
    next()
}

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    // console.log(error)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next()
    }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next()
    }
};

module.exports.isReviewAuther=async(req,res,next)=>{
    console.log("a")
    let {id, reviewId}=req.params
    console.log("b")
    let review=await Review.findById(reviewId)
    console.log("c")
    if(!review.auther.equals(res.locals.currUser._id)){
        console.log("d")
        req.flash("error", "You are not the auther of this  review!")
        console.log("e")
        return res.redirect(`/listings/${id}`)
    }
    next()
}