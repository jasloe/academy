// (function ($) {
// })(jQuery);


// mobile: 480px,
// modal: 600px,
// tablet: 740px,
// desktop: 980px,
// wide: 1300px,
// desktopAd: 810px,
// mobileLandscape: 480px

// headroom.js implementation
if (window.location.hash) {
  header.classList.add("headroom--unpinned");
}

var headroom = new Headroom(header, {
  tolerance: {
    down: 0,
    up: 20
  },
  offset: 100
});
headroom.init();

// show-hide hamburger menu icon; handle resizing
(function ($) {
  // add markup to region-header
  var $window = $(window);
  var $regionHeader = $("header");
  var $hamburger = $(".hamburger");
  var $body = $("body");
  var $headerOverlay = $("header");
  var $overlay = $("#overlay");
  var $hamburger = $(".hamburger");

  // resize function
  function resize() {
    if ($window.width() < 740) {
      $body.addClass("mobile");
    } else {
      $body.removeClass("mobile");
    }
  }

  // hamburger clicks
  $hamburger.on("click", function() {
    // disable scrolling
    $body.toggleClass("no-scroll");

    // change hamburger state
    $hamburger.toggleClass("is-active");

    // toggle overlay
    $headerOverlay.toggleClass("is-active");
    $overlay.toggleClass("open");
  });

  function checkMobile() {
    if ($overlay.hasClass("open") && $window.width() > 1200) {
    }
  }

  $window.resize(checkMobile);

    $window
      .resize(resize)
      .trigger('resize');
})(jQuery);
