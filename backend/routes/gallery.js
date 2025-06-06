const express = require('express');
const { getAllGallery, getGalleryItem, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAllGallery);
router.get('/:id', getGalleryItem);
router.post('/', authenticate, requireAdmin, upload.single('media'), createGalleryItem);
router.put('/:id', authenticate, requireAdmin, upload.single('media'), updateGalleryItem);
router.delete('/:id', authenticate, requireAdmin, deleteGalleryItem);

module.exports = router;