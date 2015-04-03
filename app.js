var express = require('express');
var _ = require('underscore');
var moment = require('moment');
var app = express();

var data = {
  channels: [
  {
    name: "##ccis",
    users: ["somealumni", "molly", "alice"],
    activity: [
    {
      user: "somealumni",
      timestamp: moment('02-04-2015 10:00:00', 'DD-MM-YYYY HH:mm:ss'),
      type: "message",
      content: "Bushwick gentrify fixie, normcore scenester mixtape fingerstache"
    },
    {
      user: "molly",
      timestamp: moment('02 Apr 2015 10:01:00', 'DD-MM-YYYY HH:mm:ss'),
      type: "message",
      content: "3 wolf moon bitters plaid Intelligentsia cold-pressed Neutra sriracha stumptown"
    }
    ]
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

app.get('/activity/:channel/all', function(req, res) {
  var channel = _.findWhere(data.channels, {name: req.params.channel})
  if (!channel) {
    res.statusCode = 404;
    return res.send('No channel "' + req.params.channel + '" found.')
  }
  res.json(_.pick(channel, 'name', 'activity'));
});

app.listen(process.env.PORT || 4730);