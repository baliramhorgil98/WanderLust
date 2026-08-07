const express = require("express");
const { route } = require("./listing");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//For user controller requirement
const userController=require("../controllers/users.js");

//for signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//for login
router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
      failureRedirect: "/login", 
      failureFlash: true, 
    }),
    userController.login
  );


  //for Logout
  router.get("/logout", userController.logout);

module.exports = router;