var express = require('express');
var app = express();

var channels = {channels: ["##ccis", "#nuhacks"]};

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendfile("index.html");
})

app.get('/channels', function(req, res) {
  res.json(channels)
});

app.listen(process.env.PORT || 4730);