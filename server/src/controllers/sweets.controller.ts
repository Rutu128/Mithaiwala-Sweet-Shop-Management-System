import { Request, Response } from "express";
import Sweet from "../models/sweet.model";


export const createSweet = async (req: Request, res: Response) => {
    try {
        const { name, price, description, image, category, quantity } = req.body;

        // Validate request body
        if (!name || !price || !description || !image || !category || !quantity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate category
        const validCategories = ["chocolate", "caramel", "toffee", "fudge", "other"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }

        // Validate price
        if (price <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }


        // Create new sweet
        const sweet = new Sweet({
            name, price, description,
            image,
            category, quantity
        });

        await sweet.save();
        res.status(201).json({ message: "Sweet created successfully", sweet });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllSweets = async (req: Request, res: Response) => {
    try {
        const sweets = await Sweet.find();
        res.status(200).json({ message: "Sweets retrieved successfully", sweets });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSweetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sweet = await Sweet.findById(id);
        if (!sweet) {
            return res.status(404).json({ message: "Sweet not found" });
        }
        res.status(200).json({ message: "Sweet retrieved successfully", sweet });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price, description, image, category, quantity } = req.body;

        // Validate category if provided
        if (category) {
            const validCategories = ["chocolate", "caramel", "toffee", "fudge", "other"];
            if (!validCategories.includes(category)) {
                return res.status(400).json({ message: "Invalid category" });
            }
        }

        const sweet = await Sweet.findByIdAndUpdate(id, { name, price, description, image, category, quantity }, { new: true });
        if (!sweet) {
            return res.status(404).json({ message: "Sweet not found" });
        }
        res.status(200).json({ message: "Sweet updated successfully", sweet });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sweet = await Sweet.findByIdAndDelete(id);
        if (!sweet) {
            return res.status(404).json({ message: "Sweet not found" });
        }
        res.status(200).json({ message: "Sweet deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const purchaseSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        // Validate quantity
        if (!quantity) {
            return res.status(400).json({ message: "Quantity is required" });
        }

        if (quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({ message: "Quantity must be a positive number" });
        }

        // Find the sweet
        const sweet = await Sweet.findById(id);
        if (!sweet) {
            return res.status(404).json({ message: "Sweet not found" });
        }

        // Check if sufficient stock is available
        if (sweet.quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // Update quantity
        sweet.quantity -= quantity;
        await sweet.save();

        res.status(200).json({
            message: "Sweet purchased successfully",
            sweet: {
                _id: sweet._id,
                name: sweet.name,
                price: sweet.price,
                description: sweet.description,
                image: sweet.image,
                category: sweet.category,
                quantity: sweet.quantity,
                createdAt: sweet.createdAt,
                updatedAt: sweet.updatedAt
            },
            purchaseQuantity: quantity
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const restockSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        // Validate quantity
        if (!quantity) {
            return res.status(400).json({ message: "Quantity is required" });
        }

        if (quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({ message: "Quantity must be a positive number" });
        }

        // Find the sweet
        const sweet = await Sweet.findById(id);
        if (!sweet) {
            return res.status(404).json({ message: "Sweet not found" });
        }

        // Update quantity
        sweet.quantity += quantity;
        await sweet.save();

        res.status(200).json({
            message: "Sweet restocked successfully",
            sweet: {
                _id: sweet._id,
                name: sweet.name,
                price: sweet.price,
                description: sweet.description,
                image: sweet.image,
                category: sweet.category,
                quantity: sweet.quantity,
                createdAt: sweet.createdAt,
                updatedAt: sweet.updatedAt
            },
            restockQuantity: quantity
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
