const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const redis = require('redis');
const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const cache = require('../middlewares/index')

router.get('/:username', cache, async (req, res, next) => {
  try {
    const { username } = req.params;
    const response = await
      fetch(`https://api.github.com/users/${username}`)
    const data = await response.json()
    const repos = data.public_repos;
    client.setex(username, 3600, repos);
    res.json({
      status: true,
      message: 'success',
      data: repos
    })
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
      data: {}
    })
  }
})
module.exports = router;