var express = require('express');
var $ = require('jquery');
var _ = require('underscore');
var app = express();

var data = {
  channels: [
  {
    name: "##ccis",
    users: ["somealumni", "molly", "alice"]
  },
  {
    name: "#nuhacks",
    users: ["molly", "alice"]
  }
  ]
};

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendfile("index.html");
})

app.get('/channels', function(req, res) {
  res.json(_.pluck(data.channels, 'name'));
});

app.get('/users/:channel', function(req, res) {
  var channel = _.findWhere(data.channels, {name: req.params.channel})
  if (!channel) {
    res.statusCode = 404;
    return res.send('No channel "' + req.params.channel + '" found.')
  }
  res.json(channel.users);
});

app.listen(process.env.PORT || 4730);