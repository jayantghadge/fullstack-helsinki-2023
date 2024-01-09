const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// fetching all blog records
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

// fetching specific blog using id
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

// adding a new blog
blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.title === undefined || body.url === undefined) {
    response.status(400).end();
    return;
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  const blogToSave = await blog.save();
  response.status(201).json(blogToSave);
});

// deleting a blog
blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

// updating a blog
blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  };

  const updatedBlogResult = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    { new: true }
  );
  response.json(updatedBlogResult);
});
module.exports = blogsRouter;
