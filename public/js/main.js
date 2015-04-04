$(function() {
  var channels_source = $("#channels-template").html();
  var users_source = $("#users-template").html();
  var chat_source = $("#chat-template").html();
  
  var channels_template = Handlebars.compile(channels_source);
  var users_template = Handlebars.compile(users_source);
  var chat_template = Handlebars.compile(chat_source);

  var channels_promise = $.getJSON('http://localhost:4730/channels')

  channels_promise.done( function(channel_data) {
    var channels_html = channels_template(channel_data);
    $("section.channels-column ul").append(channels_html);

    var users_promise = $.getJSON('http://localhost:4730/users/' +
      encodeURIComponent(channel_data[0]) );
    
    users_promise.done( function(user_data) {
      var users_html = users_template(user_data);
      $("section.users-column ul").append(users_html);
    })

    var chat_promise = $.getJSON('http://localhost:4730/activity/' +
      encodeURIComponent(channel_data[0]) + '/all' );
    
    chat_promise.done( function(chat_data) {
      var chat_html = chat_template(chat_data);
      $("div.chat-wrapper").append(chat_html);
    })

  })
});

Handlebars.registerHelper('time', function(timeStr) {
  var date = moment(timeStr);
  return '<time datetime="' + timeStr + '">' + date.format("HH:mm") + '</time>';
});

Handlebars.registerHelper('make_message', function(act) {
  var date = moment(act.timestamp);
  var message_classes = 'message';
  var message = '';
  switch (act.type) {
    case 'join':
      message_classes += ' action';
      message = 'joined';
      break;
    case 'part':
      message_classes += ' action';
      message = 'left';
      break;
    case 'quit':
      message_classes += ' action';
      message = 'quit'
      break;
    case 'message':
      message = act.content;
  }

  var html = '<div class="' + message_classes + '"><span class="from"><a href="">' +
    act.user + '</a><time datetime="' + act.timestamp + '">' + date.format("HH:mm") +
    '</time></span><span class="text">' + message + '</span></div>'
  return html;
});