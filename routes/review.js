const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/ExpressError.js");  
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

//To require controlers
const reviewController=require("../controllers/reviews.js");

//Reviews 
//POST review route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview)
);

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;