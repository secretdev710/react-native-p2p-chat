import e from "express";

const UserModel = require('../models/UserModel');

exports.Register = async (req: any, res: any) => {
    try{
        const { userName, email, password } = req.body;
    
        const user = new UserModel({
            userName,
            email,
            password
        });
    
        if (!user.userName || !user.email || !user.password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        const existingUser = await UserModel.findOne({ email });
    
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
    
        await user.save();
    
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch(err){
        console.log(err);
    }
}

exports.Login = async (req: any, res: any) => {
    try{
        const { email, password } = req.body;
    
        const user = await UserModel.findOne({ email });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        res.status(200).json({ message: 'Login successful' });
    }
    catch(err){
        console.log(err);
    }
}