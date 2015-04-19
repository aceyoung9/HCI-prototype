$(function() {
  $("button").click(function (e) {
    var $nick_group = $(".nick");
    var nick = $("#nick-input").val();
    var $channel_group = $(".channel");
    var channels= $("#channel-input").val();
    var $alert = $(".alert");
    var $nick_alert = $(".nick.alert");
    var $channel_alert = $(".channel.alert");
    var num_regex = /\d/;
    var chars_regex = /[^a-zA-Z0-9[\]`_\-^{}|]/;
    var chan_regex = /^(#+\S+(,| )?)+$/;
    var valid = true;

    $nick_group.removeClass("has-error");
    $channel_group.removeClass("has-error");
    $alert.addClass("hidden").html("");

    if (nick.length > 16 || nick.length == 0) {
      $nick_group.addClass("has-error");
      $nick_alert.append("Nicknames must contain between 1 and 16 characters. ").removeClass("hidden");
      valid = false;
    }
    if (num_regex.test(nick[0])) {
      $nick_group.addClass("has-error");
      $nick_alert.append("Nicknames may not begin with a number. ").removeClass("hidden");
      valid = false;
    }
    if (chars_regex.test(nick)) {
      $nick_group.addClass("has-error");
      $nick_alert.append("Nicknames may only contain letters, numbers, and the special characters <code>[ ] ` _ - ^ { } |</code>. ").removeClass("hidden");
      valid = false;
    }

    if (!chan_regex.test(channels)) {
      $channel_group.addClass("has-error");
      $channel_alert.append("Please enter a space- or comma-separated list of channels. Each channel name must start with at least one <code>#</code>. ").removeClass("hidden");
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
    }
  });
});