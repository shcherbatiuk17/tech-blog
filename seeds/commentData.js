const { Comment } = require("../models");
const commentData = [
  {
    comment: "cool comment with comment data and comment data object   with comment data object     ",
    user_id: 1,
    blogpost_id: 1,
  },
];
const seedComment = () => Comment.bulkCreate(commentData);

module.exports = seedComment;