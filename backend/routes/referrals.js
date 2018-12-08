//jshint esversion:6
const auth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

const referralController = require('../controllers/referrals');

//getting all referrals
router.get('/referrals', referralController.getReferrals);

//adding a new referral 
router.get('/add-referral', referralController.getAddReferral);
//adding referral route
router.post('/add-referral', referralController.postReferral);
// referral detail route
router.get('/detail/:id', referralController.getReferral);
//editing referral route
router.get('/referral/edit/:id', referralController.editReferral);

//update referral route
router.post('/referral/update/:id', referralController.updateReferral);

//delete referral route
router.delete('/referral/delete/:id', referralController.deleteReferral);

//get all referral by referee.
router.get('/referral/referee/:id', referralController.getAllReferralsById);


//get all referrals by status page 
router.get('/my-referrals/:status', referralController.getReferralsStatus);


module.exports = router;