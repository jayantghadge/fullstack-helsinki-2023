import * as React from "react"
import {  useState } from 'react'

const BlogForm = ({ setNotification, handleAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitle = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthor = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrl = (event) => {
    setUrl(event.target.value)
  }

  const handleCreateBlog = (event) => {
    event.preventDefault()
    handleAddBlog({
      title: title,
      author: author,
      url: url,
    })
    setNotification({
      message: `Blog "${title}" added by ${author}`,
      type: "success",
    });
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          Title:
          <input
            type="text"
            value={title}
            name="title"
            placeholder="Title"
            onChange={handleTitle}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={author}
            name="author"
            placeholder="Author"
            onChange={handleAuthor}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={url}
            name="url"
            placeholder="URL"
            onChange={handleUrl}
          />
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

export default BlogForm;
