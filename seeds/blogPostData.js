const { BlogPost } = require('../models');
const blogPostData=[
    {
        "title": "lorem Ipsum",
        "description": "lorem Ipsum is simply dummy text in the Lorem Ips incorrectly   translated into Lorem Ips ",
        "user_id": 1
    }
]
const seedBlogPost = () => BlogPost.bulkCreate(blogPostData);

module.exports = seedBlogPost;