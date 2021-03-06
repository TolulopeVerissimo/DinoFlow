const express = require('express');
const router = express.Router();
const { Question, User } = require('../db/models')
const { asyncHandler } = require('./utils')
/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  const questions = await Question.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    include: ['Answers', { model: User, attributes: ['username'] }],
  })
  res.render('home-page', { title: 'Questions', questions });
}));


module.exports = router;
