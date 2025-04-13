const express = require("express");
const router = express.Router();

// Import route modules
const auth = require("./auth");
const profile = require("./profile");
const templates = require("./templates");
const contact = require("./contact");
const dashboard = require("./dashboard");
const search = require("./search");
const feedback = require("./feedback");
const { validateToken } = require("../utils/token");

// Use routes
router.use("/auth", auth);
router.use("/profile", profile);
router.use("/templates", templates);
router.use("/contact", contact);
router.use("/dashboard", validateToken, dashboard);
router.use("/search", validateToken, search);
router.use("/feedback", validateToken, feedback);
module.exports = router;
