if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
 

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 8080
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError=require('./utils/ExpressError.js') 
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require('./models/user.js')
 

const listingsRoute=require("./Routes/listing.js")
const reviewRoute=require("./Routes/review.js")
const userRoute=require('./Routes/user.js')


// const mongo_url='mongodb://127.0.0.1:27017/wanderlust'
const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Succesfull connected")
})
.catch((err)=>{
    console.log("if error accour",err)
})
async function main(){
    
    // await mongoose.connect(mongo_url);
    await mongoose.connect(dbUrl);
}


app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"public")))

// console.log("Helllll",process.env.ATLASDB_URL)
// console.log("Helllllbbbb",process.env.SECRETS)

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRETS
    },
    touchAfter: 24 * 3600
})

store.on("eroor", ()=>{
    console.log("ERROR in Mongo Store",err)
})
const sessionOption={
    store,
    secret: process.env.SECRETS,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 5 * 24 * 60 * 60 * 1000,
        maxAge: 5 * 24 * 60 * 60 * 1000,
        httpOnly: true 
    }
}


app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user
    next()
})

app.get("/demoUser",async(req,res)=>{
    let fakeUser=new User({
        email: "ankit@gmail.com",
        username: "ankit kumar"
    })
    let registerdUser=await User.register(fakeUser, "@kali@123")
    res.send(registerdUser)
})

app.use("/",listingsRoute);
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",userRoute)
 

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})


app.use((err,req,res,next)=>{
    let{status=500,message}=err;
    res.status(status).send(message)
})  
app.listen(port,()=>{
    console.log(`app is listen on ${port}`);
})