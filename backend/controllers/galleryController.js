const Gallery = require('../models/Gallery');

const getAllGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createGalleryItem = async (req, res) => {
  try {
    const itemData = { ...req.body };
    
    if (req.file) {
      itemData.url = `/resources/${req.file.filename}`;
      itemData.type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
      
      // For videos, you might want to generate a thumbnail
      if (itemData.type === 'video') {
        itemData.thumbnail = `/resources/${req.file.filename}`;
      }
    }

    const item = new Gallery(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateGalleryItem = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.url = `/resources/${req.file.filename}`;
      updateData.type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};