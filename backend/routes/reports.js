//jshint esversion:6

const express = require('express');

const router = express.Router();

const reportController = require('../controllers/reports');

router.get('/reports', reportController.reports);

module.exports = router;

