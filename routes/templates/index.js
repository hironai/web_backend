const express = require("express");
const { GET } = require('../../controllers/templates/get');
const { POST } = require("../../controllers/templates/post");
const { DELETE } = require("../../controllers/templates/delete");
const { PUT } = require("../../controllers/templates/put");
const { validateToken } = require("../../utils/token");

const router = express.Router();

// Define templates API routes
router.route('/').post(validateToken, POST.createTemplates);// ✅ Bulk Create Templates
router.route('/').get(GET.getTemplates); // ✅ Get All Templates
router.route('/').put(validateToken, PUT.updateTemplate); // ✅ Update Template by ID
router.route('/').delete(validateToken, DELETE.deleteTemplate); // ✅ Delete Template by ID

module.exports = router;
