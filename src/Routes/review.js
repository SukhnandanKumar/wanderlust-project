const express=require('express')
const router=express.Router({mergeParams: true});
const Review = require('../models/review.js')
const Listing = require('../models/listing.js')
const wrapAsync=require('../utils/wrapAsync.js');
const { validateReview, isLoggedIn, isReviewAuther } = require('../middleware.js');

const reviewController= require('../controllers/reviews.js');

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuther, wrapAsync(reviewController.destroyReview ))

module.exports=router;