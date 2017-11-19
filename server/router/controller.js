const axios = require('axios');

// Refactor: Change to async/await
exports.home = (req, res, next) => {
  // Refactor: Create a client
  axios
    .get('http://localhost:3000/api/posts')
    .then(response => {
      const { posts } = response.data;
      res.render('index', {
        title: 'Home',
        posts,
        user: req.user,
      });
    })
    .catch(next);
};

exports.signin = (req, res, next) => {
  console.log('CURRENT_USER', req.user);
  res.render('signin');
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
