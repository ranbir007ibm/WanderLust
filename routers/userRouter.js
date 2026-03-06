const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller.js");
const asyncWrap = require("../utils/asynWrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// SIGNUP PAGE
router.route('/signup')
.get(userController.signupPage)
.post(asyncWrap(userController.signupPageLogic));

// LOGIN PAGE
router.route('/login')
.get(userController.loginPage)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.loginPageLogic
);

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;