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

describe("'when there is initially some blogs saved", () => {
  test("returns the correct amount of blog posts in JSON format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blog posts have property id instead of _id", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });
});

describe("viewing a specific blog", () => {
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

describe("deletion of a blog", () => {
  test("Deleting an individual blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test("fails with status code 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.delete(`/api/blogs/${validNonexistingId}`).expect(404);
  });
});

describe("updating a blog", () => {
  test("Updating an individual blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

    const updatedBlogInDb = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    );
    expect(updatedBlogInDb.likes).toBe(blogToUpdate.likes + 1);
  });

  test("fails with status code 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send({ likes: 1 })
      .expect(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
