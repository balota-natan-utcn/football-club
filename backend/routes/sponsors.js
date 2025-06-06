const express = require('express');
const { getAllSponsors, getSponsor, createSponsor, updateSponsor, deleteSponsor } = require('../controllers/sponsorController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAllSponsors);
router.get('/:id', getSponsor);
router.post('/', authenticate, requireAdmin, upload.single('logo'), createSponsor);
router.put('/:id', authenticate, requireAdmin, upload.single('logo'), updateSponsor);
router.delete('/:id', authenticate, requireAdmin, deleteSponsor);

module.exports = router;