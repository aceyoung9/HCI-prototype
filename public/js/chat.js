$(function() {
  var channels_source = $("#channels-template").html();
  var users_source = $("#users-template").html();
  var chat_source = $("#chat-template").html();
  var input_source = $("#input-template").html();
  var frequency_source = $("#frequency-template").html();
  
  var channels_template = Handlebars.compile(channels_source);
  var users_template = Handlebars.compile(users_source);
  var chat_template = Handlebars.compile(chat_source);
  var message_template = Handlebars.compile("{{{make_message this}}}");
  var input_template = Handlebars.compile(input_source);
  var frequency_template = Handlebars.compile(frequency_source);

  var channels_promise = $.getJSON('http://prototype.mollywhite.net/channels');
  var input_promise = $.getJSON('http://prototype.mollywhite.net/user');

  channels_promise.done( function(channel_data) {
    var channels_html = channels_template(channel_data);
    var test_promise = $.getJSON('http://prototype.mollywhite.net/test');
    $("section.channels-column ul").append(channels_html);

    test_promise.done( function(test_data) {
      if (test_data == "b") {
        $(".channels-column").removeClass("a-test").addClass("b-test");
        $(".new-channel-wrapper").removeClass("a-test").addClass("b-test");
      }
    })

    var chat_promise = $.getJSON('http://prototype.mollywhite.net/activity/all' );
    
    chat_promise.done( function(chat_data) {
      var chat_html = chat_template(chat_data);
      // console.log(chat_data);
      $("div.chat-wrapper").append(chat_html);
      $(".channel." + chat_data[0].slug).removeClass("hidden");   

      var users_html = users_template(chat_data);
      $("section.users-column ul").append(users_html);
      $("div.users." + chat_data[0].slug).removeClass("hidden");

      $(".users a.report, .channel a.report").click( function(e) {
        var user = $(e.target).data("nick");
        var channel = $("div.channel:not(.hidden)").data("channel");
        var now = moment();

        $(".modal.report-user .nick").text(user);
        $(".modal.report-user .active-channel").text(channel);
        $(".modal.report-user .timestamp").html('Time: <time datetime="' + now + 
          '">' + now.format("HH:mm [on] MMMM D, YYYY") + '</time>');
        $("#report-user-modal").modal();
      });

      $(".modal.report-user button.report").click( function(e) {
        $(".modal.report-user .modal-body.report").addClass("hidden");
        $(".modal.report-user .modal-body.confirm").removeClass("hidden");
      });

      $(".modal.report-user button.okay").click( function(e) {
        $("#report-user-modal").on('hidden.bs.modal', function() {
          $(".modal.report-user .modal-body.report").removeClass("hidden");
          $(".modal.report-user .modal-body.confirm").addClass("hidden");
          $(".modal.report-user #report-comments").val("");
        }).modal("hide");
      });

      $("a.channel-link").click( function(e) {
        var target_channel = $(e.target).data('channel');
        console.log(target_channel);
        $(".channel").addClass("hidden");
        $(".channel." + target_channel).removeClass("hidden");
        $("div.users").addClass("hidden");
        $("div.users." + target_channel).removeClass("hidden");
      });

      $(".add-channel input").keyup(function (e) {
        var val = $(e.target).val();
        var stripped = val.replace(/\s+/g, '');
        $(".add-channel li.list-group-item").addClass("hidden");

        if (stripped == '' || stripped == '#') {
          // Show default channels
          $(".add-channel li.list-group-item.top-channel").removeClass("hidden");
        }
        else if (stripped == '##') {
          // Show channels starting with two hashes
          $(".add-channel li.list-group-item.two-hash").removeClass("hidden");
        }
        else if ("greekhistory".indexOf(stripped) == 0) {
          // Show ##greek and ##history
          $(".add-channel li.list-group-item.greek, .add-channel li.list-group-item.history").removeClass("hidden");
        }
        else if ("##history".indexOf(stripped) == 0 || "history".indexOf(stripped) == 0) {
          // Show #history
          $(".add-channel li.list-group-item.history").removeClass("hidden");
        }
        else if ("##greek".indexOf(stripped) == 0) {
          // Show ##greek
          $(".add-channel li.list-group-item.greek").removeClass("hidden");
        }
        else if ("#ubuntu".indexOf(stripped) == 0 || "ubuntu".indexOf(stripped) == 0) {
          // Show #ubuntu. They shouldn't be searching for this, but might as well make it full-featured...
          $(".add-channel li.list-group-item.ubuntu").removeClass("hidden");
        }
        else if ("##feminism".indexOf(stripped) == 0 || "feminism".indexOf(stripped) == 0) {
          // Show ##feminism. They shouldn't be searching for this, but might as well make it full-featured...
          $(".add-channel li.list-group-item.feminism").removeClass("hidden");
        }
        else {
          // Show error and help prompt
          $(".add-channel li.list-group-item.cant-find").removeClass("hidden");
        }
      });

      $(".add-channel li.list-group-item").click( function(e) {
        var is_greek = $(e.currentTarget).hasClass("greek");
        if (!is_greek) {
          unimplemented();
        }
        else {
          if ($("section.channels-column a.greek").length == 0) {
            var greek_promise = $.getJSON('http://prototype.mollywhite.net/channel/greek');
            greek_promise.done( function(greek_data) {
              var $greek = $('<li><a class="channel-link ' +
                greek_data.slug + '" data-channel="' + greek_data.slug + 
                '">' + greek_data.name + '</a></li>');
              $greek.click( function(e) {
                var target_channel = $(e.target).data('channel');
                $("div.channel").addClass("hidden");
                $("div.channel." + target_channel).removeClass("hidden");
                $("div.users").addClass("hidden");
                $("div.users." + target_channel).removeClass("hidden");
              });
              $("section.channels-column ul").append($greek);
            });
            $(".channel").addClass("hidden");
            $(".channel.greek").removeClass("hidden");
            $(".users").addClass("hidden");
            $(".users.greek").removeClass("hidden");
          }
        }
      });
    });
  });

  input_promise.done( function (input_data) {
    var input_html = input_template(input_data);
    $("div.input-wrapper").append(input_html);

    /* Event handlers */
    $("button.chat-send").click(send_message);
    $("input.chat-input").keypress(function (e) {
      if (e.which == 13) {
        send_message();
        return false;
      }
    });
  });

  var frequency_html = frequency_template();
  $("select.frequency-value").append(frequency_html);

  /* Initialize tooltips */
  $('[data-toggle="tooltip"]').tooltip();

  /* Make sure modal input is cleared and in focus */
  $('#add-channel-modal').on('hidden.bs.modal', function () {
    $('#add-channel-modal input').val("").keyup();
  });
  $('#add-channel-modal').on('shown.bs.modal', function () {
    $('#add-channel-modal input').focus();
  });

  /* Initialize datepickers */
  $("#datetimepicker-start").datetimepicker({defaultDate: moment()});
  $("#datetimepicker-end").datetimepicker({defaultDate: moment().add(1, 'days')});
  $("#datetimepicker-start").on("dp.change", function(e) {
    $("#datetimepicker-end").data("DateTimePicker").minDate(e.date);
  });
  $("#datetimepicker-end").on("dp.change", function(e) {
    $("#datetimepicker-start").data("DateTimePicker").maxDate(e.date);
  });

  $(".modal.schedule .form-control").on('change dp.change keyup', function(e) {
    $(".modal.schedule button.preview").prop("disabled", false);
    $(".modal.schedule .form-control").each( function(e) {
      if ($(this).val() == "") {
        $(".modal.schedule button.preview").prop("disabled", true);
      }
    });
  });

  $(".modal.schedule button.preview").click( function(e) {
    var message = $("#message-input").val();
    var start = $("#datetimepicker-start").data("DateTimePicker").date();
    var end = $("#datetimepicker-end").data("DateTimePicker").date();
    var freq_val = $(".frequency-value").val();
    var freq_interval = $(".frequency-interval").val();

    // Escape the message
    var safe_message = escape_message(message)
    $(".modal.schedule span.message-body").html(message);
    $(".modal.schedule span.freq-value").html(freq_val);
    $(".modal.schedule span.freq-interval").html(freq_interval);
    $(".modal.schedule span.start").html(moment(new Date(start)).format("MMMM D, YYYY [at] HH:mm"));
    $(".modal.schedule span.end").html(moment(new Date(end)).format("MMMM D, YYYY [at] HH:mm"));

    $(".modal-body.entry").addClass("hidden");
    $(".modal-body.preview").removeClass("hidden");
  });

  $(".modal.schedule button.back").click( function(e) {
    $(".modal-body.preview").addClass("hidden");
    $(".modal-body.entry").removeClass("hidden");
  });

  $(".modal.schedule button.schedule").click( function(e) {
    var message = escape_message($("#message-input").val());
    $("#schedule-modal").on('hidden.bs.modal', function() {
      // Reset modal after it's fully closed
      $("#message-input").val("");
      $("#datetimepicker-start").data("DateTimePicker").date(moment());
      $("#datetimepicker-end").data("DateTimePicker").date(moment().add(1, 'days'));
      $(".frequency-value").val(1);
      $(".frequency-interval").val("hours");
      $("#message-input").change();
      $(".modal.schedule .modal-body.entry").removeClass("hidden");
      $(".modal.schedule .modal-body.preview").addClass("hidden");
      $("#schedule-modal").off();

      var now = moment();
      $("div.channel:not(.hidden) div.chat").append('<div class="message scheduled">' +
        '<span class="from"><time datetime="' + now + '">' + now.format("HH:mm") +
        '</time></span><span class="text">' + message + '</span></div>');
    }).modal('hide');
  });

  function escape_message(msg) {
    var safe_template = Handlebars.compile("{{this}}");
    var safe_message = safe_template(msg);
    return safe_message;
  }

  function send_message() {
    var $active_channel = $("div.channel:not(.hidden) div.chat");
    var $chat_wrapper = $(".chat-wrapper");
    var $input = $("input.chat-input");
    var message = $input.val();
    if (message !== '') {
      var activity = {
        user: $("label.nick").text(),
        timestamp: moment(),
        type: "message",
        content: message
      };
      var html = message_template(activity);
      $active_channel.append(html);

      $chat_wrapper.animate({scrollTop: $chat_wrapper[0].scrollHeight}, 500);
      $input.val("");
    }
  }

  function unimplemented() {
    alert("This part of the prototype is unimplemented.");
  }
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

  var html = '<div class="' + message_classes + '"><span class="from"><div class="btn-group">' +
    '<button type="button" class="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' + act.user + '</button>' +
    '<ul class="dropdown-menu" role="menu"><li><a href="#" class="report" data-nick="' + act.user + '">Report user</a></li>' +
    '</ul></div><time datetime="' + act.timestamp + '">' + date.format("HH:mm") + '</time></span><span class="text">' + message + '</span></div>';
  return html;
});

Handlebars.registerHelper('frequency', function() {
  var html = '<option value="1" selected>1</option>';
  for (var i = 2; i < 60; i++) {
    html += '<option value="' + i.toString() + '">' + i.toString() + '</option>';
  }
  return html;
});
