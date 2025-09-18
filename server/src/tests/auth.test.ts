import request from "supertest";
import app from "../app";
import { connectDB } from "../db";
import mongoose from "mongoose";
import User from "../models/user.model";

const testUser = {
    firstName: "test",
    lastName: "test",
    email: "test@test.com",
    password: "test123"
}

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await User.deleteMany({
        email: testUser.email
    });
    await mongoose.connection.close();
});

afterEach(async () => {
    await User.deleteOne({ email: testUser.email });
});

describe("Auth API", () => {
    
    describe("POST /api/auth/register", () => {
        it("should register a new user", async () => {
            const response = await request(app).post("/api/auth/register").send({
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email,
                password: testUser.password
            }).expect(201).expect((res: any) => {
                expect(res.body.message).toBe("User registered successfully");
                expect(res.body.user).toBeDefined();
                expect(res.body.user.email).toBe("test@test.com");
                expect(res.body.user.role).toBe("user");
            });
        });

        it("should return 400 if email is already taken", async () => {
            // First, create a user
            await request(app).post("/api/auth/register").send({
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email,
                password: testUser.password
            });

            // Then try to create another user with same email
            await request(app).post("/api/auth/register").send({
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email,
                password: testUser.password
            }).expect(400).expect((res: any) => {
                expect(res.body.message).toBe("Email already exists");
            });
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login a user", async () => {
            // First, register a user
            await request(app).post("/api/auth/register").send({
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email,
                password: testUser.password
            });

            // Then login
            const response = await request(app).post("/api/auth/login").send({
                email: testUser.email,
                password: testUser.password
            }).expect(200);
            
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe("test@test.com");
            expect(response.body.user.role).toBe("user");
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers['set-cookie'][0]).toContain('token=');
        });

        it("should return 401 if email or password is incorrect", async () => {
            // First, register a user
            await request(app).post("/api/auth/register").send({
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                email: testUser.email,
                password: testUser.password
            });

            // Then try to login with wrong password
            await request(app).post("/api/auth/login").send({
                email: testUser.email,
                password: "wrongpassword"
            }).expect(401).expect((res: any) => {
                expect(res.body.message).toBe("Invalid email or password");
            });
        });
    });
});


