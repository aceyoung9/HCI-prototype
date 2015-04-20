var express = require('express');
var _ = require('underscore');
var moment = require('moment');
var bodyParser = require("body-parser");
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var g_nick = "test_user";
var g_channels = ["##ccis", "#nuhacks"];
var g_test = "a";

app.get('/', function(req, res) {
  res.sendfile("public/landing.html");
});

app.get('/channels', function(req, res) {
  var resp = _.map(g_channels, function (chan) {
    return {name: chan, slug: chan.replace(/#/g, '')};
  })
  res.json(resp);
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
  res.json(g_nick);
})

app.get('/activity/all', function(req, res) {
  _.each(g_channels, function(chan) {
    chan_data = _.find(data.channels, function(d) {
      return d.name == chan;
    });
    if (!chan_data) {
      data.channels.push({name: chan,
        slug: chan.replace(/#/g, ''),
        joined: true,
        activity: [],
        users: [g_nick]});
    }
    else {
      chan_data.joined = true;
      chan_data.users = _.union(chan_data.users, [g_nick]);
      chan_data.users.sort();
    }
  });
  res.json(data.channels);
});

app.get('/test', function(req, res) {
  res.json(g_test);
});

app.post('/chat', function(req, res) {
  var nick = req.body.nick;
  var channels = req.body.channels;
  var num_regex = /\d/;
  var chars_regex = /[^a-zA-Z0-9[\]`_\-^{}|]/;
  var chan_regex = /^(#+\S+(,| )?)+$/;

  if (nick.length > 16 || nick.length == 0 || num_regex.test(nick[0]) || chars_regex.test(nick) || !chan_regex.test(channels)) {
    return false;
  }

  g_nick = nick;
  g_channels = channels.split(", ");
  g_test = req.body.abtest;
  res.sendfile("public/chat.html");
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
      content: "tattooed slow-carb Carles street art hella Thundercats bespoke. Dreamcatcher taxidermy organic, mumblecore American Apparel 8-bit twee kogi sustainable church-key swag. Bitters aesthetic farm-to-table, put a bird on it Etsy gluten-free quinoa listicle lumbersexual. Cardigan fanny pack swag mumblecore, lomo Wes Anderson +1 kitsch biodiesel. Organic vegan cronut, meditation stumptown Williamsburg raw denim literally Helvetica single-origin coffee"
    }
    ]
  },
  {
    name: "##greekhistory",
    slug: "greekhistory",
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
    },
    {
      user: "adipisicing",
      timestamp: moment().subtract(6, 'minutes'),
      type: "message",
      content: " Four loko PBR&B aesthetic church-key, synth Echo Park pug chia banh mi cray. Etsy listicle yr, pop-up quinoa Wes Anderson sriracha selvage Intelligentsia farm-to-table meggings. Vegan disrupt photo booth four loko, freegan twee gentrify American Apparel Carles you probably haven't heard of them Banksy artisan 90's."
    },
    {
      user: "synth",
      timestamp: moment().subtract(4, 'minutes'),
      type: "message",
      content: "Deep v organic 90's umami, small batch slow-carb aesthetic literally leggings +1 hoodie blog"
    }
    ]
  }
  ]
};
