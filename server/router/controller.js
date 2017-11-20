const axios = require('axios');

// Refactor: Change to async/await
exports.home = (req, res, next) => {
  // Refactor: Create a client
  axios
    .get(`http://localhost:3000/api/users/${req.user._id}/posts`)
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
  axios
    .get('http://localhost:3000/api/categories')
    .then(response => {
      const { categories } = response.data;
      res.render('editPost', { categories });
    })
    .catch(next);
};

exports.createPost = (req, res, next) => {
  // Refactor: Create a configured instance of axios
  axios
    .post('http://localhost:3000/api/posts', req.body, {
      headers: { Authorization: `Bearer ${req.user.token}` },
    })
    .then(response => {
      res.redirect('/');
    })
    .catch(next);
};

exports.updateForm = (req, res, next) => {
  Promise.all([
    axios.get('http://localhost:3000/api/categories'),
    axios.get(`http://localhost:3000/api/posts/${req.params.id}`),
  ])
    .then(results => {
      res.render('editPost', {
        categories: results[0].data.categories,
        post: results[1].data.post,
      });
    })
    .catch(next);
};

exports.updatePost = (req, res, next) => {
  axios
    .put(`http://localhost:3000/api/posts/${req.params.id}`, req.body, {
      headers: { Authorization: `Bearer ${req.user.token}` },
    })
    .then(post => {
      res.redirect('/');
    })
    .catch(next);
};

exports.deleteForm = (req, res, next) => {
  axios
    .get(`http://localhost:3000/api/posts/${req.params.id}`)
    .then(response => {
      const { post } = response.data;
      res.render('deleteForm', { post });
    })
    .catch(next);
};

exports.deletePost = (req, res, next) => {
  axios
    .delete(`http://localhost:3000/api/posts/${req.params.id}`, {
      headers: { Authorization: `Bearer ${req.user.token}` },
    })
    .then(post => {
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

exports.getMe = (req, res, next) => {
  res.render('profile', { user: req.user });
};

exports.updateMeForm = (req, res, next) => {
  res.render('updateMe', { user: req.user });
};

exports.updateMe = (req, res, next) => {
  const { fullname, username } = req.body;

  axios
    .put(
      'http://localhost:3000/api/users',
      {
        fullname,
        username,
      },
      {
        headers: { Authorization: `Bearer ${req.user.token}` },
      },
    )
    .then(user => {
      res.redirect('/me');
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
