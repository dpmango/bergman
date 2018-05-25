$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

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
    _window.on('scroll', throttle(initHeaderScroll, 25))
    _window.on('resize', debounce(initHeaderScroll, 200))

    initScrollMonitor();
    initMasks();
    initSelects();
    initReadmore();
    initLazyLoad();

    initMasonry();
    setTimeout(initMasonry, 300);
    parseSvg();
    initValidations();

    _window.on('resize', debounce(initMasonry, 200));
  }

  // _window.on('load', function(){
  //   initMasonry();
  //   parseSvg();
  // })

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
    var firstSection = _document.find('.page__content div:first-child()').outerHeight();
    // var visibleWhen = Math.floor(_document.height() / _window.height()) >  2.5
    var visibleWhen = true

    if ( pastScroll > vScroll ){
      header.addClass('is-scrolling-top');
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

  function initMasonry(shouldReload){
    $('[js-masonry]').each(function(i, masonry){
      var $masonry = $(masonry);
      var $grid;
      var masonryOption = {
        itemSelector: '.card',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 15
      }
      $grid = $masonry.masonry(masonryOption);

      if ( _window.width() < 640 ){
        $grid.masonry('destroy')
      } else {
        $grid.masonry(masonryOption);
        if ( shouldReload ){
          setTimeout(function(){
            $grid.masonry('reloadItems')
          }, 150)
        }
      }
    })
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

    if ( _document.find('.hero__image').length > 0 ){
      _document.find('.hero__image').each(function(i, el){
        var elWatcher = scrollMonitor.create( $(el) );
        // movable elements would be random
        var move1 = $(el).find('.move-1')
        // some lements imposible to move, than fade
        var fade = $(el).find('.fade');
        // base does fadeIn only
        var base = $(el).find('.anim-base').find('ellipse, path, rect, circle, polygon, polyline').get();

        //present random element
        var randomTransformValues = {
          x: [25, 40, 50, -50, 75, -40, -70, -100],
          y: [-20, 35, -35, -40, -60, -20, 80, -70],
          delay: [50,100,150,200,250]
        }

        elWatcher.enterViewport(throttle(function() {
          // set timeout to prevent flickering
          setTimeout(function(){
            move1.each(function(i, element){
              var randomX = randomTransformValues.x[Math.floor(Math.random()*randomTransformValues.y.length)]
              var randomY = randomTransformValues.y[Math.floor(Math.random()*randomTransformValues.x.length)]
              var randomDelay = randomTransformValues.delay[Math.floor(Math.random()*randomTransformValues.delay.length)]
              anime({
                targets: element,
                translateY: [randomY,0],
                translateX: [randomX,0],
                opacity: 1,
                duration: 500,
                delay: 200 + (randomDelay * 1.5),
                easing: easingSwing
              });
            })
            anime({
              targets: fade.get() ,
              opacity: 1,
              duration: 500,
              easing: easingSwing
            });

            anime({
              targets: base,
              opacity: 1,
              duration: 500,
              translateY: [50,0],
              delay: 750,
              easing: easingSwing
            });

          }, 500);

        }), 100)

      });
    }

    _document.find('.wow').each(function(i, el){

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
          // triggerBody()
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
    var header = $('.header');

    var newHeaderClass = $(newPageRawHTML).find('[js-headerClassToggler]').attr('class')
    header
      .removeClass('is-white')
      .removeClass('is-blue')
      .removeClass('is-black-fixed')
      .removeClass('is-fixed-visible')
      .removeClass('is-hidden')
      .addClass(newHeaderClass).addClass('is-back-visible');

    // populate back-link
    _document.find('.header__back').attr('href', Barba.HistoryManager.prevStatus().url)
    // console.log(Barba.HistoryManager.prevStatus().url)

    // clean up header wow styles to prevent conflicts
    header
      .removeClass('wow')
      .removeClass('wowFadeDown')
      .attr('style', '')

    // update language
    var curLang = window.location.href.split("/").splice(3, 1);
    if (curLang){
        $('.header__lang a').each(function(i,link){
            if ( $(link).hasClass(curLang) ){
                $(link).addClass('is-active')
            } else {
                $(link).removeClass('is-active')
            }
        })

    }

    var langHtml = $(newPageRawHTML).find('.header__lang').html();
    $('.header__lang').html(langHtml)

    // generic functions call
    pageReady();
    triggerBody();
    setTimeout(initScrollMonitor, 300)
    setTimeout(initMasonry(true), 300)

    iniMap();

  });

  function triggerBody(){
    // var evt = document.createEvent('Event');
    // evt.initEvent('ready', false, false);
    // window.dispatchEvent(evt);
    _window.scrollTop(1)
    _window.scroll();
    _window.resize();
  }


function initValidations(){
      ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org


  // GENERIC FUNCTIONS
  ////////////////////

  var validateErrorPlacement = function(error, element) {
    error.addClass('ui-input__validation');
    error.appendTo(element.parent("div"));
  }
  var validateHighlight = function(element) {
    $(element).parent('div').addClass("has-error");
  }
  var validateUnhighlight = function(element) {
    $(element).parent('div').removeClass("has-error");
  }
  var validateSubmitHandler = function(form) {
    $(form).addClass('loading');
    $.ajax({
      type: "POST",
      url: $(form).attr('action'),
      data: $(form).serialize(),
      success: function(response) {
        $(form).removeClass('loading');
        var data = $.parseJSON(response);
        console.log(data, data.success)
        if (data.success) {
	      $(form).find('input, textarea, select').val('');
	      $('.sucess-message-bg').addClass('is-showing');
          $('.sucess-message').text(data.message).addClass('is-showing');
          setTimeout(function(){
	         $('.sucess-message').removeClass('is-showing');
	         $('.sucess-message-bg').removeClass('is-showing');
          }, 2500);
        } else {
            $(form).find('[data-error]').html(data.message).show();
        }
      }
    });
  }

  /////////////////////
  // CONTACT FORM
  ////////////////////
  $("[js-validateContactForm]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      name: "required",
      content: "required",
      email: {
        required: true,
        email: true
      },
    },
    messages: {
      name: "This field is required",
      content: "This field is required",
      email: {
          required: "This field is required",
          email: "Email is invalid"
      },

    }
  });

  /////////////////////
  // PURPOSAL FORM
  ////////////////////
  $("[js-validatePurposal]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      name: "required",
      content: "required",
      phone: "required",
      email: {
        required: true,
        email: true
      },
      agree: "required",
    },
    messages: {
      name: "This field is required",
      content: "This field is required",
      phone: "This field is required",
      email: {
          required: "This field is required",
          email: "Email is invalid"
      },
	  agree: "This field is required",
    }
  });
}

});

///////////////
// GOOGLE MAPS
//////////////
function iniMap(){


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

function enableSendRequest() {
    var checkBox = document.getElementById("CheckDataPolicy");
    if (checkBox.checked == true){
        document.getElementById("SendRequest").disabled = false;
    } else {
       document.getElementById("SendRequest").disabled = true;
    }
}
}
