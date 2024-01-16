import React, { useState } from "react"
import "../../src/index.css"

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const confirmDelete = () => {
    const result = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )
    if (result) {
      handleDelete(blog.id)
    }
  }

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{showDetails ? "Hide" : "View"}</button>
        {user && user.username === blog.user.username && (
          <button onClick={confirmDelete}>Remove</button>
        )}
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            Likes: {blog.likes}{" "}
            <button onClick={() => handleLike(blog.id)}>Like</button>
          </p>
          {user && <p>{user.name}</p>}
        </div>
      )}
    </div>
  )
}

export default Blog
