import React, { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ setBlogs, blogs, user, setNotification }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs([...blogs, createdBlog]);

      setNewBlog({
        title: "",
        author: "",
        url: "",
      });
      setNotification({
        message: `Blog "${createdBlog.title}" added by ${createdBlog.author}`,
        type: "success",
      });
    } catch (error) {
      console.error("Error creating blog:", error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({
      ...newBlog,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          Title:
          <input
            type="text"
            value={newBlog.title}
            name="title"
            onChange={handleChange}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={newBlog.author}
            name="author"
            onChange={handleChange}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={newBlog.url}
            name="url"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

export default BlogForm;
