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
  // Debug the incoming request
  console.log('Raw test request body:', req.body);

  // Only destructure the fields we want to test
  const { 
    name,
    foundingyear 
  } = req.body;

  try {
    const query = {
      text: `INSERT INTO companies (
        name, 
        foundingyear
      ) VALUES ($1, $2) RETURNING *`,
      values: [
        name || null, 
        foundingyear || null
      ]
    };

    console.log('Executing test query:', {
      sql: query.text,
      values: query.values
    });

    const result = await pool.query(query);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Test insertion error:', err);
    res.status(500).json({ 
      message: 'TEST FAILED',
      error: err.message,
      details: {
        receivedData: {
          name: name,
          foundingyear: foundingyear
        },
        hint: 'Check if the fields exist in the database exactly as spelled'
      }
    });
  }
});



// Update an existing company
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, headquarters_location, r_and_d_location, country, product, email, employeestrength, revenues, telephone, productionvolumes, keycustomers, region, foundingYear, keymanagement, rate, offeringProducts, pricingstrategy, customerneeds, technologyuse, competitiveadvantage, challenges, Recentnews, Productlaunch, strategicpartenrship, comments, employeesperregion, Businessstrategies, revenue, ebit, cashFlowSituation, roceandequityRatio } = req.body;
  try {
    const result = await pool.query(
      'UPDATE companies SET name = $1, headquarters_location = $2, r_and_d_location = $3, country = $4, product = $5, email = $6, employeestrength = $7, revenues = $8, telephone = $9, productionvolumes = $10, keycustomers = $11, region = $12, foundingyear = $13, keymanagement = $14, rate = $15, offeringproducts = $16, pricingstrategy = $17, customerneeds = $18, technologyuse = $19, competitiveadvantage = $20, challenges = $21, recentnews = $22, Productlaunch = $23, strategicpartenrship = $24, comments = $25, employeesperregion = $26, businessstrategies = $27, revenue = $28, ebit = $29, cashFlowSituation = $30, roceandequityRatio = $31 WHERE id = $32 RETURNING *',
      [name, headquarters_location, r_and_d_location, country, product, email, employeestrength, revenues, telephone, productionvolumes, keycustomers, region,foundingYear, keymanagement,rate, offeringProducts, pricingstrategy,customerneeds,technologyuse,competitiveadvantage,challenges,Recentnews,Productlaunch,strategicpartenrship,comments,employeesperregion,Businessstrategies,revenue,ebit,cashFlowSituation,roceandequityRatio, id]
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
