import request from "supertest";
import { Application } from "express";
import { AppDataSource } from "../../database/connection";
import { UserRepository } from "../../repositories/UserRepository";
import { AuthService } from "../../services/AuthService";
import { User } from "../../models/User";
import { Container } from "typedi";
import { createApp } from "../../app";

describe("UserController", () => {
  let app: Application;
  let userRepository: UserRepository;
  let authService: AuthService;

  beforeAll(async () => {
    app = await createApp();
    userRepository = Container.get(UserRepository);
    authService = Container.get(AuthService);
  });

  afterEach(async () => {
    await userRepository.delete({});
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("POST /api/user/register", () => {
    it("should register a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password",
        confirmPassword: "password",
      };

      const response = await request(app)
        .post("/api/user/register")
        .send(userData)
        .expect(201);

      expect(response.body.username).toBe(userData.username);
      expect(response.body.email).toBe(userData.email);
    });
  });

  describe("POST /api/user/login", () => {
    it("should login a user", async () => {
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: await authService.hashPassword("password"),
      });
      await userRepository.save(user);

      const loginData = {
        email: "test@example.com",
        password: "password",
      };

      const response = await request(app)
        .post("/api/user/login")
        .send(loginData)
        .expect(200);

      expect(response.body.email).toBe(user.email);
    });
  });

  describe("POST /api/user/logout", () => {
    it("should logout a user", async () => {
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: await authService.hashPassword("password"),
      });
      await userRepository.save(user);

      const loginData = {
        email: "test@example.com",
        password: "password",
      };

      const loginResponse = await request(app)
        .post("/api/user/login")
        .send(loginData)
        .expect(200);

      const jwtToken = loginResponse.headers["set-cookie"][0].split(";")[0];

      const logoutResponse = await request(app)
        .post("/api/user/logout")
        .set("Cookie", jwtToken)
        .expect(200);

      expect(logoutResponse.body.message).toBe("Successfully logged out");
    });
  });

  describe("GET /api/user", () => {
    it("should get all users", async () => {
      const user1 = new User({
        username: "testuser1",
        email: "test1@example.com",
        password: await authService.hashPassword("password"),
      });
      const user2 = new User({
        username: "testuser2",
        email: "test2@example.com",
        password: await authService.hashPassword("password"),
      });
      await userRepository.save(user1);
      await userRepository.save(user2);

      const loginData = {
        email: "test1@example.com",
        password: "password",
      };

      const loginResponse = await request(app)
        .post("/api/user/login")
        .send(loginData)
        .expect(200);

      const jwtToken = loginResponse.headers["set-cookie"][0].split(";")[0];

      const response = await request(app)
        .get("/api/user")
        .set("Cookie", jwtToken)
        .expect(200);

      expect(response.body.length).toBe(2);
    });
  });

  describe("GET /api/user/:id", () => {
    it("should get a user by id", async () => {
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: await authService.hashPassword("password"),
      });
      await userRepository.save(user);

      const loginData = {
        email: "test@example.com",
        password: "password",
      };

      const loginResponse = await request(app)
        .post("/api/user/login")
        .send(loginData)
        .expect(200);

      const jwtToken = loginResponse.headers["set-cookie"][0].split(";")[0];

      const response = await request(app)
        .get(`/api/user/${user.id}`)
        .set("Cookie", jwtToken)
        .expect(200);

      expect(response.body.id).toBe(user.id);
      expect(response.body.email).toBe(user.email);
    });
  });
});
