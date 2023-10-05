const secretRouter = require("express").Router();
const { User, BlogPost, Comment } = require("../models/BlogPost");

// GET home page - Display all blog posts and their associated data
secretRouter.get("/", async (req, res) => {
  try {
    const postData = await BlogPost.findAll({
      include: [
        {
          model: User, // Include the author of the blog post
          attributes: ["alias"],
        },
        {
          model: Comment, // Include comments for each blog post
          attributes: ["comment_text", "created_at"], // Include the comment and created_at attributes
          include: [
            {
              model: User, // Include the commenter's information
              attributes: ["alias"],
            },
          ],
        },
      ],
    });

    const posts = postData.map(post => post.get({ plain: true }))

    res.render("home", { 
        posts,
        loggedIn: req.session.loggedIn,
        userId: req.session.userId, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET login page
secretRouter.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to the home route
    if (req.session.loggedIn) {
      res.redirect('/home');
      return;
    }
  
    res.render('login');
  });

// GET dashboard page
secretRouter.get("/dashboard", async (req, res) => {
  try {
    const userId = req.session.userId; // Get the logged-in user's ID from the session
    const postData = await BlogPost.findAll({
      where: {
        user_id: userId, // Fetch only the blog posts created by the logged-in user
      },
    });

    const posts = postData.map(post => post.get({ plain: true }));

    // Fetch the user's alias using their userId
    const userInstance = await User.findOne({
      where: {
        id: userId,
      },
    });

    // Get the user's alias
    const userAlias = userInstance.alias;

    res.render("dashboard", {
      userAlias, // Pass the user's alias
      posts,
      loggedIn: req.session.loggedIn, // Pass the loggedIn flag from the session
      userId: userId // Pass the userId to the template
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = secretRouter;
