import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const user = new User({ email, password, firstName, lastName });
        await user.save();
        res.status(201).json({ 
            message: "User registered successfully", 
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", { expiresIn: "1d" });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000
        }
        res.cookie("token", token, options);
        res.status(200).json({ 
            message: "User logged in successfully", 
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
