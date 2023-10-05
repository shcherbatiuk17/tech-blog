const express = require('express');
const secretRouter = express.Router();
const { User, BlogPost, Comment } = require('../../models/BlogPost');

// GET all remarks
secretRouter.get('/', async (req, res) => {
  try {
    const remarks = await Comment.findAll({
      include: [
        {
          model: User,
        },
        {
          model: BlogPost,
        },
      ],
    });
    res.json(remarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

// GET remark by ID
secretRouter.get('/:remarkId', async (req, res) => {
  const { remarkId } = req.params;

  try {
    const remark = await Comment.findByPk(remarkId, {
      include: [
        {
          model: User,
        },
        {
          model: BlogPost,
        },
      ],
    });

    if (!remark) {
      return res.status(404).json({ message: 'Remark not found' });
    }

    res.json(remark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

// POST add new remark
secretRouter.post('/blogpost/:postRemarkId', async (req, res) => {
  const { remark_text, user_id } = req.body;
  const { postRemarkId } = req.params;

  try {
    const blogEntry = await BlogPost.findByPk(postRemarkId);

    if (!blogEntry) {
      return res.status(404).json({ message: 'Blog entry not found' });
    }

    const newRemark = await Comment.create({
      remark_text,
      user_id: req.session.user_id,
      blogpost_id: postRemarkId,
    });

    res.status(201).json(newRemark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

// PUT revise remark by ID
secretRouter.put('/:remarkId', async (req, res) => {
  const { remarkId } = req.params;
  const { updated_remark_text } = req.body;

  try {
    const remark = await Comment.findByPk(remarkId);

    if (!remark) {
      return res.status(404).json({ message: 'Remark not found' });
    }

    remark.remark_text = updated_remark_text;

    await remark.save();

    res.json(remark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

// DELETE remark by ID
secretRouter.delete('/:remarkId', async (req, res) => {
  const { remarkId } = req.params;

  try {
    const remark = await Comment.findByPk(remarkId);

    if (!remark) {
      return res.status(404).json({ message: 'Remark not found' });
    }

    await remark.destroy();

    res.json({ message: 'Remark successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

module.exports = secretRouter;
