var express = require('express');
var _ = require('underscore');
var moment = require('moment');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendfile("index.html");
});

app.get('/channels', function(req, res) {
  var joined = _.filter(data.channels, function(chan) {
    return chan.joined;
  })
  res.json(_.map(joined, function(chan) {
    return _.pick(chan, 'name', 'slug');
  }));
});

app.get('/channel/:slug', function(req, res) {
  var channel = _.find(data.channels, function(chan) {
    return chan.slug == req.params.slug;
  });
  if (!channel) {
    res.statusCode = 404;
    return res.send('No slug "' + req.params.slug + '" found.')
  }
  res.json(channel);
});

app.get('/user', function(req, res) {
  res.json(data.nick);
})

app.get('/users/:channel', function(req, res) {
  var channel = _.findWhere(data.channels, {name: req.params.channel})
  if (!channel) {
    res.statusCode = 404;
    return res.send('No channel "' + req.params.channel + '" found.')
  }
  res.json(channel.users);
});

app.get('/activity/all', function(req, res) {
  res.json(data.channels);
});

app.listen(process.env.PORT || 4730);

var data = {
  nick: "test_user",
  channels: [
  {
    name: "##ccis",
    slug: "ccis",
    users: ["alice", "molly", "sarah", "somealumni"],
    joined: true,
    activity: [
    {
      user: "somealumni",
      timestamp: moment().subtract(10, 'minutes'),
      type: "message",
      content: "Bushwick gentrify fixie, normcore scenester mixtape fingerstache"
    },
    {
      user: "molly",
      timestamp: moment().subtract(9, 'minutes'),
      type: "message",
      content: "3 wolf moon bitters plaid Intelligentsia cold-pressed Neutra sriracha stumptown"
    },
    {
      user: "alice",
      timestamp: moment().subtract(9, 'minutes'),
      type: "message",
      content: "single-origin coffee PBR cornhole small batch stumptown ennui"
    },
    {
      user: "alice",
      timestamp: moment().subtract(8, 'minutes'),
      type: "message",
      content: "church-key locavore four loko 90's Carles Pitchfork"
    },
    {
      user: "molly",
      timestamp: moment().subtract(7, 'minutes'),
      type: "message",
      content: "pop-up deep v bespoke, master cleanse keffiyeh organic heirloom"
    },
    {
      user: "somealumni",
      timestamp: moment().subtract(7, 'minutes'),
      type: "message",
      content: "Four loko Blue Bottle paleo, quinoa post-ironic Shoreditch banh mi kitsch VHS pickled hashtag church-key typewriter pug cred. BR Wes Anderson letterpress disrupt, pork belly master cleanse bicycle rights selfies wayfarers tilde chia umami. Tilde chillwave YOLO direct trade sriracha fanny pack. Master cleanse polaroid roof party, single-origin coffee distillery photo booth tattooed swag banh mi. Health goth Pitchfork hashtag, sustainable hella small batch paleo pour-over craft beer American Apparel narwhal trust fund mlkshk jean shorts distillery."
    },
    {
      user: "alice",
      timestamp: moment().subtract(3, 'minutes'),
      type: "message",
      content: "Portland wayfarers Carles meggings you probably haven't heard of them"
    },
    {
      user: "molly",
      timestamp: moment().subtract(3, 'minutes'),
      type: "message",
      content: " irony readymade pop-up master cleanse typewriter migas listicle"
    },
    {
      user: "molly",
      timestamp: moment().subtract(3, 'minutes'),
      type: "message",
      content: "crucifix PBR four dollar toast, hoodie chia authentic pug asymmetrical roof party vegan small batch"
    },
    {
      user: "sarah",
      timestamp: moment().subtract(2, 'minutes'),
      type: "join"
    },
    {
      user: "molly",
      timestamp: moment().subtract(1, 'minutes'),
      type: "message",
      content: "Bicycle rights Bushwick chambray Schlitz vinyl, VHS selvage before they sold out paleo viral."
    }
    ]
  },
  {
    name: "#nuhacks",
    slug: "nuhacks",
    joined: true,
    users: ["molly", "alice"],
    activity: [
    {
      user: "molly",
      timestamp: moment().subtract(20, 'minutes'),
      type: "message",
      content: "four loko biodiesel raw denim, street art locavore small batch hoodie trust fund kale chips twee Austin Etsy organic"
    },
    {
      user: "molly",
      timestamp: moment().subtract(19, 'minutes'),
      type: "message",
      content: "Try-hard raw denim Truffaut asymmetrical"
    },
    {
      user: "alice",
      timestamp: moment().subtract(8, 'minutes'),
      type: "message",
      content: "tattooed slow-carb Carles street art hella Thundercats bespoke"
    }
    ]
  },
  {
    name: "##greek",
    slug: "greek",
    joined: false,
    users: ["adipisicing", "brooklyn", "cronut", "magna", "next_level", "synth"],
    activity: [
    {
      user: "adipisicing",
      timestamp: moment().subtract(14, 'minutes'),
      type: "message",
      content: "Portland sartorial you probably haven't heard of them"
    },
    {
      user: "adipisicing",
      timestamp: moment().subtract(13, 'minutes'),
      type: "message",
      content: "Kickstarter aesthetic voluptate gentrify"
    },
    {
      user: "synth",
      timestamp: moment().subtract(8, 'minutes'),
      type: "message",
      content: "trust fund hella odio four dollar toast"
    }
    ]
  }
  ]
};
