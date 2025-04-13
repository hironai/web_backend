const express = require("express");
const { POST } = require('../../controllers/search/post');

const router = express.Router();

// Define candidate API routes
router.route('/').post(POST.Search);

module.exports = router;
