import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Validate request body
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create new user
        const user = new User({ email, password, firstName, lastName });
        await user.save();

        // Generate token for new user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", { expiresIn: "1d" });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            maxAge: 3600000
        }

        // Set cookie
        res.cookie("token", token, options);
        res.status(201).json({ 
            message: "User registered successfully", 
            token: token, // Also return token for localStorage
            user: {
                _id: user._id,
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

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", { expiresIn: "1d" });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            maxAge: 3600000
        }

        // Set cookie
        res.cookie("token", token, options);
        res.status(200).json({ 
            message: "User logged in successfully", 
            token: token, // Also return token for localStorage
            user: {
                _id: user._id,
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


export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const ping = async (req: Request, res: Response) => {
    try {
        // If we reach here, the user is authenticated (middleware already checked)
        res.status(200).json({ 
            message: "User is authenticated", 
            user: {
                _id: req.user._id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                role: req.user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}