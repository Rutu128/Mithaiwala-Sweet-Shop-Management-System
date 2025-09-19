import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    // Check for token in cookies first, then in Authorization header
    let token = req.cookies.token;
    
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
    
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}