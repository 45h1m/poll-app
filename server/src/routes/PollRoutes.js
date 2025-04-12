const express = require('express');
const router = express.Router();
const pollController = require('../handlers/pollHandlers');
const { authenticateToken } = require('../handlers/userHandler');
const checkFirstTimeVisitor = require('../middlewares/checkFirstVisit');

router.get('/polls/:id', pollController.getPollById);
router.post('/polls/vote/:id',checkFirstTimeVisitor, pollController.voteOnPoll);

router.get('/polls', authenticateToken, pollController.getAllPolls);
router.post('/polls', authenticateToken, pollController.createPoll);
router.post('/update/:id', authenticateToken, pollController.updatePoll);

module.exports = router;