$(function() {
  var channels_source = $("#channels-template").html();
  var channels_template = Handlebars.compile(channels_source);
  var channels_context = {channels: ["#ccis", "##nuhacks"]};
  var channels_html = channels_template(channels_context);
  $("section.channels-column ul").append(channels_html);
});