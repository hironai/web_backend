const express = require("express");
const { POST } = require('../../controllers/contact/post');

const router = express.Router();

// Define candidate API routes
router.route('/').post(POST.ContactUs);
router.route('/newsletter').post(POST.Subscribe);

module.exports = router;
