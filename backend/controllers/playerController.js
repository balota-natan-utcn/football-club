const Player = require('../models/Player');

const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ jerseyNumber: 1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createPlayer = async (req, res) => {
  try {
    const playerData = { ...req.body };
    
    if (req.file) {
      playerData.photo = `/resources/${req.file.filename}`;
    }

    const player = new Player(playerData);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Jersey number already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

const updatePlayer = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.photo = `/resources/${req.file.filename}`;
    }

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer
};