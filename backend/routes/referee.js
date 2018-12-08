//jshint esversion:6

const express = require('express');

const router = express.Router();

const refereeController = require('../controllers/referee');

//get referralby page route
router.get('/add-referee', refereeController.getAddReferee);

//add referralBy or referee 
router.post('/add-referee', refereeController.postReferee);

//get all referees route
router.get('/all-referees', refereeController.getReferees);

router.get('/details/:id', refereeController.getOneReferee);

//get edit referee page
router.get('/edit/:id', refereeController.getEditReferee);

// post update referee
router.post('/update/:id', refereeController.postUpdateReferee);

module.exports = router;