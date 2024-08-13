const Listing=require("../models/listing.js")

module.exports.index=async(req,res)=>{
    // let re=req.params;
    // console.log(re)
    // if(!req.body.listing){
    //     throw new ExpressError(400,"some errors")
    // }
    const alllisting= await Listing.find({});
    // console.log("All Listings:", alllisting);
    res.render("listings/index.ejs", {alllisting});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({
        path: "reviews", populate: {path : "auther"}
    }).populate("owner");
    if(!listing){
        req.flash("error", "Your request listing does not exist!")
        res.redirect("/listing")
    }
    // console.log("show listing",{listing})
    res.render("listings/show.ejs", {listing})
}

module.exports.createListing=async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(404,"send valid data for listing!")
    // }

    let url=req.file.path;
    let filename=req.file.path;
    // console.log(url,"...", filename)
    const newlisting= new Listing(req.body.listing)
    // console.log(newlisting)
    newlisting.owner=req.user._id
    newlisting.image={url,filename}
    await newlisting.save();
    req.flash("success", "new listing added!")  
    res.redirect("/listing");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id)
    if(!listing){
        req.flash("error", "Requested listing does not exist to edit!")
        res.redirect("/listing")
    }

    let OriginalImageUrl=listing.image.url;
    OriginalImageUrl=OriginalImageUrl.replace("/upload","/upload/ar_1.0,c_thumb,g_face,w_0.7/r_max/co_skyblue,e_outline/co_lightgray,e_shadow,x_5,y_8")

    res.render("listings/edit.ejs", {listing, OriginalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(500,"Hello")
    // }

    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})

    if(typeof req.file !=='undefined'){
        let url=req.file.path;
        let filename=req.file.path;
        listing.image={url,filename}
        await listing.save()
    }

    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    // console.log(deleted);
    res.redirect("/listing")
}