const express = require('express');
const { GET } = require('../../controllers/auth/get');
const { POST } = require('../../controllers/auth/post');
const { validateToken } = require('../../utils/token');
const { DELETE } = require('../../controllers/auth/delete');
const { PUT } = require('../../controllers/auth/put');
const router = express.Router();

// health check for auth routes
router.route('/health').get(GET.health);

// auth routes
router.route('/sign-up').post(POST.signUp);
router.route('/sign-in').post(POST.signIn);
router.route('/send-otp').post(POST.sendOTP);
router.route('/verify-account').post(POST.verifyAccount);
router.route('/access-token').get(validateToken,GET.accessAuthToken);
router.route('/refresh-token').get(GET.refreshAuthToken);
router.route('/logout').post(validateToken,POST.logout);
router.route('/set-password').post(POST.setPassword);
router.route('/reset-password').put(validateToken, PUT.resetSetPassword);
router.route('/delete').delete(validateToken, DELETE.deleteAccount);

module.exports = router;