//jshint esversion:6

const express = require('express');

const router = express.Router();

const managerController = require('../controllers/manager');


//add referralBy or referee 
router.post('/add-manager', managerController.postManager);

//get all referees route
router.get('/all-managers', managerController.getManagers);

router.get('/details/:id', managerController.getOneManager);

// post update referee
router.post('/update/:id', managerController.postUpdateManager);

router.delete('/delete/:id', managerController.deleteManager);

module.exports = router;