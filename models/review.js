const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const ReviewSchema=new Schema({
    comment: String,
    rating: {
        type: Number,
        max: 5,
        min: 1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    auther:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})
const Review =mongoose.model("Review", ReviewSchema)
module.exports=Review;