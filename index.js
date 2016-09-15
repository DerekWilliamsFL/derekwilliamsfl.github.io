function touchHandler(event) {
    var self = this;
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch (event.type) {
    case "touchstart":
        type = "mousedown";
        window.startY = event.pageY;
        break;
    case "touchmove":
        type = "mousemove";
        break;
    case "touchend":
        type = "mouseup";
        break;
    default:
        return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0 /*left*/ , null);
    first.target.dispatchEvent(simulatedEvent);
    var scrollables = [];
    var clickedInScrollArea = false;
    var parentEls = jQuery(event.target).parents().map(function() {
        try {
            if (jQuery(this).hasClass('is-scrollable')) {
                clickedInScrollArea = true;
                var direction = (window.startY < first.clientY) ? 'down' : 'up';
                if (((jQuery(this).scrollTop() <= 0) && (direction === 'down')) || ((jQuery(this).height() <= jQuery(this).scrollTop()) && (direction === 'up')) ){
                } else {
                    scrollables.push(this);
                }
            }
        } catch (e) {}
    });
    if ((scrollables.length === 0) && (type === 'mousemove')) {
        event.preventDefault();
    }
}



$("#sendMessage").on("click", function() {
    $.ajax({
        url: "https://formspree.io/derekwilliamsfl@gmail.com", 
        method: "POST",
        data: $("#contactform").serialize(),
        dataType: "json",
        beforeSend: function() { 
          $('#sendprogress').html("<p>Sending..</p>");
          $('#sendprogress').append("<img src='Images/email.gif'/>");
          $('#sendprogress img').css('display','block');
          $('#email-window form').css('border','none'); },
        success: function(data) {
        $('#sendprogress').html("<p>Sent!</p> ");
          $('#sendprogress').append("<img src='Images/sent.gif'/>");
          $('#sendprogress img').css('display','block');
          $('#email-window form').css('border','none'); },
        error: function(err) {
        $('#sendprogress').html("<p>Not Sent. Please try again.</p>");
          $('#sendprogress').append("<img src='Images/missed.gif'/>");
          $('#sendprogress img').css('display','block');
          $('#email-window form').css('border',''); }
    });
});

function initTouchHandler() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}
  $(document).ready(function() {
    var originalState = $("#contactform").clone();
    $.mobile.loading().hide();
    function updateTime() {
      var dNow = new Date();
      var localdate =  dNow.getHours() + ':' + dNow.getMinutes();
      $('#time').text(localdate);
    }
    function doit(selector) {
        $(selector).animate({
        'marginTop' : "+=1000px",
      }, 200, function () {
          $(selector).css('visibility', 'hidden');
        });
    };
    $(".minimize").bind('vclick', function (e){
      doit($(this).parent().parent().parent());
    });
    updateTime();
    setInterval(updateTime, 5000);
    function appendToDock(selector) {
      var imgsrc = $(selector).find('img').attr('src');
      var images = $('.docked').children('img').map(function(){
          return $(this).attr('src')
      }).get();
      if (images.indexOf(imgsrc) === -1) {
        $('.bottom-dock').append('<button class="docked"><img src=' + imgsrc + '></button>' );
      }
    };
    initTouchHandler();
    $(".application-frame").draggable({
      iframeFix: true,
      cursor: "pointer",
    });
    $(".bottom-dock").on('vclick', '.docked', function (e){
        var imgsrc = $(this).find('img').attr('src');
        var blue = $(".application-frame").find("img[src=" + "'" + imgsrc + "'" +"]").closest(".application-frame");
        var selector = "#" + blue.attr('id');
        if ($(selector).css('visibility') === 'hidden') {
          $(selector).css('visibility', 'visible');
          $(selector).animate({
        'marginTop' : "-=1000px",
      }, 200);
        }    });
    $("#email").bind('vclick', function (e){
      $("#email-window").css('visibility', 'visible');
      appendToDock(this);
    });

    $("#about-link, #drivein-link, #imdb-link, #journey-link, #sttropez-link").bind('vclick', function (e){
    	var iframe = ("#" + $(this)[0].id.split("-")[0]);
    	var iframesrc = $(this).find("a")[0].href;
    	if ($(iframe).attr('src') === '') {
    	    $(iframe).attr('src', iframesrc);
    	}
    	$(iframe + "-window").css('visibility', 'visible');
    	$(iframe + "-window iframe").css('display', 'block');
    	appendToDock(this);
    });
    		
    $(".close").bind('vclick', function (e){
      $(this).closest(".application-frame").find('.iframe').find('iframe').css('display', 'none');
      $(this).closest(".application-frame").css('visibility', 'hidden');
      var imgsrc = $(this).closest(".application-controlbar").find('img').attr('src');
      var red = $(".bottom-dock").find("img[src=" + "'" + imgsrc + "'" +"]").parent();
      red.remove();
    });
    $("#email-window .close").bind('vclick', function (e){
      $('contactform').replaceWith(originalState.clone());
      $('contactform').replaceWith(originalState);
    });
    $("#drivein-window .close").bind('vclick', function (e){
      var fillwidth = document.getElementById('drivein').contentWindow['canvasVideo'];
      if (fillwidth.playing) {
        fillwidth.pause();
      }
      $(this).closest(".application-frame").find('.iframe').find('iframe').css('display', 'none');
      $(this).closest(".application-frame").css('visibility', 'hidden');
    });
    
    var menuShown = false;
    $(".start-button").bind('vclick', function (e){
      if (menuShown === false) {
        menuShown = true;
        $(".start-menu").stop().animate({height: "+=273px"}, 200);
        
      }
      else if (menuShown === true && $(".start-button").blur()){
        menuShown = false;
        $(".start-menu").stop().animate({height: "-=273px"}, 200);
      }
    });
    $('.start-button').on('blur', (function(){
      if (menuShown === true) { 
        menuShown = false;
        $(".start-menu").stop().animate({height: "-=273px"}, 200);
      }
    })
  )
});