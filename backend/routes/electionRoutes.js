const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const multer = require('multer');

// Configure Multer for processing file uploads (in-memory)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// Use upload.any() to handle dynamic file fields
router.post('/', upload.any(), electionController.createElection);
router.get('/', electionController.getAllElections);
router.get('/history/:userId', electionController.getVoterHistory); // Place before /:id
router.get('/:id', electionController.getElectionById);
router.put('/:id', upload.any(), electionController.updateElection);
router.get('/:id/vote', electionController.checkVoteStatus);
router.post('/:id/vote', electionController.castVote);
router.post('/:id/announce', electionController.announceResults);
router.post('/:id/withdraw', electionController.withdrawResults);

module.exports = router;
