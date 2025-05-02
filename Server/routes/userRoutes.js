const express = require('express');
const router = express.Router();

const {loginController,signUpController,getUsers,getSingleUser } = require('../Controllers/AuthController');

const { signupValidation, loginValidation } = require('../Middlewares/authMiddlewares');

// get all users
// router.get('/', getUsers);
router.get('/',getUsers);

router.get('/:id', getSingleUser);

// Register a new user
router.post('/signup', signupValidation, signUpController);

// Login a user
router.post('/login',loginValidation, loginController );


module.exports = router;