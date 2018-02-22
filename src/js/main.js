$(document).ready(function(){

  // HANDCRAFTED FRONT-END WITH LOVE
  // by KHMELEVSKOY & ASSOCIATES <sergey@khmelevskoy.co>
  // by request from bofer.ru
  // for Bergmann Infotech GmbH

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  // detectors
  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  if ( isMobile() ){
    $('body').addClass('is-mobile');
  }


  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 375,
    mobile: 568,
    tablet: 768,
    desktop: 1024,
    wide: 1336,
    hd: 1680
  }

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();

    initHeaderScroll();
    _window.on('scroll', throttle(initHeaderScroll, 10))
    _window.on('resize', debounce(initHeaderScroll, 200))

    initPopups();
    initScrollMonitor();
    initMasks();
    initSelects();
    initReadmore();
    initTeleport();
    initLazyLoad();

    // parseSvg();

    // development helper
    _window.on('resize', debounce(setBreakpoint, 200))
  }

  _window.on('load', function(){
    initMasonry();
    parseSvg();
  })

  pageReady();


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }

  // Prevent # behavior
	_document
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
    })


  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  var pastScroll = 0;
  function initHeaderScroll(){
    var vScroll = _window.scrollTop();
    var header = $('.header').not('.header--static');
    var headerHeight = header.height();
    var firstSection = _document.find('.page__content div:first-child()').height() - headerHeight;
    var visibleWhen = Math.floor(_document.height() / _window.height()) >  2.5

    if ( pastScroll > vScroll ){
      header.addClass('is-scrolling-top');
      console.log('is scrolling top')
    } else {
      header.removeClass('is-scrolling-top');
    }
    if (visibleWhen){
      if ( vScroll > headerHeight ){
        header.addClass('is-fixed');
      } else {
        header.removeClass('is-fixed');
      }
      if ( vScroll > firstSection ){
        header.addClass('is-fixed-visible');
      } else {
        header.removeClass('is-fixed-visible');
      }
    } else {
      header.removeClass('is-fixed-visible').removeClass('is-fixed');
    }

    pastScroll = vScroll
  }


  //////////
  // MASONRY
  //////////

  function initMasonry(){
    $('[js-masonry]').each(function(i, masonry){
      var $masonry = $(masonry);
      var $grid;
      console.log(i, $masonry)

      $grid = $masonry.masonry({
        itemSelector: '.card',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 15
      });

    })
  }


  //////////
  // MODALS
  //////////

  function initPopups(){
    // Magnific Popup
    var startWindowScroll = 0;
    // $('[js-modal-case]').magnificPopup({
    //   type: 'inline',
    //   fixedContentPos: true,
    //   fixedBgPos: true,
    //   overflowY: 'auto',
    //   closeBtnInside: true,
    //   preloader: false,
    //   midClick: true,
    //   removalDelay: 300,
    //   mainClass: 'popup-buble',
    //   callbacks: {
    //     beforeOpen: function() {
    //       startWindowScroll = _window.scrollTop();
    //       // $('html').addClass('mfp-helper');
    //     },
    //     close: function() {
    //       // $('html').removeClass('mfp-helper');
    //       _window.scrollTop(startWindowScroll);
    //     }
    //   }
    // });

  }

  function closeMfp(){
    $.magnificPopup.close();
  }

  ////////////
  // UI
  ////////////

  function initSelects(){
    $('[js-selectric]').selectric({
      maxHeight: 300
    });
  }

  function initReadmore(){
    $('[js-readmore]').readmore({
      speed: 305,
      collapsedHeight: 60,
      embedCSS: true,
      moreLink: '<a class="list-more"><span>Mehr lesen ►</span</a>',
      lessLink: '<a class="list-more"><span>Lese weniger ►</span</a>'
    });
  }

  // FLOATING LABELS
  // focus in
  _document.on('focus', '.ui-input-dynamic', function(){
    $(this).addClass('is-focused');
  })

  // focus out
  _document.on('blur', '.ui-input-dynamic', function(){
    var thisVal = $(this).find('input, textarea').val();
    if ( thisVal !== "" ){
      $(this).addClass('is-focused');
    } else {
      $(this).removeClass('is-focused');
    }
  })

  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.js-autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', '.js-autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

  // Masked input
  function initMasks(){
    $("input[type='tel']").mask("000 00000-000");
  }


  ////////////
  // TELEPORT PLUGIN
  ////////////
  function initTeleport(){
    $('[js-teleport]').each(function (i, val) {
      var self = $(val)
      var objHtml = $(val).html();
      var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
      var conditionMedia = $(val).data('teleport-condition').substring(1);
      var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

      if (target && objHtml && conditionPosition) {

        function teleport() {
          var condition;

          if (conditionPosition === "<") {
            condition = _window.width() < conditionMedia;
          } else if (conditionPosition === ">") {
            condition = _window.width() > conditionMedia;
          }

          if (condition) {
            target.html(objHtml)
            self.html('')
          } else {
            self.html(objHtml)
            target.html("")
          }
        }

        teleport();
        _window.on('resize', debounce(teleport, 100));


      }
    })
  }

  ////////////
  // SVG FUNCTIONS
  ////////////

  function parseSvg(){
    var _this = $('.header__logo svg');
    if ( _this.length > 0 ){
      addTransformOrigin(_this, 'logo-mark');
    }
  }

  function addTransformOrigin(target_el, target_class){
    var findClass = "." + target_class;
    var my_element = target_el.find(findClass);

    var bb = my_element.get(0).getBBox();
    var cx = bb.x + bb.width / 2;
    var cy = bb.y + bb.height / 2;

    var bodyStyle = "<style>"+ "." + $(target_el).parent().parent().attr('class') + " ." + target_class + " { transform-origin: "+cx + 'px ' + cy + 'px'+"; }</style>"
    $( bodyStyle ).appendTo( "body" )
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor(){
    animeHomeBg();

    function animeHomeBg(){
      var el = $('[js-animeHomeBg]')
      var elWatcher = scrollMonitor.create( el );
      var path1 = el.find('.path1');

      elWatcher.enterViewport(throttle(function() {
        // anime({
        //   targets: path1.get(0),
        //   translateY: {
        //     value: 0,
        //     duration: 500,
        //     delay: 400
        //   },
        //   rotate: -10,
        // });
      }, 100, {
        'leading': true
      }));
    }

    $('.wow').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      var delay;
      if ( $(window).width() < 768 ){
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp"

      var animationName = $(el).data('animation-name') || "wowFade"

      elWatcher.enterViewport(throttle(function() {
        $(el).addClass(animationClass);
        $(el).css({
          'animation-name': animationName,
          'animation-delay': delay,
          'visibility': 'visible'
        });
      }, 100, {
        'leading': true
      }));
      // elWatcher.exitViewport(throttle(function() {
      //   $(el).removeClass(animationClass);
      //   $(el).css({
      //     'animation-name': 'none',
      //     'animation-delay': 0,
      //     'visibility': 'hidden'
      //   });
      // }, 100));
    });

  }

  //////////
  // LAZY LOAD
  //////////
  function initLazyLoad(){
    _document.find('[js-lazy]').Lazy({
      threshold: 500,
      enableThrottle: true,
      throttle: 100,
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      effectTime: 350,
      // visibleOnly: true,
      // placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7...",
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      },
      beforeLoad: function(element){
        // element.attr('style', '')
      }
    });
  }

  // wait till image is loaded
  // var targetImage = $newContainer.find('.one-member__photo').find('[js-lazy]');
  // var targetImageLazyInstance = targetImage.Lazy({
  //   chainable: false,
  //   afterLoad: function(element) {
  //     var img = new Image();
  //     img.onload = function() {
  //       whenLazyLoaded();
  //     };
  //     img.src = element.attr('src');
  //   }
  // })
  // targetImageLazyInstance.force(targetImage);

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var easingSwing = [.02, .01, .47, 1];

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      // return $(this.oldContainer).animate({ opacity: .5 }, 200).promise();
      anime({
        targets: this.oldContainer,
        opacity : .5,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim){
          deferred.resolve();
        }
      })

      return deferred.promise
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      anime({
        targets: "html, body",
        scrollTop: 0,
        easing: easingSwing, // swing
        duration: 150
      });

      anime({
        targets: this.newContainer,
        opacity: 1,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim) {
          triggerBody()
          _this.done();
        }
      });
    }
  });


  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
    // update header class
    var newHeaderClass = $(newPageRawHTML).find('[js-headerClassToggler]').attr('class')
    _document.find('.header').removeClass('is-white, is-blue, is-black-fixed, is-fixed-visible, is-fixed, is-hidden').addClass(newHeaderClass).addClass('is-back-visible');

    // populate back-link
    _document.find('.header__back').attr('href', Barba.HistoryManager.prevStatus().url)
    // console.log(Barba.HistoryManager.prevStatus().url)

    // generic functions call
    pageReady();
    triggerBody();
    setTimeout(initMasonry, 300)

  });

  function triggerBody(num){
    $(window).scroll();
    $(window).resize();
  }

  _document.on('click', '[js-back]', function(){

  })


  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint(){
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition){
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>"+wWidth+"</div>";

      $('.page').append(content);
      setTimeout(function(){
        $('.dev-bp-debug').fadeOut();
      },1000);
      setTimeout(function(){
        $('.dev-bp-debug').remove();
      },1500)
    }
  }

});

///////////////
// GOOGLE MAPS
//////////////

if ( $('.contact-map').length > 0 ){
  google.maps.event.addDomListener(window, 'load', init);
}

var shadesOfGray = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
]

function init() {
    var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(52.940025, 9.795843),
        styles: shadesOfGray
    };


    var mapElement = document.getElementById('contact-map');
    var map = new google.maps.Map(mapElement, mapOptions);
    var markerImage = 'img/marker.png';

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(51.640071, 12.882174),
        map: map,
        icon: markerImage,
        title: 'HQ'
    });
    var marker2 = new google.maps.Marker({
        position: new google.maps.LatLng(48.726291, 9.123533),
        map: map,
        icon: markerImage,
        title: 'Stuttgart'
    });
}
