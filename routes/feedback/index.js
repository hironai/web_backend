const express = require("express");
const { POST } = require('../../controllers/feedback/post');

const router = express.Router();

// Define candidate API routes
router.route('/').post(POST.submitFeedback);

module.exports = router;
