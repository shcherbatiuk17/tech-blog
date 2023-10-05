const express = require('express');
const secretRouter = express.Router();
const { User, BlogPost, Comment } = require('../../models/BlogPost');

// GET all clients
secretRouter.get('/', async (req, res) => {
  try {
    const clients = await User.findAll();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

// GET client by ID
secretRouter.get('/:clientId', async (req, res) => {
  const { clientId } = req.params;

  try {
    const clientData = await User.findByPk(clientId, {
      include: [
        {
          model: BlogPost,
          include: [
            {
              model: Comment,
            },
          ],
        },
      ],
    });

    if (!clientData) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(clientData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

// POST create new client
secretRouter.post('/', async (req, res) => {
  const clientData = req.body;

  try {
    const newClient = await User.create(clientData);

    req.session.save(() => {
      req.session.client_id = newClient.id;
      req.session.logged_in = true;

      res.status(200).json({ client: newClient, message: 'You are now logged in!' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

// POST Client Login
secretRouter.post('/login', async (req, res) => {
  
  try {
    const clientData = await User.findOne({ where: { email: req.body.email } });

    if (!clientData) {
      res
        .status(400)
        .json({ message: 'Invalid email or password, please try again' });
      return;
    }

    const validPassword = await clientData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Invalid email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.client_id = clientData.id;
      req.session.logged_in = true;

      res.json({ client: clientData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Client Logout
secretRouter.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// PUT update client by ID
secretRouter.put('/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const clientData = req.body;

  try {
    const client = await User.findByPk(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    for (const key in clientData) {
      if (clientData.hasOwnProperty(key)) {
        client[key] = clientData[key];
      }
    }

    await client.save();

    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

// DELETE client by ID
secretRouter.delete('/:clientId', async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await User.findByPk(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await client.destroy();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server issue' });
  }
});

module.exports = secretRouter;
