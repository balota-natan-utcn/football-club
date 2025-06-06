const express = require('express');
const { getAllMatches, getMatch, createMatch, updateMatch, deleteMatch } = require('../controllers/matchController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllMatches);
router.get('/:id', getMatch);
router.post('/', authenticate, requireAdmin, createMatch);
router.put('/:id', authenticate, requireAdmin, updateMatch);
router.delete('/:id', authenticate, requireAdmin, deleteMatch);

module.exports = router;