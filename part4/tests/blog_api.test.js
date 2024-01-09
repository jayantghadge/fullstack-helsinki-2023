const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  console.log("Before each hook executed");
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("Blog list tests", () => {
  test("returns the correct amount of blog posts in JSON format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blog posts have property id instead of _id", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });

  test("a new blog post is created successfully", async () => {
    const newBlog = {
      title: "New Blog Post",
      author: "Test Author",
      url: "http://test.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain("New Blog Post");
  });

  test("if likes property is missing, it defaults to 0", async () => {
    const newBlogWithoutLikes = {
      title: "New Blog Post Without Likes",
      author: "Test Author",
      url: "http://test.com",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlogWithoutLikes)
      .expect(201);

    expect(response.body.likes).toBeDefined();
    expect(response.body.likes).toBe(0);
  });

  test("if title is missing, responds with status code 400", async () => {
    const newBlogWithoutTitle = {
      author: "Test Author",
      url: "http://test.com",
      likes: 5,
    };

    await api.post("/api/blogs").send(newBlogWithoutTitle).expect(400);
  });

  test("if url is missing, responds with status code 400", async () => {
    const newBlogWithoutUrl = {
      title: "New Blog Post Without Url",
      author: "Test Author",
      likes: 5,
    };

    await api.post("/api/blogs").send(newBlogWithoutUrl).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
