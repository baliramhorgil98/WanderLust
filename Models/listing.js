const mongoose=require("mongoose");
const Schema=mongoose.Schema;

//Schema of the database
const listingSchema=new Schema({
  title:{
    type: String,
    required:true,
  }, 
  description:String,
  image:{
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:"https://unsplash.com/photos/tropical-beach-on-samoa-_OZY3judAl4",
      set: (v) => v === "" ? "https://unsplash.com/photos/tropical-beach-on-samoa-_OZY3judAl4" : v,
    },
  },
  price:Number,
  location:String,
  country:String,
}); 

const Listing=mongoose.model("Listing", listingSchema);
module.exports=Listing;