const sequelize = require('../config/connection');

const seedUser = require('./userData');
const seedBlogPost = require('./blogPostData');
const seedComment = require('./commentData');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await seedUser();
  await seedBlogPost();
  await seedComment();

  process.exit(0);
};

seedDatabase();