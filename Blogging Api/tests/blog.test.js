const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("Blogging API", () => {
  let authToken;
  let blogId;

  before(async () => {
    // Authenticate a user and get an authentication token
    const userCredentials = {
      email: "user@example.com",
      password: "userPassword",
    };
    const loginResponse = await chai
      .request(app)
      .post("/user/login")
      .send(userCredentials);

    authToken = loginResponse.body.token;

    // Create a test blog
    const blogData = {
      title: "Test Blog",
      description: "This is a test blog.",
      state: "draft",
      tags: ["test", "example"],
      body: "Test blog content",
    };
    const createBlogResponse = await chai
      .request(app)
      .post("/blog/create")
      .set("Authorization", `Bearer ${authToken}`)
      .send(blogData);

    blogId = createBlogResponse.body.blog._id;
  });

  it("should register a new user", (done) => {
    const userData = {
      email: "newuser@example.com",
      first_name: "New",
      last_name: "User",
      password: "newUserPassword",
    };

    chai
      .request(app)
      .post("/user/register")
      .send(userData)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  it("should authenticate a user", (done) => {
    const userCredentials = {
      email: "user@example.com",
      password: "userPassword",
    };

    chai
      .request(app)
      .post("/user/login")
      .send(userCredentials)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        done();
      });
  });

  it("should create a new blog", (done) => {
    const blogData = {
      title: "New Blog",
      description: "This is a new blog.",
      state: "draft",
      tags: ["new", "example"],
      body: "New blog content",
    };

    chai
      .request(app)
      .post("/blog/create")
      .set("Authorization", `Bearer ${authToken}`)
      .send(blogData)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  it("should retrieve a list of published blogs", (done) => {
    chai
      .request(app)
      .get("/blog/published")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should retrieve a single blog by ID", (done) => {
    chai
      .request(app)
      .get(`/blog/view/${blogId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        done();
      });
  });

  after(async () => {
    if (blogId) {
      await chai
        .request(app)
        .delete(`/blog/delete/${blogId}`)
        .set("Authorization", `Bearer ${authToken}`);
    }
  });
});
