import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({});

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    // Show notification when it changes
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotification({
        message: "Login Successful",
        type: "success",
      });
    } catch (exception) {
      setNotification({
        message: "Wrong username or password",
        type: "error",
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setNotification({ message: "Logout Successful", type: "success" });
    setUser(null);
    window.localStorage.removeItem("loggedBloglistUser");
  };

  const handleAddBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog);

      setBlogs([...blogs, createdBlog]);
      setNotification({
        message: `A new blog ${newBlog.title} added by ${newBlog.author}`,
        type: "success",
      });
    } catch (error) {
      console.error("Error adding blog:", error.message);
      setNotification({ message: "Error adding blog", type: "error" });
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification
          message={notification?.message || ""}
          type={notification?.type || ""}
        />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              id="username"
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              id="password"
            />
          </div>
          <button type="submit" id="login-button">
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={notification?.message || ""}
        type={notification?.type || ""}
      />

      <div style={{ display: "flex", alignItems: "center" }}>
        <p>{user.name} logged in</p>
        <button type="submit" onClick={handleLogout}>
          logout
        </button>
      </div>
      {user && (
        <BlogForm
          setBlogs={setBlogs}
          blogs={blogs}
          user={user}
          setNotification={setNotification}
        />
      )}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
