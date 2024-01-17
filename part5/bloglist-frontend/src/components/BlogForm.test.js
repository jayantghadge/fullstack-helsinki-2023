import * as React from "react"
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from "@testing-library/user-event";

test('renders BlogForm component', () => {
  const handleAddBlog = jest.fn();
  const setNotification = jest.fn();
  render(<BlogForm handleAddBlog={handleAddBlog} setNotification={setNotification} />);

  expect(screen.getByText('Create a new blog')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Author')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('URL')).toBeInTheDocument();
  expect(screen.getByText('Create Blog')).toBeInTheDocument();
});

test('form submission calls handleAddBlog with the right details', async () => {
    const handleAddBlog = jest.fn();
    const setNotification = jest.fn();
    const users = userEvent.setup()
    render(<BlogForm handleAddBlog={handleAddBlog} setNotification={setNotification}/>);
    
    await users.type(screen.getByPlaceholderText('Title'), 'Test Title');
    await users.type(screen.getByPlaceholderText('Author'), 'Test Author');
    await users.type(screen.getByPlaceholderText('URL'), 'http://test-url.com');
  
    await users.click(screen.getByText('Create Blog'));
  
    expect(handleAddBlog.mock.calls).toHaveLength(1);

    expect(handleAddBlog.mock.calls[0][0].title).toBe('Test Title')
    expect(handleAddBlog.mock.calls[0][0].author).toBe('Test Author')
    expect(handleAddBlog.mock.calls[0][0].url).toBe('http://test-url.com')
  });
