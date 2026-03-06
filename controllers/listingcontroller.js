const Listing = require("../models/listing");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken:mapToken});
// INDEX
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index", { allListing });
};

// NEW
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// SHOW
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }

  res.render("listings/show", { listing });
};

// CREATE
module.exports.createListing = async (req, res) => {
  let geocodeResponse = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send();
   
  const newListing = new Listing(req.body.listing);
  newListing.geometry = geocodeResponse.body.features[0].geometry;

  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await newListing.save();

  req.flash("success", "Listing created successfully");
  res.redirect("/listing");
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (typeof req.file !== "undefined") {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };

    await listing.save();
  }
  
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listing/${id}`);
};

// EDIT
module.exports.editListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }
 let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_250,");
  res.render("listings/edit", { listing ,originalImageUrl});
};

// DELETE
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully");
  res.redirect("/listing");
};