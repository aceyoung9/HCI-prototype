$(function() {
  var channels_source = $("#channels-template").html();
  var channels_template = Handlebars.compile(channels_source);
  var channels_promise = $.getJSON('http://localhost:4730/channels')
  channels_promise.done( function(data) {
    var channels_html = channels_template(data);
    $("section.channels-column ul").append(channels_html);
  })
});