
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var NSReferenceProvider = require('./dbHandler.js').NSReferenceProvider;

// Express environment setup
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Setup the mongo handler
var NSReferenceGrab = new NSReferenceProvider('127.0.0.1', 27017);

// Routes 
app.get('/', function(req, res){
  NSReferenceGrab.findStuff({}, 20, function(error, docs){
    console.log('##findStuff:  ', docs[0]);
    res.render('index', {
      title: 'Papers',
      papers: docs
    });
  });
});

app.get('/count', function(req, res){
  var papersYearly = [];
  for (var i = 1896; i < 2015; i++) {
    var currentYear = "{ YEAR : '"+i+"' }";
    //var query = JSON.parse(currentYear);
    var query = { 'YEAR': i };
    console.log(JSON.stringify(query));
    var numyear = NSReferenceGrab.countQ(query, 0, function(error, docs){
      console.log('##years:  ', docs);
    });
    papersYearly.push(numyear)
  }

  console.log('###papersYearly: ', papersYearly);

  res.render('year', {
    title: 'Papers Per Year',
    papers: papersYearly
  });
});

//app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
