const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req,res) => {
    try{
        const { identifier, password } = req.body;
        const checkUser = await User.findOne({ $or: [{ email: identifier}, { username: identifier }] });
        if(!checkUser){
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, checkUser.password);
        if(!isValid){
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({userId: checkUser._id},
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful !', token });
        }catch(error){
        res.status(500).json({ message: { error: error.message } });
        }
    
};

exports.signup = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        console.log(req.body);
        const salt = await bcrypt.genSalt(10);

        const checkUser = await User.findOne({ $or: [{ email }, { username }] });
        if(checkUser){
            return res.status(400).json({ message: 'User exists already' });
        }
        const hashedPass= await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPass });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    }catch(error){
        res.status(500).json({ message: { error: error.message } });
    }
};