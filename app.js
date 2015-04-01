var express = require('express');
var $ = require('jquery');
var _ = require('underscore');
var app = express();

var data = {
  channels: [
  {name: "##ccis"},
  {name: "#nuhacks"}
  ]
};

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendfile("index.html");
})

app.get('/channels', function(req, res) {
  res.json(_.pluck(data.channels, 'name'));
});

app.listen(process.env.PORT || 4730);