import request from "supertest";
import app from "../app";
import { testConnectDB as connectDB } from "../db";
import mongoose from "mongoose";
import User from "../models/user.model";
import Sweet from "../models/sweet.model";

const testAdmin = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@test.com",
    password: "admin123",
    role: "admin"
};

const testUser = {
    firstName: "Regular",
    lastName: "User",
    email: "user@test.com",
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
    
    if (adminLoginResponse.headers['set-cookie'] && adminLoginResponse.headers['set-cookie'][0]) {
        adminToken = adminLoginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
    } else {
        throw new Error('Admin login failed - no cookie received');
    }
    
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
    
    if (userLoginResponse.headers['set-cookie'] && userLoginResponse.headers['set-cookie'][0]) {
        userToken = userLoginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
    } else {
        throw new Error('User login failed - no cookie received');
    }
});

afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await mongoose.connection.close();
});


describe("Sweet API", () => {
    describe("POST /api/sweets", () => {
        it("should create a new sweet when admin is authenticated", async () => {
            const response = await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send(testSweet)
                .expect(201);
            
            expect(response.body.message).toBe("Sweet created successfully");
            expect(response.body.sweet).toBeDefined();
            expect(response.body.sweet.name).toBe(testSweet.name);
            expect(response.body.sweet.price).toBe(testSweet.price);
            expect(response.body.sweet.description).toBe(testSweet.description);
            expect(response.body.sweet.image).toBe(testSweet.image);
            expect(response.body.sweet.category).toBe(testSweet.category);
            expect(response.body.sweet.quantity).toBe(testSweet.quantity);
        });

        it("should return 401 when user is not authenticated", async () => {
            await request(app)
                .post("/api/sweets")
                .send(testSweet)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 401 when regular user tries to create sweet", async () => {
            await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${userToken}`)
                .send(testSweet)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 400 when required fields are missing", async () => {
            await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send({
                    name: "Test Sweet"
                    // Missing other required fields
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe("All fields are required");
                });
        });

        it("should return 400 when category is invalid", async () => {
            await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send({
                    ...testSweet,
                    category: "invalid-category"
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe("Invalid category");
                });
        });
    });

    describe("PUT /api/sweets/:id", () => {
        let sweetId: string;

        beforeEach(async () => {
            // Create a sweet first
            const response = await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send(testSweet)
                .expect(201);
            
            if (response.body.sweet && response.body.sweet._id) {
                sweetId = response.body.sweet._id;
            } else {
                throw new Error('Failed to create test sweet');
            }
        });

        it("should update a sweet when admin is authenticated", async () => {
            const updatedData = {
                name: "Updated Sweet",
                price: 150,
                description: "Updated Description"
            };

            const response = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Cookie', `token=${adminToken}`)
                .send(updatedData)
                .expect(200);
            
            expect(response.body.message).toBe("Sweet updated successfully");
            expect(response.body.sweet.name).toBe(updatedData.name);
            expect(response.body.sweet.price).toBe(updatedData.price);
            expect(response.body.sweet.description).toBe(updatedData.description);
        });

        it("should return 401 when user is not authenticated", async () => {
            await request(app)
                .put(`/api/sweets/${sweetId}`)
                .send({ name: "Updated Sweet" })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 401 when regular user tries to update sweet", async () => {
            await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Cookie', `token=${userToken}`)
                .send({ name: "Updated Sweet" })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 404 when sweet is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            await request(app)
                .put(`/api/sweets/${fakeId}`)
                .set('Cookie', `token=${adminToken}`)
                .send({ name: "Updated Sweet" })
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toBe("Sweet not found");
                });
        });

        it("should return 400 when category is invalid", async () => {
            await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Cookie', `token=${adminToken}`)
                .send({ category: "invalid-category" })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe("Invalid category");
                });
        });
    });

    describe("DELETE /api/sweets/:id", () => {
        let sweetId: string;

        beforeEach(async () => {
            // Create a sweet first
            const response = await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send(testSweet)
                .expect(201);
            
            if (response.body.sweet && response.body.sweet._id) {
                sweetId = response.body.sweet._id;
            } else {
                throw new Error('Failed to create test sweet');
            }
        });

        it("should delete a sweet when admin is authenticated", async () => {
            await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Cookie', `token=${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe("Sweet deleted successfully");
                });
        });

        it("should return 401 when user is not authenticated", async () => {
            await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 401 when regular user tries to delete sweet", async () => {
            await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Cookie', `token=${userToken}`)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 404 when sweet is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            await request(app)
                .delete(`/api/sweets/${fakeId}`)
                .set('Cookie', `token=${adminToken}`)
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toBe("Sweet not found");
                });
        });
    });

    describe("GET /api/sweets", () => {
        it("should get all sweets when user is authenticated", async () => {

            await Sweet.deleteMany({});
            // Create some test sweets
            await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send(testSweet);
            
            await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send({
                    ...testSweet,
                    name: "Another Sweet",
                    price: 200
                });

            const response = await request(app)
                .get("/api/sweets")
                .set('Cookie', `token=${userToken}`)
                .expect(200);
            
            expect(response.body.message).toBe("Sweets retrieved successfully");
            expect(response.body.sweets).toHaveLength(2);
            expect(response.body.sweets[0].name).toBe(testSweet.name);
            expect(response.body.sweets[1].name).toBe("Another Sweet");

            
        });

        it("should return 401 when user is not authenticated", async () => {
            await request(app)
                .get("/api/sweets")
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return empty array when no sweets exist", async () => {

            await Sweet.deleteMany({});
            const response = await request(app)
                .get("/api/sweets")
                .set('Cookie', `token=${userToken}`)
                .expect(200);
            
            expect(response.body.message).toBe("Sweets retrieved successfully");
            expect(response.body.sweets).toHaveLength(0);
        });
    });

    describe("GET /api/sweets/:id", () => {
        let sweetId: string;

        beforeEach(async () => {
            // Create a sweet first
            const response = await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send(testSweet)
                .expect(201);
            
            if (response.body.sweet && response.body.sweet._id) {
                sweetId = response.body.sweet._id;
            } else {
                throw new Error('Failed to create test sweet');
            }
        });

        it("should get a sweet by id when user is authenticated", async () => {
            const response = await request(app)
                .get(`/api/sweets/${sweetId}`)
                .set('Cookie', `token=${userToken}`)
                .expect(200);
            
            expect(response.body.message).toBe("Sweet retrieved successfully");
            expect(response.body.sweet._id).toBe(sweetId);
            expect(response.body.sweet.name).toBe(testSweet.name);
            expect(response.body.sweet.price).toBe(testSweet.price);
        });

        it("should return 401 when user is not authenticated", async () => {
            await request(app)
                .get(`/api/sweets/${sweetId}`)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should return 404 when sweet is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            await request(app)
                .get(`/api/sweets/${fakeId}`)
                .set('Cookie', `token=${userToken}`)
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toBe("Sweet not found");
                });
        });
    });

    describe("GET /api/sweets/search", () => {
        beforeEach(async () => {
            // Clear existing sweets first
            await Sweet.deleteMany({});
            
            // Create test sweets for search
            await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send({
                    name: "Chocolate Bar",
                    price: 50,
                    description: "Delicious chocolate bar",
                    image: "chocolate.jpg",
                    category: "chocolate",
                    quantity: 100
                })
                .expect(201);

            await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send({
                    name: "Caramel Toffee",
                    price: 75,
                    description: "Sweet caramel toffee",
                    image: "toffee.jpg",
                    category: "caramel",
                    quantity: 80
                })
                .expect(201);

            await request(app)
                .post("/api/sweets")
                .set('Cookie', `token=${adminToken}`)
                .send({
                    name: "Premium Chocolate",
                    price: 150,
                    description: "Premium quality chocolate",
                    image: "premium.jpg",
                    category: "chocolate",
                    quantity: 50
                })
                .expect(201);
        });

        afterEach(async () => {
            await Sweet.deleteMany({});
        });

        it("should search sweets by name when user is authenticated", async () => {
            const response = await request(app)
                .get("/api/sweets/search")
                .set('Cookie', `token=${userToken}`)
                .query({ name: "chocolate" })
                .expect(200);

            expect(response.body.message).toBe("Search completed successfully");
            expect(response.body.totalResults).toBe(2);
            expect(response.body.sweets).toHaveLength(2);
            expect(response.body.searchCriteria.name).toBe("chocolate");
            
            const sweetNames = response.body.sweets.map((sweet: any) => sweet.name);
            expect(sweetNames).toContain("Chocolate Bar");
            expect(sweetNames).toContain("Premium Chocolate");
        });

        it("should search sweets by category when user is authenticated", async () => {
            const response = await request(app)
                .get("/api/sweets/search")
                .set('Cookie', `token=${userToken}`)
                .query({ category: "caramel" })
                .expect(200);

            expect(response.body.message).toBe("Search completed successfully");
            expect(response.body.totalResults).toBe(1);
            expect(response.body.sweets).toHaveLength(1);
            expect(response.body.searchCriteria.category).toBe("caramel");
            expect(response.body.sweets[0].name).toBe("Caramel Toffee");
        });

        it("should search sweets by price range when user is authenticated", async () => {
            const response = await request(app)
                .get("/api/sweets/search")
                .set('Cookie', `token=${userToken}`)
                .query({ minPrice: 60, maxPrice: 100 })
                .expect(200);

            expect(response.body.message).toBe("Search completed successfully");
            expect(response.body.totalResults).toBe(1);
            expect(response.body.sweets).toHaveLength(1);
            expect(response.body.searchCriteria.minPrice).toBe(60);
            expect(response.body.searchCriteria.maxPrice).toBe(100);
            expect(response.body.sweets[0].name).toBe("Caramel Toffee");
        });

        it("should search sweets with multiple criteria when user is authenticated", async () => {
            const response = await request(app)
                .get("/api/sweets/search")
                .set('Cookie', `token=${userToken}`)
                .query({ 
                    name: "chocolate", 
                    category: "chocolate", 
                    maxPrice: 100 
                })
                .expect(200);

            expect(response.body.message).toBe("Search completed successfully");
            expect(response.body.totalResults).toBe(1);
            expect(response.body.sweets).toHaveLength(1);
            expect(response.body.sweets[0].name).toBe("Chocolate Bar");
        });

        it("should return empty results when no sweets match criteria", async () => {
            const response = await request(app)
                .get("/api/sweets/search")
                .set('Cookie', `token=${userToken}`)
                .query({ name: "nonexistent" })
                .expect(200);

            expect(response.body.message).toBe("Search completed successfully");
            expect(response.body.totalResults).toBe(0);
            expect(response.body.sweets).toHaveLength(0);
        });

        it("should return all sweets when no search criteria provided", async () => {
            const response = await request(app)
                .get("/api/sweets/search")
                .set('Cookie', `token=${userToken}`)
                .expect(200);

            expect(response.body.message).toBe("Search completed successfully");
            expect(response.body.totalResults).toBe(3);
            expect(response.body.sweets).toHaveLength(3);
        });

        it("should return 401 when user is not authenticated", async () => {
            await request(app)
                .get("/api/sweets/search")
                .query({ name: "chocolate" })
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe("Unauthorized");
                });
        });

        it("should handle case-insensitive name search", async () => {
            const response = await request(app)
                .get("/api/sweets/search")
                .set('Cookie', `token=${userToken}`)
                .query({ name: "CHOCOLATE" })
                .expect(200);

            expect(response.body.message).toBe("Search completed successfully");
            expect(response.body.totalResults).toBe(2);
            expect(response.body.sweets).toHaveLength(2);
        });

        it("should handle partial name search", async () => {
            const response = await request(app)
                .get("/api/sweets/search")
                .set('Cookie', `token=${userToken}`)
                .query({ name: "choco" })
                .expect(200);

            expect(response.body.message).toBe("Search completed successfully");
            expect(response.body.totalResults).toBe(2);
            expect(response.body.sweets).toHaveLength(2);
        });
    });
});
