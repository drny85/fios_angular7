//jshint esversion:6
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
//POST create user/ Sign up
router.post('/newuser', userController.createUser);
//POST Longin user
router.post('/login', userController.loginUser);

router.get('/all', auth, admin, userController.getAllUsers);
// PUT Update user
router.put('/update', auth, admin, userController.updateUser);
// GET user 
router.get('/me', auth, userController.getUser);
// GET user by ID
router.get('/:id', auth, userController.getUserById);

router.delete('/:id', auth, admin, userController.deleteUser);



module.exports = router;