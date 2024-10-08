const User=require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const SignUp=async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password !== confirmPassword) return res.status(400).send({ message: "Passwords do not match" });

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
      
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(200).json({ message: "User created", user });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};


const login = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).lean();
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{ expiresIn: '7d' });
        res.status(200).json({ message: "User logged in", user, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};


module.exports = { SignUp, login };