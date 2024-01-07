const _ = require("lodash");

/* eslint-disable no-unused-vars */
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return _.sumBy(blogs, "likes");
};

const favoriteBlog = (blogs) => {
  if (_.isEmpty(blogs)) {
    return null;
  }

  const favorite = _.maxBy(blogs, "likes");

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (_.isEmpty(blogs)) {
    return null;
  }

  const blogCountByAuthor = _.countBy(blogs, "author");
  const topAuthor = _.maxBy(
    _.keys(blogCountByAuthor),
    (author) => blogCountByAuthor[author]
  );

  return {
    author: topAuthor,
    blogs: blogCountByAuthor[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (_.isEmpty(blogs)) {
    return null;
  }

  const likesByAuthor = _.groupBy(blogs, "author");
  const likesCountByAuthor = _.map(likesByAuthor, (authorBlogs, author) => ({
    author,
    likes: _.sumBy(authorBlogs, "likes"),
  }));
  const topAuthor = _.maxBy(likesCountByAuthor, "likes");

  return {
    author: topAuthor.author,
    likes: topAuthor.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
