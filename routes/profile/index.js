const express = require('express');
const { GET } = require('../../controllers/profile/get');
const router = express.Router();

// profile routes
router.route('/').get(GET.userProfile);


module.exports = router;