const express = require('express');
const { getAllNews, getNewsItem, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsItem);
router.post('/', authenticate, requireAdmin, upload.single('image'), createNews);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateNews);
router.delete('/:id', authenticate, requireAdmin, deleteNews);

module.exports = router;