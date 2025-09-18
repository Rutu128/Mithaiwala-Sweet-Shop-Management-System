import request from "supertest";
import app from "../app";
import { connectDB } from "../db";
import mongoose from "mongoose";
import User from "../models/user.model";
import Sweet from "../models/sweet.model";

const testAdmin = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@inventory.com",
    password: "admin123",
    role: "admin"
};

const testUser = {
    firstName: "Regular",
    lastName: "User",
    email: "user@inventory.com",
    password: "user123",
    role: "user"
};

const testSweet = {
    name: "Test Sweet",
    price: 100,
    description: "Test Description",
    image: "test-image.jpg",
    category: "chocolate",
    quantity: 50
};

let adminToken: string;
let userToken: string;
let sweetId: string;

beforeAll(async () => {
    await connectDB();
    
    // Create admin user directly in database
    const adminUser = new User({
        firstName: testAdmin.firstName,
        lastName: testAdmin.lastName,
        email: testAdmin.email,
        password: testAdmin.password,
        role: "admin"
    });
    await adminUser.save();
    
    // Login as admin to get token
    const adminLoginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: testAdmin.email,
            password: testAdmin.password
        });
    
    adminToken = adminLoginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
    
    // Create regular user directly in database
    const regularUser = new User({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: testUser.password,
        role: "user"
    });
    await regularUser.save();
    
    // Login as user to get token
    const userLoginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: testUser.email,
            password: testUser.password
        });
    
    userToken = userLoginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
});

afterAll(async () => {
    await User.deleteMany({
        email: { $in: [testAdmin.email, testUser.email] }
    });
    await Sweet.deleteMany({
        name: { $in: [testSweet.name] }
    });
    await mongoose.connection.close();
});

beforeEach(async () => {
    // Create a test sweet before each test
    const response = await request(app)
        .post("/api/sweets")
        .set('Cookie', `token=${adminToken}`)
        .send(testSweet);
    sweetId = response.body.sweet._id;
});

afterEach(async () => {
    await Sweet.deleteMany({
        name: { $in: [testSweet.name] }
    });
});

describe("Inventory API", () => {
    describe("POST /api/sweets/:id/purchase", () => {
        it("should purchase a sweet and decrease quantity when user is authenticated", async () => {
            const purchaseQuantity = 5;
            
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', `token=${userToken}`)
                .send({ quantity: purchaseQuantity })
                .expect(200);
            
            expect(response.body.message).toBe("Sweet purchased successfully");
            expect(response.body.sweet).toBeDefined();
            expect(response.body.sweet._id).toBe(sweetId);
            expect(response.body.sweet.quantity).toBe(testSweet.quantity - purchaseQuantity);
            expect(response.body.purchaseQuantity).toBe(purchaseQuantity);
        });

        it("should return 401 when user is not authenticated", async () => {
            await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .send({ quantity: 5 })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 400 when quantity is not provided", async () => {
            await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', `token=${userToken}`)
                .send({})
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe("Quantity is required");
                });
        });

        it("should return 400 when quantity is not a positive number", async () => {
            await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', `token=${userToken}`)
                .send({ quantity: 0 })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe("Quantity must be a positive number");
                });
        });

        it("should return 400 when quantity is greater than available stock", async () => {
            const purchaseQuantity = testSweet.quantity + 10;
            
            await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', `token=${userToken}`)
                .send({ quantity: purchaseQuantity })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe("Insufficient stock");
                });
        });

        it("should return 404 when sweet is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            
            await request(app)
                .post(`/api/sweets/${fakeId}/purchase`)
                .set('Cookie', `token=${userToken}`)
                .send({ quantity: 5 })
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toBe("Sweet not found");
                });
        });

        it("should handle multiple purchases correctly", async () => {
            const firstPurchase = 10;
            const secondPurchase = 15;
            
            // First purchase
            await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', `token=${userToken}`)
                .send({ quantity: firstPurchase })
                .expect(200);
            
            // Second purchase
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', `token=${userToken}`)
                .send({ quantity: secondPurchase })
                .expect(200);
            
            expect(response.body.sweet.quantity).toBe(testSweet.quantity - firstPurchase - secondPurchase);
        });
    });

    describe("POST /api/sweets/:id/restock", () => {
        it("should restock a sweet and increase quantity when admin is authenticated", async () => {
            const restockQuantity = 20;
            
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', `token=${adminToken}`)
                .send({ quantity: restockQuantity })
                .expect(200);
            
            expect(response.body.message).toBe("Sweet restocked successfully");
            expect(response.body.sweet).toBeDefined();
            expect(response.body.sweet._id).toBe(sweetId);
            expect(response.body.sweet.quantity).toBe(testSweet.quantity + restockQuantity);
            expect(response.body.restockQuantity).toBe(restockQuantity);
        });

        it("should return 401 when user is not authenticated", async () => {
            await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .send({ quantity: 20 })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 401 when regular user tries to restock", async () => {
            await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', `token=${userToken}`)
                .send({ quantity: 20 })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 400 when quantity is not provided", async () => {
            await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', `token=${adminToken}`)
                .send({})
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe("Quantity is required");
                });
        });

        it("should return 400 when quantity is not a positive number", async () => {
            await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', `token=${adminToken}`)
                .send({ quantity: -5 })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe("Quantity must be a positive number");
                });
        });

        it("should return 404 when sweet is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            
            await request(app)
                .post(`/api/sweets/${fakeId}/restock`)
                .set('Cookie', `token=${adminToken}`)
                .send({ quantity: 20 })
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toBe("Sweet not found");
                });
        });

        it("should handle multiple restocks correctly", async () => {
            const firstRestock = 10;
            const secondRestock = 15;
            
            // First restock
            await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', `token=${adminToken}`)
                .send({ quantity: firstRestock })
                .expect(200);
            
            // Second restock
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', `token=${adminToken}`)
                .send({ quantity: secondRestock })
                .expect(200);
            
            expect(response.body.sweet.quantity).toBe(testSweet.quantity + firstRestock + secondRestock);
        });

        it("should handle purchase and restock operations together", async () => {
            const purchaseQuantity = 10;
            const restockQuantity = 20;
            
            // First purchase
            await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Cookie', `token=${userToken}`)
                .send({ quantity: purchaseQuantity })
                .expect(200);
            
            // Then restock
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Cookie', `token=${adminToken}`)
                .send({ quantity: restockQuantity })
                .expect(200);
            
            expect(response.body.sweet.quantity).toBe(testSweet.quantity - purchaseQuantity + restockQuantity);
        });
    });
});