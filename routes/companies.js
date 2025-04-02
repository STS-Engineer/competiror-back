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
  console.log('Raw request body:', req.body);

  // Destructure with null defaults
  const { 
    name, email, headquarters_location, r_and_d_location, country, product, employeestrength, 
    revenues, telephone, website, productionvolumes, keycustomers, region, foundingyear, 
    keymanagement, rate, offeringproducts, pricingstrategy, customerneeds, technologyuse, 
    competitiveadvantage, challenges, recentnews, productlaunch, strategicpartenrship, // Note: Typo matches DB
    comments, employeesperregion, businessstrategies, revenue, ebit, operatingcashflow, 
    roceandequityratio, // Changed to match DB (all lowercase)
    investingcashflow, freecashflow 
  } = req.body;

  try {
    // Handle array fields
    const productsString = Array.isArray(product) ? product.join(', ') : product;

    const query = {
      text: `INSERT INTO companies (
        name, email, headquarters_location, r_and_d_location, country, product, 
        employeestrength, revenues, telephone, website, productionvolumes, 
        keycustomers, region, foundingyear, keymanagement, rate, offeringproducts, 
        pricingstrategy, customerneeds, technologyuse, competitiveadvantage, 
        challenges, recentnews, productlaunch, strategicpartenrship, comments, 
        employeesperregion, businessstrategies, revenue, ebit, operatingcashflow, 
        roceandequityratio, investingcashflow, freecashflow
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, 
        $31, $32, $33, $34) RETURNING *`,
      values: [
        name || null, email || null, headquarters_location || null, r_and_d_location || null, 
        country || null, productsString || null, employeestrength || null, 
        revenues || null, telephone || null, website || null, productionvolumes || null, 
        keycustomers || null, region || null, foundingyear || null, keymanagement || null, 
        rate || null, offeringproducts || null, pricingstrategy || null, customerneeds || null, 
        technologyuse || null, competitiveadvantage || null, challenges || null, 
        recentnews || null, productlaunch || null, strategicpartenrship || null, 
        comments || null, employeesperregion || null, businessstrategies || null, 
        revenue || null, ebit || null, operatingcashflow || null, 
        roceandequityratio || null, // Now matches DB
        investingcashflow || null, freecashflow || null
      ]
    };

    console.log('Executing query with values:', query.values); // Debug values

    const result = await pool.query(query);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding company:', err);
    res.status(500).json({ 
      message: 'Internal server error',
      error: err.message,
      hint: 'Check column name spelling and case sensitivity' 
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
