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

var app = express();
/*
var corsOptions = {
  origin: "http://localhost:3006"
};

app.use(cors(corsOptions));
*/

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(function(req, res, next) {
  req.db = db;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/memes', memesRouter);
app.use('/templates', templatesRouter);
app.use('/drafts', draftsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;