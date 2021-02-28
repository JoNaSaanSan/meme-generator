var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const db = require('monk')('mongodb+srv://memeAdmin:memeAdmin@memescluster.0vfqo.mongodb.net/memes?retryWrites=true&w=majority');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memesRouter = require('./routes/memes');
var templatesRouter = require('./routes/templates');
var draftsRouter = require('./routes/drafts');
var apiRouter = require('./routes/api');

var app = express();

app.use(cors());

//app.use(express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: false,
}));
app.use(cookieParser());

//add DB info to the request.
app.use(function(req, res, next) {
  req.db = db;
  next();
});

//register routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/memes', memesRouter);
app.use('/templates', templatesRouter);
app.use('/drafts', draftsRouter);
app.use('/api', apiRouter);

//catch 404 and create error
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  //error only in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render error message
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;