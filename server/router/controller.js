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

exports.createForm = (req, res, next) => {
  res.render('editPost');
};

exports.createPost = (req, res, next) => {
  const { title, description } = req.body;

  // Refactor: Create a configured instance of axios
  axios
    .post(
      'http://localhost:3000/api/posts',
      { title, description },
      {
        headers: { Authorization: `Bearer ${req.user.token}` },
      }
    )
    .then(response => {
      res.redirect('/');
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const { email, password } = req.body;

  axios
    .post('http://localhost:3000/api/users', {
      email,
      password,
    })
    .then(response => {
      res.redirect('/signin');
    })
    .catch(next);
};

exports.updateForm = (req, res, next) => {
  axios
    .get(`http://localhost:3000/api/posts/${req.params.id}`)
    .then(response => {
      const { post } = response.data;
      res.render('editPost', { post });
    })
    .catch(next);
};

exports.updatePost = (req, res, next) => {
  const { title, description } = req.body;

  axios
    .put(
      `http://localhost:3000/api/posts/${req.params.id}`,
      {
        title,
        description,
      },
      {
        headers: { Authorization: `Bearer ${req.user.token}` },
      }
    )
    .then(post => {
      res.redirect('/');
    })
    .catch(next);
};

exports.signin = (req, res, next) => {
  res.render('form', { route: 'login' });
};

exports.signup = (req, res, next) => {
  res.render('form', { route: 'signup' });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
