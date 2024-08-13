const express=require('express')
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js')

const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
// const upload = multer({ dest: 'uploads/' })
const upload = multer({storage })
 
const Listing = require('../models/listing.js')
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");


const listingController= require('../controllers/listings.js');



//index route 
router.get("/listing", wrapAsync(listingController.index ))


//new route 
router.get("/listing/new",isLoggedIn,listingController.renderNewForm )

//show route
router.get("/listings/:id", wrapAsync(listingController.showListing ))

 
//create route 
router.post("/listings",
    isLoggedIn
    , 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing))


    // .post("/listings",upload.single("listing[image]"),(req,res)=>{
    //     // res.send(req.body)
    //     res.send(req.file)
    // })


//edit route
router.get("/listings/:id/Edit",isLoggedIn,isOwner,  wrapAsync(listingController.renderEditForm))


//update route 
router.put("/listing/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))

//delete listing route
router.delete("/listings/:id",isLoggedIn,isOwner,   wrapAsync(listingController.destroyListing))


module.exports=router;