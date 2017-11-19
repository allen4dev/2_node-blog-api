const axios = require('axios');

// Refactor: Change to async/await
exports.test = (req, res, next) => {
  // Refactor: Create a client
  axios
    .get('http://localhost:3000/api/posts')
    .then(response => {
      const { posts } = response.data;
      res.render('index', {
        title: 'Home',
        posts,
      });
    })
    .catch(next);
};
