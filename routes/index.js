var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var Chats = require('../models/messages');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', (req, res) => {
  Chats.create({ id: shortid.generate() }, (err, chat) => {
    res.json(chat);
  })
});

module.exports = router;
