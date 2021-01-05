const express = require('express');
const router = express.Router();
const csrf = require('csurf')
const { Question, Answer } = require('../db/models')
const { check, validationResult } = require('express-validator')

const csrfProtection = csrf({ cookie: true })

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);


/* GET users listing. */
router.get('/ask-question', csrfProtection, asyncHandler(async (req, res, next) => {
  res.render('ask-question-page', { title: 'Ask a Question', question: {}, csrfToken: req.csrfToken() })
}));

const questionValidators = [
  check('title')
    .exists({ checkFalsy: true })
    .withMessage("Please have a title."),
  check('content')
    .exists({ checkFalsy: true })
    .withMessage("Please fill out input field.")
]


router.post('/ask-question', csrfProtection, questionValidators, asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  let errors = [];

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    //I need to assign a question ID for each question that is posted ???
    await Question.create({ title, content, userId: req.session.user.id })
    // const question = await Question.findByPk() // ?????????????
    return res.redirect('/')
  } else {
    errors = validatorErrors.array().map((error) => error.msg)
  }

  res.render('ask-question-page', {
    title: 'Ask a Question',
    errors,
    csrfToken: req.csrfToken()
  })

}));

router.get('/question/:id(\\d+)', csrfProtection, asyncHandler(async (req, res, next) => {
  // const question = await Question.findByPk(req.params.id, { include: { model: Answer } })
  //const questionId = parseInt(req.params.id, 10)
  // console.log(questionId)
  //const question = await Question.findByPk(questionId)
  const question = Question.findAll()
  res.render('question', { title: 'Question', question, csrfToken: req.csrfToken() },)
}));





module.exports = router;
