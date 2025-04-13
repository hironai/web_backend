const express = require("express");
const { GET } = require('../../controllers/dashboard/get');
const { PUT } = require("../../controllers/dashboard/put");
const { POST } = require("../../controllers/dashboard/post");
const { DELETE } = require("../../controllers/dashboard/delete");

const router = express.Router();

// Define candidate API routes
router.route('/').get(GET.getDashboardById).put(PUT.updateDashboard);
router.route('/employees').get(GET.getOrganizationEmployees).delete(DELETE.deleteOrganizationEmployee);
router.route('/employees/onboard').post(POST.onboardEmployee);
router.route('/employees/resend-invite').post(POST.resendInviteEmployee);
router.route('/shortlist').get(GET.getshortlistCandidate).put(PUT.shortlistCandidate);
router.route('/shortlist/info').get(GET.getCandidateInfo);

module.exports = router;
