const Sponsor = require('../models/Sponsor');

const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ tier: 1, name: 1 });
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    res.json(sponsor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSponsor = async (req, res) => {
  try {
    const sponsorData = { ...req.body };
    
    if (req.file) {
      sponsorData.logo = `/resources/${req.file.filename}`;
    }

    const sponsor = new Sponsor(sponsorData);
    await sponsor.save();
    res.status(201).json(sponsor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSponsor = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.logo = `/resources/${req.file.filename}`;
    }

    const sponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    
    res.json(sponsor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    res.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllSponsors,
  getSponsor,
  createSponsor,
  updateSponsor,
  deleteSponsor
};