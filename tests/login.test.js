import { app } from "../app";
import User from "../models/users";
import supertest from "supertest";
import mongoose from "mongoose";
import { config } from 'dotenv';

config();

const { DB_HOST_TEST } = process.env;

describe("login", () => {
    beforeAll(async () => {
        await mongoose.connect(DB_HOST_TEST);

        await User.deleteMany();
    });

    afterAll(async () => {
        await mongoose.disconnect(DB_HOST_TEST);
    });

    it("response should have status code 200", async () => {
        await supertest(app).post("/api/users/register").send({
            email: "testUser1@gmail.com",
            password: "test1",
        });

        const response = await supertest(app).post("/api/users/login").send({
            email: "testUser1@gmail.com",
            password: "test1",
        });
        expect(response.statusCode).toBe(200);
    });

    it("response should have token", async () => {
        await supertest(app).post("/api/users/register").send({
            email: "testUser1@gmail.com",
            password: "test1",
        });

        const response = await supertest(app).post("/api/users/login").send({
            email: "testUser1@gmail.com",
            password: "test1",
        });
        expect(response.body.token).toBeDefined();
    });

    it('response should have object user with two fields: email and subscription with type String', async () => {
        await supertest(app).post("/api/users/register").send({
            email: "testUser1@gmail.com",
            password: "test1",
        });

        const response = await supertest(app).post("/api/users/login").send({
            email: "testUser1@gmail.com",
            password: "test1",
        });
        expect(typeof response.body.user.email && typeof response.body.user.subscription).toBe('string');
    });
});

