const express = require('express');
const { submitContact, getAllContacts, updateContactStatus, deleteContact } = require('../controllers/contactController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitContact);
router.get('/', authenticate, requireAdmin, getAllContacts);
router.put('/:id/status', authenticate, requireAdmin, updateContactStatus);
router.delete('/:id', authenticate, requireAdmin, deleteContact);

module.exports = router;