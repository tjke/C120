
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var index = require('./routes/index');
//var project = require('./routes/project');
var news = require('./routes/news');
var organizations = require('./routes/organizations');
var challenge = require('./routes/challenge');
var trophies = require('./routes/trophies');
var login = require('./routes/login');
var calendar = require('./routes/calendar');
var history = require('./routes/history');
var days = require('./routes/days');
// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.get('/home', index.view); // B testing
//app.get('/project/:id', project.view);
app.get('/challenge', index.viewChallenge);
app.get('/organizations', index.viewOrgs);
app.get('/news', index.viewNews);
app.get('/trophies', index.viewTrophies);
app.get('/login', index.viewLogin);
app.get('/logout', index.view);
app.get('/calendar', index.viewCalendar);
app.get('/history', index.viewHistory);
app.get('/days.json', days.view);
//app.get('/past_A', calendar.view); // A testing
//app.get('/past_B', history.view); // B testing
app.get('/home_A', index.view2); // A testing
app.get('/home_B', index.view); // B testing
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
