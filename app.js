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
    },
    {
      user: "alice",
      timestamp: moment('02 Apr 2015 10:01:30', 'DD-MM-YYYY HH:mm:ss'),
      type: "message",
      content: "single-origin coffee PBR cornhole small batch stumptown ennui"
    },
    {
      user: "alice",
      timestamp: moment('02 Apr 2015 10:02:00', 'DD-MM-YYYY HH:mm:ss'),
      type: "message",
      content: "church-key locavore four loko 90's Carles Pitchfork"
    },
    {
      user: "molly",
      timestamp: moment('02 Apr 2015 10:03:00', 'DD-MM-YYYY HH:mm:ss'),
      type: "message",
      content: "pop-up deep v bespoke, master cleanse keffiyeh organic heirloom"
    },
    {
      user: "somealumni",
      timestamp: moment('02 Apr 2015 10:03:25', 'DD-MM-YYYY HH:mm:ss'),
      type: "message",
      content: "Four loko Blue Bottle paleo, quinoa post-ironic Shoreditch banh mi kitsch VHS pickled hashtag church-key typewriter pug cred. BR Wes Anderson letterpress disrupt, pork belly master cleanse bicycle rights selfies wayfarers tilde chia umami. Tilde chillwave YOLO direct trade sriracha fanny pack. Master cleanse polaroid roof party, single-origin coffee distillery photo booth tattooed swag banh mi. Health goth Pitchfork hashtag, sustainable hella small batch paleo pour-over craft beer American Apparel narwhal trust fund mlkshk jean shorts distillery."
    },
    {
      user: "alice",
      timestamp: moment('02 Apr 2015 10:04:00', 'DD-MM-YYYY HH:mm:ss'),
      type: "message",
      content: "Portland wayfarers Carles meggings you probably haven't heard of them"
    },
    {
      user: "molly",
      timestamp: moment('02 Apr 2015 10:10:00', 'DD-MM-YYYY HH:mm:ss'),
      type: "message",
      content: " irony readymade pop-up master cleanse typewriter migas listicle"
    },
    {
      user: "molly",
      timestamp: moment('02 Apr 2015 10:10:30', 'DD-MM-YYYY HH:mm:ss'),
      type: "message",
      content: "crucifix PBR four dollar toast, hoodie chia authentic pug asymmetrical roof party vegan small batch"
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