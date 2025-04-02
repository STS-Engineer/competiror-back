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
  const {
    name, email, headquarters_location, r_and_d_location, country, product, employeestrength, revenues,
    telephone, website, productionvolumes, keycustomers, region, foundingyear, keymanagement, rate,
    offeringproducts, pricingstrategy, customerneeds, technologyuse, competitiveadvantage, challenges,
    recentnews, productlaunch, strategicpartenrship, comments, employeesperregion, businessstrategies,
    revenue, ebit, operatingcashflow, roceandequityratio, investingcashflow, freecashflow
  } = req.body;

  try {
    // Convert product array to a string if needed
    const productsString = Array.isArray(product) ? product.join(', ') : product || 'Unknown';

    // Ensure all values are set (prevent NULL values)
    const values = [
      name || "Unknown Company",
      email || "notprovided@example.com",
      headquarters_location || "Not Available",
      r_and_d_location || "Not Available",
      country || "Not Available",
      productsString,
      employeestrength || 0,  // Default to 0 if null
      revenues || 0,
      telephone || "Not Provided",
      website || "https://example.com",
      productionvolumes || "0 units",
      keycustomers || "Not Provided",
      region || "Unknown",
      foundingyear || 2000,  // Ensure a valid founding year
      keymanagement || "Not Available",
      rate || "N/A",
      offeringproducts || "Not Specified",
      pricingstrategy || "Not Specified",
      customerneeds || "Not Specified",
      technologyuse || "Not Specified",
      competitiveadvantage || "Not Specified",
      challenges || "Not Specified",
      recentnews || "No recent news",
      productlaunch || "No product launch",
      strategicpartenrship || "No strategic partnership",
      comments || "No comments",
      employeesperregion || "Not Specified",
      businessstrategies || "Not Specified",
      revenue || 0,
      ebit || 0,
      operatingcashflow || 0,
      roceandequityratio || 0,
      investingcashflow || 0,
      freecashflow || 0
    ];

    const query = `
      INSERT INTO companies (
        name, email, headquarters_location, r_and_d_location, country, product, employeestrength, revenues, 
        telephone, website, productionvolumes, keycustomers, region, foundingyear, keymanagement, rate, 
        offeringproducts, pricingstrategy, customerneeds, technologyuse, competitiveadvantage, challenges, 
        recentnews, productlaunch, strategicpartenrship, comments, employeesperregion, businessstrategies, 
        revenue, ebit, operatingcashflow, roceandequityratio, investingcashflow, freecashflow
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 
        $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34
      ) RETURNING *`;

    const result = await pool.query(query, values);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding company:', err);
    res.status(500).json({ message: 'Internal server error' });
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
