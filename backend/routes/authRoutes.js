const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerVoter);
router.post('/login', authController.loginVoter);
router.post('/admin/login', authController.loginAdmin);
router.post('/seed-admin', authController.seedAdmin); // CAUTION: Remove in production
router.put('/profile', authController.updateProfile);
router.get('/profile/:id', authController.getProfile);
router.post('/verify', authController.verifyVoterFace);

module.exports = router;
