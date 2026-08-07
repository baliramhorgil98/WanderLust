const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

//Schema of the database
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image:{
    url:String,
    filename:String,
  },
  // image: {
  //   filename: {
  //     type: String,
  //     default: "listingimage",
  //   },
  //   url: {
  //     type: String,
  //     default: "https://unsplash.com/photos/tropical-beach-on-samoa-_OZY3judAl4",
  //     set: (v) => v === "" ? "https://unsplash.com/photos/tropical-beach-on-samoa-_OZY3judAl4" : v,
  //   },
  // },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  //for listing owner
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
});

//Handling delete schema
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;