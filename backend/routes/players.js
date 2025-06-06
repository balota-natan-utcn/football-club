const express = require('express');
const { getAllPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer } = require('../controllers/playerController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAllPlayers);
router.get('/:id', getPlayer);
router.post('/', authenticate, requireAdmin, upload.single('photo'), createPlayer);
router.put('/:id', authenticate, requireAdmin, upload.single('photo'), updatePlayer);
router.delete('/:id', authenticate, requireAdmin, deletePlayer);

module.exports = router;