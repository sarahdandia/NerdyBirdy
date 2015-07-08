/* Setup stuff... connect to Clay.io, etc and so on */

	var Clay = Clay || {};
	Clay.gameKey = "nerdybirdy";
	Clay.readyFunctions = [];
	Clay.ready = function( fn ) {
	    Clay.readyFunctions.push( fn );
	};
	( function() {
	    var clay = document.createElement("script"); clay.async = true;
	    clay.src = ( "https:" == document.location.protocol ? "https://" : "http://" ) + "clay.io/api/api.js"; 
	    var tag = document.getElementsByTagName("script")[0]; tag.parentNode.insertBefore(clay, tag);
	} )();
	$(document).ready(function() {
		Clay.ready(function() {
			var leaderboard = new Clay.Leaderboard({ id: 4227});
			$('#highscores').click(function() {
				leaderboard.show( {limit: 10});
			});
		});
  	$('#playthegame').click(function() {
  		$('html, body').animate({
          scrollTop: $('#banner').offset().top + 65}, 1000)
  	});
		$("#ContactForm").submit(function (event) {
       event.preventDefault();
       var dataStr = {
           "name": $("#FormName").val(),
           "email": $("#FormEmail").val(),
           "message": $("#FormMsg").val()
       };
       $.ajax({
           type: "POST",
           url: "sendmsg.php",
           data: dataStr,
           dataType: "json",
           async: false,
           success: function (data) {
               if (data.success) {
                   $("#FormSend").attr("value", "Thanks!");
                   $("#FormSend").attr("disabled", "disabled")
               } else {
                   $("#FormFeedback").html("<p>"+data.message+"</p>");
               }
           },
           error: function (data) {
               $("#FormFeedback").html("<p>Uh oh - Form malfunction! Try email: contact@nerdybirdygame.com</p>");
               $("#FormSend").attr("disabled", "disabled")
           }
       });
    })
  });
	WebFontConfig = {
    	google: { families: [ 'Raleway::latin' ] }
  	};
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();