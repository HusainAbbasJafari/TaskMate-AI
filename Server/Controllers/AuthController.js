// authcontroller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Workspace = require('../Models/Workspace');
require('dotenv').config();

const loginController = async (req, res) => {
        const { email, password } = req.body;
      
        try {
          // Check if the user exists
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(403).json({ message: 'Invalid credentials',success:false });
          }
      
          // Check if the password is correct
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials',success:false });
          }
      
          // Generate a JWT token
          const token = jwt.sign(
            { email: user.email ,_id: user._id },//payload
            process.env.JWT_SECRET,//secret key
            { expiresIn: '24h'  } //options
          );
      
          res.status(200).json({ 
            message:"Login successful",
            success:true,
            token ,
            email,
            name:user.username,});
          
        } catch (error) {
          res.status(500).json({ message: 'Server error',success:false });
        }
 
}

const signUpController = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password,with salt of 10
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully',success:true });
    } catch (error) {
      res.status(500).json({ message: 'Server error',success:false ,error});
    }
  }

const getUsers = async(req,res)=>{
  try{
    const users = await User.find();
    res.status(200).json(users);
  }catch(error){
    res.status(500).json({message:'Server error'});
  }
}

// const getUsers = async(req,res)=>{
//   try{
//     const users = await Workspace.find();
//     res.status(200).json(users);
//   }catch(error){
//     res.status(500).json({message:'Server error'});
//   }
// }

const getSingleUser = async(req,res)=>{
  try{
    const userId = req.params.id;
    if(!userId){
      return res.status(400).json({message:"User id is required"})
    }
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    res.status(200).json(user)
  }catch(error){
      res.status(500).json({message:"Server error",error});
  }
  
}

module.exports={
    loginController,
    signUpController,
    getUsers,
    getSingleUser
}