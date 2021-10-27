const express = require('express');
const router = express.Router();

const Users = require('./users-model');
const Posts = require('../posts/posts-model');
// The middleware functions also need to be required
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');


router.get('/', (req, res, next) => {
  Users.get()
    .then(users => {
      res.json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert({ name: req.name })
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, { name: req.name })
    .then(() => {
      return Users.getById(req.params.id)
    })
    .then(updatedUser => {
      res.json(updatedUser)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try{
    await Users.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const post = await Users.getUserPosts(req.params.id)
    res.json(post)
  } catch (err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validateUser, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: 'something tragic inside posts router happened',
    message: err.message,
    stack: err.stack
  })
})

// do not forget to export the router
module.exports = router;