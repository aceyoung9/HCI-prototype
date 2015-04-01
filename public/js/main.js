$(function() {
  var channels_source = $("#channels-template").html();
  var users_source = $("#users-template").html();
  
  var channels_template = Handlebars.compile(channels_source);
  var users_template = Handlebars.compile(users_source);

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

  })
});