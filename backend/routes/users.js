//jshint esversion:6
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/newuser', userController.createUser);

router.post('/login', userController.loginUser);

router.get('/me', auth, userController.getUser);

router.get('/:id', auth, userController.getUserById);

router.get('/all', auth, admin, userController.getAllUsers);

module.exports = router;