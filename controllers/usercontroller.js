const User = require("../models/user.js");
module.exports.signupPage=(req, res) => {
  res.render("user/signup");
};
module.exports.signupPageLogic=async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listing");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};
module.exports.loginPage=(req, res) => {
  res.render("user/login");
};
module.exports.loginPageLogic=(req, res) => {
    req.flash("success", "Welcome back to WanderLust");
    res.redirect(res.locals.redirectUrl || "/listing");
  };
  module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "Logged out successfully");
    res.redirect("/listing");
  });
};