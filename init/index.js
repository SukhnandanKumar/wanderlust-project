const mongoose=require('mongoose')
const initData=require('./data.js')
const listing=require('../models/listing.js')
const mongo_url='mongodb://127.0.0.1:27017/wanderlust'

main().then(()=>{
    console.log("Succesfull connected")
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongo_url);
}

const initDB= async()=>{
    await listing.deleteMany({})
    initData.data=initData.data.map((obj)=>({...obj, owner: '66b5c17ee9784fd6322734af'}))
    await listing.insertMany(initData.data)
    console.log("Data was reinitialized");
}

initDB()