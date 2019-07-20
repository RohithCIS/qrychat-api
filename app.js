var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var Chats = require('./models/messages');

require('custom-env').env(true);
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, {
  promiseLibrary: require('bluebird'),
  useNewUrlParser: true
})
  .then(() => console.log('Connection Succesful'))
  .catch((err) => console.error(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);


io.on('connection', () => {
  console.log("A User Connected");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/message/:id', (req, res) => {
  req.body.mtype = "message";
  Chats.findOneAndUpdate({ id: req.params.id }, {
    '$push': {
      'messages': req.body
    }
  }, (err, message) => {
    console.log(err)
    io.emit(req.params.id, req.body);
    res.json({ message: 'ok' });
  });
});

app.get('/messages/:id', (req, res) => {
  Chats.findOne({ id: req.params.id }, (err, chat) => {
    res.json(chat.messages);
  });
})

app.post('/join/:id', (req, res) => {
  req.body.mtype = "info";
  Chats.findOneAndUpdate({ id: req.params.id }, {
    '$push': {
      messages: req.body
    }
  }, (err, message) => {
    io.emit(req.params.id, req.body);
    res.json({ message: 'ok' });
  });
})


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
