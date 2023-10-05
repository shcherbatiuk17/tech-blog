const express = require('express');
const router = express.Router();
const { User, BlogPost, Comment } = require('../../models');

// Error handling function
const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
};

// GET all blog posts
router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll({
      include: [User, Comment],
    });
    res.json(blogPosts);
  } catch (error) {
    handleServerError(res, error);
  }
});

// GET blog post by ID
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const blogPost = await BlogPost.findByPk(postId, {
      include: [
        User,
        {
          model: Comment,
          include: User,
        },
      ],
    });

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blogPost);
  } catch (error) {
    handleServerError(res, error);
  }
});

// POST create new blog post
router.post('/', async (req, res) => {
  const { title, description, user_id } = req.body;

  try {
    const newBlogPost = await BlogPost.create({
      title,
      description,
      user_id,
    });

    res.status(201).json(newBlogPost);
  } catch (error) {
    handleServerError(res, error);
  }
});

// PUT update blog post by ID
router.put('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, description } = req.body;

  try {
    const blogPost = await BlogPost.findByPk(postId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blogPost.title = title;
    blogPost.description = description;

    await blogPost.save();

    res.json(blogPost);
  } catch (error) {
    handleServerError(res, error);
  }
});

// DELETE blog post by ID
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const blogPost = await BlogPost.findByPk(postId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await blogPost.destroy();

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    handleServerError(res, error);
  }
});

module.exports = router;
