import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user';
import { signupSchema, loginSchema } from '../validation/authValidation';

export const signup = async (req: Request, res: Response) => {
    // Validate request body
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Extract email and password from request body
    const { email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const newUser = new User({ email, password });
        await newUser.save();

        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);
        // newUser.password = hashedPassword;

        // Respond with success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    // Validate request body
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Extract email and password from request body
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Validate password
        let isValidPassword = false;
        // const isValidPassword = await bcrypt.compare(password, user.password);
        if(password===user.password){
            isValidPassword=true;
        }
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, 'secret', { expiresIn: '1h' });

        // Respond with token
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
