const express = require('express');
const router = express.Router();
const db = require('../db');

// Add School
router.route("/addSchool").post(async (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  try {
    await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// List Schools
router.route('/listSchools').get(async (req, res) => {
  const { latitude, longitude } = req.query;
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Invalid coordinates' });
  }
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
  try {
    const [schools] = await db.execute('SELECT * FROM schools');
    const userLat = parseFloat(latitude); // Convert latitude to float
    const userLon = parseFloat(longitude);

    

    schools.forEach(s => {
      s.distance = calculateDistance(userLat, userLon, s.latitude, s.longitude);
    });

    schools.sort((a, b) => a.distance - b.distance);
    res.json(schools);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;
