import request from "supertest";
import app from "../app";
import { connectDB } from "../db";
import mongoose from "mongoose";
import User from "../models/user.model";

const testUser = {
    email: "test@test.com",
    password: "test123"
}

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

afterAll(async () => {
    await User.deleteMany({
        email: testUser.email,
        password: testUser.password
    });
});

describe("Auth API", () => {
    
    describe("POST /api/auth/register", () => {
        it("should register a new user", async () => {
            const response = await request(app).post("/api/auth/register").send({
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
            await request(app).post("/api/auth/register").send({
                email: testUser.email,
                password: testUser.password
            }).expect(400).expect((res: any) => {
                expect(res.body.message).toBe("Email already exists");
            });
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login a user", async () => {
            const response = await request(app).post("/api/auth/login").send({
                email: testUser.email,
                password: testUser.password
            }).expect(200).expect((res: any) => {
                expect(res.body.user).toBeDefined();
                expect(res.body.user.email).toBe("test@test.com");
                expect(res.body.user.role).toBe("user");
                expect(res.cookies.token).toBeDefined();
            });
        });

        it("should return 401 if email or password is incorrect", async () => {
            await request(app).post("/api/auth/login").send({
                email: testUser.email,
                password: "wrongpassword"
            }).expect(401).expect((res: any) => {
                expect(res.body.message).toBe("Invalid email or password");
            });
        });
    });
});


