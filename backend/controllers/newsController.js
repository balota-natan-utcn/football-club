const News = require('../models/News');

const getAllNews = async (req, res) => {
  try {
    const { published } = req.query;
    
    let filter = {};
    
    if (published === 'all') {
      // Show all articles regardless of published status
      filter = {};
    } else if (published === 'false') {
      // Show only unpublished articles
      filter = { published: false };
    } else {
      // Default: show only published articles
      // Remove the published filter entirely if not specified
      // This ensures we get articles where published is true OR undefined
      filter = { $or: [{ published: true }, { published: { $exists: false } }] };
    }
    
    const news = await News.find(filter).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNewsItem = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    const newsData = { ...req.body };
    
    if (req.file) {
      newsData.image = `/resources/${req.file.filename}`;
    }

    const newsItem = new News(newsData);
    await newsItem.save();
    res.status(201).json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/resources/${req.file.filename}`;
    }

    const newsItem = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.json({ message: 'News item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllNews,
  getNewsItem,
  createNews,
  updateNews,
  deleteNews
};