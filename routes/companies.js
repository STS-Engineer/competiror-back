const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all companies
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new company
router.post('/', async (req, res) => {
  const { name, email, headquarters_location, r_and_d_location, country, product, employeestrength, revenues, telephone, website, productionvolumes, keycustomers, region } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO companies (name, email, headquarters_location, r_and_d_location, country, product, employeestrength, revenues, telephone, website, productionvolumes, keycustomers, region) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [name, email, headquarters_location, r_and_d_location, country, product, employeestrength, revenues, telephone, website, productionvolumes, keycustomers, region]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding company:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an existing company
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, headquarters_location, r_and_d_location, country, product, email, employeestrength, revenues, telephone, productionvolumes, keycustomers, region } = req.body;
  try {
    const result = await pool.query(
      'UPDATE companies SET name = $1, headquarters_location = $2, r_and_d_location = $3, country = $4, product = $5, email = $6, employeestrength = $7, revenues = $8, telephone = $9, productionvolumes = $10, keycustomers = $11, region = $12 WHERE id = $13 RETURNING *',
      [name, headquarters_location, r_and_d_location, country, product, email, employeestrength, revenues, telephone, productionvolumes, keycustomers, region, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating company:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single company by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching company by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
