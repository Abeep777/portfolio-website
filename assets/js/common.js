$(document).ready(function () {
  "use strict";

  /*-----------------------------------------------------------------
      Detect device mobile
    -------------------------------------------------------------------*/

  var isMobile = false;
  if (
    /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    $("html").addClass("touch");
    isMobile = true;
  } else {
    $("html").addClass("no-touch");
    isMobile = false;
  }

  /*-----------------------------------------------------------------
      Show/hide additional info
    -------------------------------------------------------------------*/

  $(".js-btn-toggle").on("click", function (e) {
    $(".js-show").toggle("slow");
    e.preventDefault();
  });

  /*-----------------------------------------------------------------
      Sticky sidebar
    -------------------------------------------------------------------*/

  function activeStickyKit() {
    $(".sticky-column").stick_in_parent({
      parent: ".sticky-parent",
    });

    // bootstrap col position
    $(".sticky-column")
      .on("sticky_kit:bottom", function (e) {
        $(this).parent().css("position", "static");
      })
      .on("sticky_kit:unbottom", function (e) {
        $(this).parent().css("position", "relative");
      });
  }
  activeStickyKit();

  function detachStickyKit() {
    $(".sticky-column").trigger("sticky_kit:detach");
  }

  //  stop sticky kit
  //  based on your window width

  var screen = 1200;

  var windowHeight, windowWidth;
  windowWidth = $(window).width();
  if (windowWidth < screen) {
    detachStickyKit();
  } else {
    activeStickyKit();
  }

  // windowSize
  // window resize
  function windowSize() {
    windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
    windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
  }
  windowSize();

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  $(window).on(
    "resize",
    debounce(function () {
      windowSize();
      $(document.body).trigger("sticky_kit:recalc");
      if (windowWidth < screen) {
        detachStickyKit();
      } else {
        activeStickyKit();
      }
    }, 250)
  );

  /*-----------------------------------------------------------------
      Progress bar
    -------------------------------------------------------------------*/

  function progressBar() {
    $(".progress").each(function () {
      var ctrl = new ScrollMagic.Controller();
      new ScrollMagic.Scene({
        triggerElement: ".progress",
        triggerHook: "onEnter",
        duration: 300,
      })
        .addTo(ctrl)
        .on("enter", function (e) {
          var progressBar = $(".progress-bar span");
          progressBar.each(function (indx) {
            $(this).css({
              width: $(this).attr("aria-valuenow") + "%",
              "z-index": "2",
            });
          });
        });
    });
  }

  progressBar(); //Init

  /*-----------------------------------------------------------------
      ScrollTo
    -------------------------------------------------------------------*/

  function scrollToTop() {
    var $backToTop = $(".back-to-top"),
      $showBackTotop = $(window).height();

    $backToTop.hide();

    $(window).on("scroll", function () {
      var windowScrollTop = $(window).scrollTop();
      if (windowScrollTop > $showBackTotop) {
        $backToTop.fadeIn("fast");
      } else {
        $backToTop.fadeOut("fast");
      }
    });

    $backToTop.on("click", function (e) {
      e.preventDefault();
      $(" body, html ").animate({ scrollTop: 0 }, "fast");
    });
  }

  scrollToTop(); //Init

  /*-----------------------------------------------------------------
      Switch categories & Filter mobile
    -------------------------------------------------------------------*/

  $(".select")
    .on("click", ".placeholder", function () {
      var parent = $(this).closest(".select");
      if (!parent.hasClass("is-open")) {
        parent.addClass("is-open");
        $(".select.is-open").not(parent).removeClass("is-open");
      } else {
        parent.removeClass("is-open");
      }
    })
    .on("click", "ul>li", function () {
      var parent = $(this).closest(".select");
      parent.removeClass("is-open").find(".placeholder").text($(this).text());
      parent
        .find("input[type=hidden]")
        .attr("value", $(this).attr("data-value"));

      $(".filter-item").removeClass("active");
      $(this).addClass("active");
      var selector = $(this).attr("data-filter");

      $(".js-filter-container").isotope({
        filter: selector,
      });
      return false;
    });

  /*-----------------------------------------------------------------
      Masonry
    -------------------------------------------------------------------*/

  // Portfolio
  var $portfolioMasonry = $(".js-masonry").isotope({
    itemSelector: ".gallery-grid-item",
    layoutMode: "fitRows",
    percentPosition: true,
    resizable: false,
    transitionDuration: "0.5s",
    hiddenStyle: {
      opacity: 0,
      transform: "scale(0.001)",
    },
    visibleStyle: {
      opacity: 1,
      transform: "scale(1)",
    },
    fitRows: {
      gutter: ".gutter-sizer",
    },
    masonry: {
      columnWidth: ".gallery-grid-item",
      gutter: ".gutter-sizer",
      isAnimated: true,
    },
  });

  /*-----------------------------------------------------------------
	  Tabs
    -------------------------------------------------------------------*/

  // on load of the page: switch to the currently selected tab
  var hash = document.location.hash; //var hash = window.location.hash;
  var prefix = "tab_";
  if (hash) {
    $('.nav a[href="' + hash.replace(prefix, "") + '"]').tab("show");
  }
  // Change hash for page-reload
  $("ul.nav > li > a").on("shown.bs.tab", function (e) {
    window.location.hash = e.target.hash.replace("#", "#" + prefix);
  });

  $("a[data-bs-toggle=tab]").each(function () {
    var $this = $(this);
    $this.on("shown.bs.tab", function () {
      $portfolioMasonry.isotope({
        itemSelector: ".gallery-grid-item",
        columnWidth: ".gallery-grid-item",
        gutter: ".gutter-sizer",
        isAnimated: true,
      });
    }); //end shown
  }); //end each

  /*-----------------------------------------------------------------
      Polyfill object-fit
    -------------------------------------------------------------------*/

  var $someImages = $("img.cover");
  objectFitImages($someImages);
});
