const Listing=require("../models/listing.js")
const Review=require("../models/review.js")

module.exports.createReview=async(req,res)=>{
    // console.log("Hellwo")
    let listing=await Listing.findById(req.params.id)
    // console.log(listing.id)
    let newReview= new Review(req.body.review) 
    newReview.auther=req.user._id
    console.log("review",newReview)
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success", "new review added!")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview=async(req, res)=>{
    console.log("bye erevdk")
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Revie Deleted!")
    res.redirect(`/listings/${id}`)
}