import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders blog title and author, but not URL or likes by default', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test-url.com',
    likes: 42,
    user: {
      id: 'test-user-id',
    },
  };

  const user = {
    id: 'test-user-id',
  };

  render(<Blog blog={blog} user={user} />);

  expect(screen.getByText(/Test Blog/)).toBeInTheDocument();
  expect(screen.getByText(/Test Author/)).toBeInTheDocument();

  expect(screen.queryByText(/http:\/\/test-url\.com/)).toBeNull();
  expect(screen.queryByText('Likes: 42')).toBeNull();
});

test('blog URL and number of likes are shown when the button is clicked', async() => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test-url.com',
    likes: 42,
    user: {
      id: 'test-user-id',
    },
  };

  const user = {
    id: 'test-user-id',
  };

  render(<Blog blog={blog} user={user} />);
  expect(screen.queryByText(/http:\/\/test-url\.com/)).toBeNull();
  expect(screen.queryByText(/Likes: 42/)).toBeNull();
  const users = userEvent.setup()

  const viewButton = screen.getByText('View');
  await users.click(viewButton);

  expect(screen.getByText(/http:\/\/test-url\.com/)).toBeInTheDocument();
  expect(screen.getByText(/Likes: 42/)).toBeInTheDocument();
});

test('like button click calls the event handler twice', async() => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test-url.com',
    likes: 42,
    user: {
      id: 'test-user-id',
    },
  };

  const user = {
    id: 'test-user-id',
  };

  const handleLike = jest.fn();

  render(<Blog blog={blog} user={user} handleLike={handleLike} />);
  const users = userEvent.setup()

  const viewButton = screen.getByText('View');
  await users.click(viewButton);

  const likeButton = screen.getByText('Like');
  await users.click(likeButton);
  await users.click(likeButton);

  expect(handleLike).toHaveBeenCalledTimes(2);
});
