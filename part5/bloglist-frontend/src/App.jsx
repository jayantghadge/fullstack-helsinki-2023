import React, { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({})
  const blogFormRef = useRef()
  const [refreshBlog, setRefreshBlog] = useState(false)

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [refreshBlog])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
      setNotification({
        message: "Login Successful",
        type: "success",
      })
    } catch (exception) {
      setNotification({
        message: "Wrong username or password",
        type: "error",
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setNotification({ message: "Logout Successful", type: "success" })
    setUser(null)
    window.localStorage.removeItem("loggedBloglistUser")
  }

  const handleAddBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()

      const returnedBlog = await blogService.create({
        ...newBlog,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
      })

      setBlogs(blogs.concat(returnedBlog))
      setRefreshBlog(!refreshBlog)

      setNotification({
        message: `A new blog ${newBlog.title} added by ${newBlog.author}`,
        type: "success",
      })
    } catch (error) {
      console.error("Error adding blog:", error.message)
      setNotification({ message: "Error adding blog", type: "error" })
    }
  }

  const handleLike = async (blogId) => {
    try {
      const blogToUpdate = blogs.find((blog) => blog.id === blogId)
      await blogService.updateLikes(blogId, blogToUpdate.likes + 1)
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog
        )
      )
      setRefreshBlog(!refreshBlog)
    } catch (error) {
      console.error("Error liking blog:", error.message)
    }
  }

  const handleDelete = async (blogId) => {
    try {
      await blogService.remove(blogId)
      setBlogs(blogs.filter((blog) => blog.id !== blogId))
      setNotification({
        message: "Blog removed successfully",
        type: "success",
      })
      setRefreshBlog(!refreshBlog)
    } catch (error) {
      console.error("Error deleting blog:", error.message)
      setNotification({ message: "Error deleting blog", type: "error" })
    }
  }

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
    )
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

      <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
        <BlogForm
          setNotification={setNotification}
          handleAddBlog={handleAddBlog}
        />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
