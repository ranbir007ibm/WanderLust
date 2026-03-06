const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asynWrap");
const listingController = require("../controllers/listingcontroller");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router.route("/")
  .get(asyncWrap(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),   
    validateListing,
    asyncWrap(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
  .get(asyncWrap(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    asyncWrap(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    asyncWrap(listingController.deleteListing)
  );

router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(listingController.editListing)
);

module.exports = router;