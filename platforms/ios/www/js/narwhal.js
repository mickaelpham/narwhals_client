(function() {
  var app;

  app = angular.module('narwhale', ['ionic', 'narwhale.report', 'narwhale.recurring']);

  app.run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
      console.log("Ready!");
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        return StatusBar.styleDefault();
      }
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      return console.log("Changed route to " + toState.url);
    });
    return $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      console.error('Could not change state');
      return console.error(error);
    });
  });

  app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('index', {
      url: '/',
      controller: 'IndexController',
      templateUrl: 'templates/index.html'
    });
    $urlRouterProvider.otherwise('/');
  });

}).call(this);

(function() {
  var slice = [].slice;

  this.BaseController = (function() {
    BaseController.register = function(app, name) {
      var ref;
      if (name == null) {
        name = this.name || ((ref = this.toString().match(/function\s*(.*?)\(/)) != null ? ref[1] : void 0);
      }
      return app.controller(name, this);
    };

    BaseController.inject = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.$inject = args;
    };

    function BaseController() {
      var args, fn, i, index, key, len, ref, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      ref = this.constructor.$inject;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        key = ref[index];
        this[key] = args[index];
      }
      ref1 = this.constructor.prototype;
      for (key in ref1) {
        fn = ref1[key];
        if (typeof fn !== 'function') {
          continue;
        }
        if ((key === 'constructor' || key === 'initialize') || key[0] === '_') {
          continue;
        }
        this.$scope[key] = (typeof fn.bind === "function" ? fn.bind(this) : void 0) || _.bind(fn, this);
      }
      if (typeof this.initialize === "function") {
        this.initialize();
      }
    }

    return BaseController;

  })();

}).call(this);

(function() {
  var recurringModule;

  recurringModule = angular.module('narwhale.recurring', []);

  recurringModule.config(function($stateProvider) {
    return $stateProvider.state('recurring', {
      url: '/recurring/',
      templateUrl: 'templates/recurring.html',
      controller: 'RecurringController',
      resolve: {
        currentTransaction: [
          '$rootScope', function($rootScope) {
            return $rootScope.currentTransaction;
          }
        ]
      }
    });
  });

}).call(this);

(function() {
  var reportModule;

  reportModule = angular.module('narwhale.report', []);

  reportModule.config(function($stateProvider) {
    return $stateProvider.state('report', {
      url: '/report/',
      templateUrl: 'templates/report.html',
      controller: 'ReportController'
    });
  });

}).call(this);

(function() {
  var IndexController, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  app = angular.module('narwhale');

  IndexController = (function(superClass) {
    extend(IndexController, superClass);

    function IndexController() {
      this.getRandomAmount = bind(this.getRandomAmount, this);
      this.loadTransactions = bind(this.loadTransactions, this);
      this.initialize = bind(this.initialize, this);
      return IndexController.__super__.constructor.apply(this, arguments);
    }

    IndexController.register(app);

    IndexController.inject('$scope', '$http', '$state', '$rootScope');

    IndexController.prototype.initialize = function() {
      return console.log(this);
    };

    IndexController.prototype.refresh = function() {
      this.loadTransactions();
      this.$scope.$broadcast('scroll.refreshComplete');
      return setTimeout(Mi.motion.fadeSlideInRight({
        selector: '.list > *'
      }), 10);
    };

    IndexController.prototype.loadTransactions = function() {
      return this.$scope.transactions = [
        {
          name: 'Arbys',
          amount: this.getRandomAmount()
        }, {
          name: 'Au Bon Pain',
          amount: this.getRandomAmount()
        }, {
          name: 'Buffalo Wild Wings',
          amount: this.getRandomAmount()
        }, {
          name: 'Burger King',
          amount: this.getRandomAmount()
        }, {
          name: 'Carls Jr.',
          amount: this.getRandomAmount()
        }, {
          name: 'Dairy Queen',
          amount: this.getRandomAmount()
        }, {
          name: 'Dominos Pizza',
          amount: this.getRandomAmount()
        }, {
          name: 'Dunkin Donuts',
          amount: this.getRandomAmount()
        }, {
          name: 'Hardees',
          amount: this.getRandomAmount()
        }, {
          name: 'KFC',
          amount: this.getRandomAmount()
        }, {
          name: 'Little Caesars',
          amount: this.getRandomAmount()
        }, {
          name: 'Long John Silvers',
          amount: this.getRandomAmount()
        }, {
          name: 'McCafé',
          amount: this.getRandomAmount()
        }, {
          name: 'McDonalds',
          amount: this.getRandomAmount()
        }, {
          name: 'Nandos',
          amount: this.getRandomAmount()
        }, {
          name: 'Pizza Hut',
          amount: this.getRandomAmount()
        }, {
          name: 'Round Table Pizza',
          amount: this.getRandomAmount()
        }, {
          name: 'Sonic Drive-In',
          amount: this.getRandomAmount()
        }, {
          name: 'Starbucks',
          amount: this.getRandomAmount()
        }, {
          name: 'Subway',
          amount: this.getRandomAmount()
        }, {
          name: 'TCBY',
          amount: this.getRandomAmount()
        }, {
          name: 'Tim Hortons',
          amount: this.getRandomAmount()
        }, {
          name: 'Taco Bell',
          amount: this.getRandomAmount()
        }, {
          name: 'Wendys',
          amount: this.getRandomAmount()
        }, {
          name: 'Wendys Supa Sundaes',
          amount: this.getRandomAmount()
        }, {
          name: 'Whataburger',
          amount: this.getRandomAmount()
        }, {
          name: 'White Castle',
          amount: this.getRandomAmount()
        }, {
          name: 'Wingstop',
          amount: this.getRandomAmount()
        }, {
          name: 'WingStree',
          amount: this.getRandomAmount()
        }
      ];
    };

    IndexController.prototype.getRandomAmount = function() {
      return Math.floor(Math.random() * 5000) / 100;
    };

    IndexController.prototype.showTransaction = function(transaction) {
      this.$rootScope.currentTransaction = transaction;
      return this.$state.go('recurring');
    };

    return IndexController;

  })(BaseController);

}).call(this);

(function() {
  var RecurringController, recurringModule,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  recurringModule = angular.module('narwhale.recurring');

  RecurringController = (function(superClass) {
    extend(RecurringController, superClass);

    function RecurringController() {
      return RecurringController.__super__.constructor.apply(this, arguments);
    }

    RecurringController.register(recurringModule);

    RecurringController.inject('$scope', '$http', '$scope', '$stateParams', 'currentTransaction');

    RecurringController.prototype.initialize = function() {
      this.$scope.hello = "World";
      return this.$scope.transaction = this.currentTransaction;
    };

    return RecurringController;

  })(BaseController);

}).call(this);

(function() {
  var ReportController, reportModule,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  reportModule = angular.module('narwhale.report');

  ReportController = (function(superClass) {
    extend(ReportController, superClass);

    function ReportController() {
      return ReportController.__super__.constructor.apply(this, arguments);
    }

    ReportController.register(reportModule);

    ReportController.inject('$scope', '$http', '$scope');

    ReportController.prototype.initialize = function() {
      this.$scope.reports = [
        {
          name: 'MyReport'
        }
      ];
      return setTimeout(function() {
        return Mi.motion.blindsDown({
          selector: '.card'
        });
      }, 500);
    };

    return ReportController;

  })(BaseController);

}).call(this);

// Extend namespace if mi is already defined
var Mi = Mi || {};


// Mi library returned from closure
Mi = (function() {

    'use strict';

    /*============================================================================*/
    /* Library Constants (EXPORT)
    /============================================================================*/

    var version = '0.0.1';


    /*============================================================================*/
    /* HELPERS (non-exports)
    /=============================================================================*
    /   Abstract common lookups and manipulations in case better alternatives
    /   arise or future cross-platform differences warrant separate handling
    /=============================================================================*/

    function getViewportHeight() {
        return window.innerHeight;
    }

    function getBoundingClientRect(domNode) {
        return domNode.getBoundingClientRect;
    }


    /*============================================================================*/
    /* MOTION (EXPORT)
    /=============================================================================*
    /   Animation methods for the library
    /=============================================================================*/

    // Hoisting the animation functions into our motion object
    var motion = {
        blindsDown: blindsDown,
        fadeSlideIn: fadeSlideIn,
        fadeSlideInRight: fadeSlideInRight,
        panInLeft: panInLeft,
        pushDown: pushDown,
        slideUp: slideUp
    };

    function blindsDown(options) {

        // Declare our defaults
        var defaults = {
            finishDelayThrottle: 2,
            finishSpeedPercent: 0.5,
            leftOffsetPercentage: 0.8,
            startVelocity: 1100
        };

        // Apply defaults if properties are not passed
        if (typeof options === 'undefined') {
            options = {};
        }

        options.finishDelayThrottle = options.finishDelayThrottle || defaults.finishDelayThrottle;
        options.finishSpeedPercent = options.finishSpeedPercent || defaults.finishSpeedPercent;
        options.leftOffsetPercentage = options.leftOffsetPercentage || defaults.leftOffsetPercentage;
        options.startVelocity = options.startVelocity || defaults.startVelocity;

        // Fail early & silently log
        var isInvalidSelector = typeof options.selector === 'undefined' || options.selector === '';

        if (isInvalidSelector) {
            console.log('invalid blindsDown selector');
            return false;
        }

        var animateBlindsDom = document.querySelectorAll(options.selector);
        var elementAnimationCount = 0;

        // Count the elements within the starting viewport so we're not exacting
        // more effort than required...
        //
        // We use css visiblity: hidden instead of display: none so the elements
        // maintain their DOM flow

        var viewportHeight = getViewportHeight();
        for (var i = 0; i < animateBlindsDom.length; i++) {
            if (animateBlindsDom[i].offsetTop < viewportHeight) {
                elementAnimationCount += 1;
                continue;
            }
            break;
        }

        // Sequentially animate with a delay based on proximity
        var speed = options.startVelocity;
        for (var i = 0; i < elementAnimationCount; i++) {
            var child = animateBlindsDom[i];
            var childOffset = child.getBoundingClientRect();
            var offset = childOffset.left * options.leftOffsetPercentage + childOffset.top;
            var delay = parseFloat(offset / speed).toFixed(2);
            child.style.webkitTransitionDelay = delay + "s";
            child.style.transitionDelay = delay + "s";
            child.className += ' in';
        }

        // When we're done animating, switch the class to 'done'
        setTimeout(function() {
            for (var i = 0; i < elementAnimationCount; i++) {
                var child = animateBlindsDom[i];
                var childOffset = child.getBoundingClientRect();
                var offset = childOffset.left * options.leftOffsetPercentage + childOffset.top;
                var delay = parseFloat(offset / speed / options.finishDelayThrottle).toFixed(2);
                child.querySelector('img').style.webkitTransitionDelay = delay + "s";
                child.querySelector('img').style.transitionDelay = delay + "s";
                //child.querySelector('img').className += ' in';
                animateBlindsDom[i].parentNode.className += ' done';
            }

        }, speed * options.finishSpeedPercent);
    }

    function fadeSlideIn(options) {

        // Declare our defaults
        var defaults = {
            finishDelayThrottle: 2,
            finishSpeedPercent: 0.72,
            leftOffsetPercentage: 0.8,
            startVelocity: 1100
        };

        // Apply defaults if properties are not passed
        if (typeof options === 'undefined') {
            options = {};
        }

        options.finishDelayThrottle = options.finishDelayThrottle || defaults.finishDelayThrottle;
        options.finishSpeedPercent = options.finishSpeedPercent || defaults.finishSpeedPercent;
        options.leftOffsetPercentage = options.leftOffsetPercentage || defaults.leftOffsetPercentage;
        options.startVelocity = options.startVelocity || defaults.startVelocity;

        // Fail early & silently log
        var isInvalidSelector = typeof options.selector === 'undefined' || options.selector === '';

        if (isInvalidSelector) {
            console.log('invalid fadeSlideIn selector');
            return false;
        }

        var animateFadeSlideInDom = document.querySelectorAll(options.selector);
        var elementAnimationCount = 0;

        // Count the elements within the starting viewport so we're not exacting
        // more effort than required...
        //
        // We use css visiblity: hidden instead of display: none so the elements
        // maintain their DOM flow

        var viewportHeight = getViewportHeight();
        for (var i = 0; i < animateFadeSlideInDom.length; i++) {
            if (animateFadeSlideInDom[i].offsetTop < viewportHeight) {
                elementAnimationCount += 1;
                continue;
            }
            break;
        }

        // Sequentially animate with a delay based on proximity
        var speed = options.startVelocity;
        for (var i = 0; i < elementAnimationCount; i++) {
            var child = animateFadeSlideInDom[i];
            var childOffset = child.getBoundingClientRect();
            var offset = childOffset.left * options.leftOffsetPercentage + childOffset.top;
            var delay = parseFloat(offset / speed).toFixed(2);
            child.style.webkitTransitionDelay = delay + "s";
            child.style.transitionDelay = delay + "s";
            child.className += ' in';
        }

        // When we're done animating, switch the class to 'done'
        setTimeout(function() {
            for (var i = 0; i < elementAnimationCount; i++) {
                var child = animateFadeSlideInDom[i];
                var childOffset = child.getBoundingClientRect();
                var offset = childOffset.left * options.leftOffsetPercentage + childOffset.top;
                var delayValue = offset / speed / options.finishDelayThrottle;
                var delay = parseFloat(delayValue).toFixed(2);
                //animateFadeSlideInDom[0].className += ' done';
                animateFadeSlideInDom[i].className += ' done';

            }

        }, speed * options.finishSpeedPercent);
    }

    function fadeSlideInRight(options) {

        // Declare our defaults
        var defaults = {
            finishDelayThrottle: 2,
            finishSpeedPercent: 0.72,
            leftOffsetPercentage: 0.8,
            startVelocity: 1100
        };

        // Apply defaults if properties are not passed
        if (typeof options === 'undefined') {
            options = {};
        }

        options.finishDelayThrottle = options.finishDelayThrottle || defaults.finishDelayThrottle;
        options.finishSpeedPercent = options.finishSpeedPercent || defaults.finishSpeedPercent;
        options.leftOffsetPercentage = options.leftOffsetPercentage || defaults.leftOffsetPercentage;
        options.startVelocity = options.startVelocity || defaults.startVelocity;

        // Fail early & silently log
        var isInvalidSelector = typeof options.selector === 'undefined' || options.selector === '';

        if (isInvalidSelector) {
            console.log('invalid fadeSlideInRight selector');
            return false;
        }

        var animateSlideInRightDom = document.querySelectorAll(options.selector);
        var elementAnimationCount = 0;

        // Count the elements within the starting viewport so we're not
        // exacting more effort than required...
        //
        // We use css visiblity: hidden instead of display: none so the
        // elements maintain their DOM flow

        var viewportHeight = getViewportHeight();
        for (var i = 0; i < animateSlideInRightDom.length; i++) {
            if (animateSlideInRightDom[i].offsetTop < viewportHeight) {
                elementAnimationCount += 1;
                continue;
            }
            break;
        }

        // Sequentially animate with a delay based on proximity
        var speed = options.startVelocity;
        for (var i = 0; i < elementAnimationCount; i++) {
            var child = animateSlideInRightDom[i];
            var childOffset = child.getBoundingClientRect();
            var offset = childOffset.left * options.leftOffsetPercentage + childOffset.top;
            var delay = parseFloat(offset / speed).toFixed(2);
            child.style.webkitTransitionDelay = delay + "s";
            child.style.transitionDelay = delay + "s";
            child.className += ' in';
        }

        // When we're done animating, switch the class to 'done'
        setTimeout(function() {
            for (var i = 0; i < elementAnimationCount; i++) {
                var child = animateSlideInRightDom[i];
                var childOffset = child.getBoundingClientRect();
                var offset = childOffset.left * options.leftOffsetPercentage + childOffset.top;
                var delayValue = offset / speed / options.finishDelayThrottle;
                var delay = parseFloat(delayValue).toFixed(2);
            }
            animateSlideInRightDom.item(0).parentNode.className += ' done';

        }, speed * options.finishSpeedPercent);
    }

    function panInLeft(options) {

        // We have a single option, so it may be passed as a string or property
        if (typeof options === 'string') {
            options = {
                selector: options
            };
        }

        // Fail early & silently log
        var isInvalidSelector = typeof options.selector === 'undefined' || options.selector === '';

        if (isInvalidSelector) {
            console.log('invalid pushDown selector');
            return false;
        }

        var animatePanInLeftDom = document.querySelectorAll(options.selector);
        var elementAnimationCount = animatePanInLeftDom.length;
        for (var i = 0; i < elementAnimationCount; i++) {
            var element = animatePanInLeftDom[i];
            var classNameToRemove = 'animate-pan-in-left';
            var indexOfClassNameToRemove = element.className.lastIndexOf(classNameToRemove);
            element.className = element.className.substr(0, indexOfClassNameToRemove);
        }
    }

    function pushDown(options) {

        // We have a single option, so it may be passed as a string or property
        if (typeof options === 'string') {
            options = {
                selector: options
            };
        }

        // Fail early & silently log
        var isInvalidSelector = typeof options.selector === 'undefined' || options.selector === '';

        if (isInvalidSelector) {
            console.log('invalid pushDown selector');
            return false;
        }

        var animatePushDownDom = document.querySelectorAll(options.selector);
        var elementAnimationCount = animatePushDownDom.length;
        for (var i = 0; i < elementAnimationCount; i++) {
            var element = animatePushDownDom[i];
            var classNameToRemove = options.selector.split('.')[1];
            var indexOfClassNameToRemove = element.className.lastIndexOf(classNameToRemove);
            element.className = element.className.substr(0, indexOfClassNameToRemove);
        }
    }

    function slideUp(options) {

        // We have a single option, so it may be passed as a string or property
        if (typeof options === 'string') {
            options = {
                selector: options
            };
        }

        // Fail early & silently log
        var isInvalidSelector = typeof options.selector === 'undefined' || options.selector === '';

        if (isInvalidSelector) {
            console.log('invalid pushDown selector');
            return false;
        }

        var animateSlideUpDom = document.querySelectorAll(options.selector);
        var elementAnimationCount = animateSlideUpDom.length;
        for (var i = 0; i < elementAnimationCount; i++) {
            var element = animateSlideUpDom[i];
            var classNameToRemove = options.selector.split('.')[1];
            var indexOfClassNameToRemove = element.className.lastIndexOf(classNameToRemove);
            element.className = element.className.substr(0, indexOfClassNameToRemove);
        }
    }

    /* Export object
    /============================================================================*/
    return {
        motion: motion,
        version: version
    }

})();

/*!
 * Waves v0.6.3
 * http://fian.my.id/Waves 
 * 
 * Copyright 2014 Alfiana E. Sibuea and other contributors 
 * Released under the MIT license 
 * https://github.com/fians/Waves/blob/master/LICENSE 
 */

;(function(window) {
    'use strict';

    var Waves = Waves || {};
    var $$ = document.querySelectorAll.bind(document);

    // Find exact position of element
    function isWindow(obj) {
        return obj !== null && obj === obj.window;
    }

    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    function offset(elem) {
        var docElem, win,
            box = {top: 0, left: 0},
            doc = elem && elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    function convertStyle(obj) {
        var style = '';

        for (var a in obj) {
            if (obj.hasOwnProperty(a)) {
                style += (a + ':' + obj[a] + ';');
            }
        }

        return style;
    }

    var Effect = {

        // Effect delay
        duration: 750,

        show: function(e, element) {

            // Disable right click
            if (e.button === 2) {
                return false;
            }

            var el = element || this;

            // Create ripple
            var ripple = document.createElement('div');
            ripple.className = 'waves-ripple';
            el.appendChild(ripple);

            // Get click coordinate and element witdh
            var pos         = offset(el);
            var relativeY   = (e.pageY - pos.top);
            var relativeX   = (e.pageX - pos.left);
            var scale       = 'scale('+((el.clientWidth / 100) * 3)+')';
            
            // Support for touch devices
            if ('touches' in e) {
              relativeY   = (e.touches[0].pageY - pos.top);
              relativeX   = (e.touches[0].pageX - pos.left);
            }

            // Attach data to element
            ripple.setAttribute('data-hold', Date.now());
            ripple.setAttribute('data-scale', scale);
            ripple.setAttribute('data-x', relativeX);
            ripple.setAttribute('data-y', relativeY);

            // Set ripple position
            var rippleStyle = {
                'top': relativeY+'px',
                'left': relativeX+'px'
            };
            
            ripple.className = ripple.className + ' waves-notransition';
            ripple.setAttribute('style', convertStyle(rippleStyle));
            ripple.className = ripple.className.replace('waves-notransition', '');

            // Scale the ripple
            rippleStyle['-webkit-transform'] = scale;
            rippleStyle['-moz-transform'] = scale;
            rippleStyle['-ms-transform'] = scale;
            rippleStyle['-o-transform'] = scale;
            rippleStyle.transform = scale;
            rippleStyle.opacity   = '1';

            rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
            rippleStyle['-moz-transition-duration']    = Effect.duration + 'ms';
            rippleStyle['-o-transition-duration']      = Effect.duration + 'ms';
            rippleStyle['transition-duration']         = Effect.duration + 'ms';

            ripple.setAttribute('style', convertStyle(rippleStyle));
        },

        hide: function(e) {
            TouchHandler.touchup(e);

            var el = this;
            var width = el.clientWidth * 1.4;
            
            // Get first ripple
            var ripple = null;
            var ripples = el.getElementsByClassName('waves-ripple');
            if (ripples.length > 0) {
                ripple = ripples[ripples.length - 1];
            } else {
                return false;
            }

            var relativeX   = ripple.getAttribute('data-x');
            var relativeY   = ripple.getAttribute('data-y');
            var scale       = ripple.getAttribute('data-scale');

            // Get delay beetween mousedown and mouse leave
            var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
            var delay = 350 - diff;

            if (delay < 0) {
                delay = 0;
            }

            // Fade out ripple after delay
            setTimeout(function() {
                var style = {
                    'top': relativeY+'px',
                    'left': relativeX+'px',
                    'opacity': '0',

                    // Duration
                    '-webkit-transition-duration': Effect.duration + 'ms',
                    '-moz-transition-duration': Effect.duration + 'ms',
                    '-o-transition-duration': Effect.duration + 'ms',
                    'transition-duration': Effect.duration + 'ms',
                    '-webkit-transform': scale,
                    '-moz-transform': scale,
                    '-ms-transform': scale,
                    '-o-transform': scale,
                    'transform': scale,
                };

                ripple.setAttribute('style', convertStyle(style));

                setTimeout(function() {
                    try {
                        el.removeChild(ripple);
                    } catch(e) {
                        return false;
                    }
                }, Effect.duration);
            }, delay);
        },

        // Little hack to make <input> can perform waves effect
        wrapInput: function(elements) {
            for (var a = 0; a < elements.length; a++) {
                var el = elements[a];
                
                if (el.tagName.toLowerCase() === 'input') {
                    var parent = el.parentNode;

                    // If input already have parent just pass through
                    if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf('waves-effect') !== -1) {
                        continue;
                    }

                    // Put element class and style to the specified parent
                    var wrapper = document.createElement('i');
                    wrapper.className = el.className + ' waves-input-wrapper';

                    var elementStyle = el.getAttribute('style');

                    if (!elementStyle) {
                        elementStyle = '';
                    }

                    wrapper.setAttribute('style', elementStyle);
                    
                    el.className = 'waves-button-input';
                    el.removeAttribute('style');

                    // Put element as child
                    parent.replaceChild(wrapper, el);
                    wrapper.appendChild(el);
                }
            }
        }
    };


    /**
     * Disable mousedown event for 500ms during and after touch
     */
    var TouchHandler = {
        /* uses an integer rather than bool so there's no issues with
         * needing to clear timeouts if another touch event occurred
         * within the 500ms. Cannot mouseup between touchstart and
         * touchend, nor in the 500ms after touchend. */
        touches: 0,
        allowEvent: function(e) {
            var allow = true;

            if (e.type === 'touchstart') {
                TouchHandler.touches += 1; //push
            } else if (e.type === 'touchend' || e.type === 'touchcancel') {
                setTimeout(function() {
                    if (TouchHandler.touches > 0) {
                        TouchHandler.touches -= 1; //pop after 500ms
                    }
                }, 500);
            } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
                allow = false;
            }

            return allow;
        },
        touchup: function(e) {
            TouchHandler.allowEvent(e);
        }
    };


    /**
     * Delegated click handler for .waves-effect element.
     * returns null when .waves-effect element not in "click tree"
     */
    function getWavesEffectElement(e) {
        if (TouchHandler.allowEvent(e) === false) {
            return null;
        }

        var element = null;
        var target = e.target || e.srcElement;

        while (target.parentElement !== null) {
            if (!(target instanceof SVGElement) && target.className.indexOf('waves-effect') !== -1) {
                element = target;
                break;
            } else if (target.classList.contains('waves-effect')) {
                element = target;
                break;
            }
            target = target.parentElement;
        }

        return element;
    }

    /**
     * Bubble the click and show effect if .waves-effect elem was found
     */
    function showEffect(e) {
        var element = getWavesEffectElement(e);

        if (element !== null) {
            Effect.show(e, element);

            if ('ontouchstart' in window) {
                element.addEventListener('touchend', Effect.hide, false);
                element.addEventListener('touchcancel', Effect.hide, false);
            }

            element.addEventListener('mouseup', Effect.hide, false);
            element.addEventListener('mouseleave', Effect.hide, false);
        }
    }

    Waves.displayEffect = function(options) {
        options = options || {};

        if ('duration' in options) {
            Effect.duration = options.duration;
        }
        
        //Wrap input inside <i> tag
        Effect.wrapInput($$('.waves-effect'));
        
        if ('ontouchstart' in window) {
            document.body.addEventListener('touchstart', showEffect, false);
        }
        
        document.body.addEventListener('mousedown', showEffect, false);
    };

    /**
     * Attach Waves to an input element (or any element which doesn't
     * bubble mouseup/mousedown events).
     *   Intended to be used with dynamically loaded forms/inputs, or
     * where the user doesn't want a delegated click handler.
     */
    Waves.attach = function(element) {
        //FUTURE: automatically add waves classes and allow users
        // to specify them with an options param? Eg. light/classic/button
        if (element.tagName.toLowerCase() === 'input') {
            Effect.wrapInput([element]);
            element = element.parentElement;
        }

        if ('ontouchstart' in window) {
            element.addEventListener('touchstart', showEffect, false);
        }

        element.addEventListener('mousedown', showEffect, false);
    };

    window.Waves = Waves;
})(window);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC5jb2ZmZWUiLCJjb250cm9sbGVyL0Jhc2VDb250cm9sbGVyLmNvZmZlZSIsInJlY3VycmluZy9SZWN1cnJpbmdNb2R1bGUuY29mZmVlIiwicmVwb3J0L1JlcG9ydE1vZHVsZS5jb2ZmZWUiLCJpbmRleC9jb250cm9sbGVyL0luZGV4Q29udHJvbGxlci5jb2ZmZWUiLCJyZWN1cnJpbmcvY29udHJvbGxlci9SZWN1cnJpbmdDb250cm9sbGVyLmNvZmZlZSIsInJlcG9ydC9jb250cm9sbGVyL1JlcG9ydENvbnRyb2xsZXIuY29mZmVlIiwibWF0ZXJpYWwtaW9uaWMuanMiLCJ3YXZlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQTtBQUFBLE1BQUEsR0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBUixDQUFlLFVBQWYsRUFBMkIsQ0FDL0IsT0FEK0IsRUFFL0IsaUJBRitCLEVBRy9CLG9CQUgrQixDQUEzQixDQUFOLENBQUE7O0FBQUEsRUFNQSxHQUFHLENBQUMsR0FBSixDQUFRLFNBQUMsY0FBRCxFQUFpQixVQUFqQixHQUFBO0FBQ04sSUFBQSxjQUFjLENBQUMsS0FBZixDQUFxQixTQUFBLEdBQUE7QUFDbkIsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFFBQVosQ0FBQSxDQUFBO0FBR0EsTUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLElBQW1CLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQTdDO0FBQ0UsUUFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBekIsQ0FBa0QsSUFBbEQsQ0FBQSxDQURGO09BSEE7QUFLQSxNQUFBLElBQUcsTUFBTSxDQUFDLFNBQVY7ZUFFRSxTQUFTLENBQUMsWUFBVixDQUFBLEVBRkY7T0FObUI7SUFBQSxDQUFyQixDQUFBLENBQUE7QUFBQSxJQVVBLFVBQVUsQ0FBQyxHQUFYLENBQWUsbUJBQWYsRUFBb0MsU0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixR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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJuYXJ3aGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIyBJb25pYyBTdGFydGVyIEFwcFxuIyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuIyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbiMgdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuIyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbiMgJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG5hcHAgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbGUnLCBbXG4gICdpb25pYydcbiAgJ25hcndoYWxlLnJlcG9ydCdcbiAgJ25hcndoYWxlLnJlY3VycmluZydcbl0pXG5cbmFwcC5ydW4oKCRpb25pY1BsYXRmb3JtLCAkcm9vdFNjb3BlKSAtPlxuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeSAtPlxuICAgIGNvbnNvbGUubG9nIFwiUmVhZHkhXCJcbiAgICAjIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAjIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiB3aW5kb3cuY29yZG92YSBhbmQgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZFxuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhciB0cnVlXG4gICAgaWYgd2luZG93LlN0YXR1c0JhclxuICAgICAgIyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KClcblxuICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlU3RhcnQnLCAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIC0+XG4gICAgY29uc29sZS5sb2cgXCJDaGFuZ2VkIHJvdXRlIHRvICN7dG9TdGF0ZS51cmx9XCJcbiAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZUVycm9yJywgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvciktPlxuICAgIGNvbnNvbGUuZXJyb3IgJ0NvdWxkIG5vdCBjaGFuZ2Ugc3RhdGUnXG4gICAgY29uc29sZS5lcnJvciBlcnJvclxuXG4pXG5cbmFwcC5jb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIC0+XG4gICMgSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gICMgTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgIyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAjIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaW5kZXgnLFxuICAgIHVybDogJy8nXG4gICAgY29udHJvbGxlcjogJ0luZGV4Q29udHJvbGxlcidcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9pbmRleC5odG1sJylcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlICcvJ1xuICByZXR1cm4iLCIjIEJhc2UgY2xhc3MgZm9yIGFuZ3VsYXIgY29udHJvbGxlcnMsIHdoaWNoIGVhc2VzIHRoZSBwcm9jZXNzIG9mIGluaXRpYWxpemF0aW9uIGFuZCBkZXBlbmRlbmN5IGluamVjdGlvbi5cbiMgVGhpcyBhcHByb2FjaCBpcyBiYXNlZCBvbiBodHRwOi8vd3d3LmRldmlnbi5tZS9hbmd1bGFyLWRvdC1qcy1jb2ZmZWVzY3JpcHQtY29udHJvbGxlci1iYXNlLWNsYXNzXG4jXG4jIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gdXNlIGl0OlxuI1xuIyBzb21lQXBwTW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ3NvbWVBcHAnXG4jXG4jIGNsYXNzIE15QXdlc29tZUNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuIyAgICMgcmVnaXN0ZXIgdGhlIGNvbnRyb2xsZXIgYXQgb3VyIG1vZHVsZVxuIyAgIEByZWdpc3RlciBzb21lQXBwTW9kdWxlXG4jICAgIyBkZXBlbmRlbmNpZXMgdG8gaW5qZWN0LCB3aWxsIGJlIGF2YWlsYWJsZSBhcyBtZW1iZXIgdmFyaWFibGUgZS5nLiBAJHNjb3BlXG4jICAgQGluamVjdCAnJHNjb3BlJywgJyRodHRwJywgJ015U2VydmljZSdcbiMgICAjIGNhbGxlZCBhZnRlciBpbnN0YW50aWF0aW9uIGlmIGV4aXN0c1xuIyAgIGluaXRpYWxpemU6IC0+XG4jICAgICAjIGluaXQgc29tZSBzdHVmZiAuLi5cbiMgICBzdWJtaXQ6IC0+XG4jICAgICAjIGJvdW5kIHRvICRzY29wZSBhbmQgdXNhYmxlIGluIHRlbXBsYXRlIGF1dG9tYXRpY2FsbHlcbiNcbiMgVE9ETzogQWRkIGNoZWNrIHRvIGVuc3VyZSAkc2NvcGUgYXMgZGVwZW5kZW5jeSB3aGVuIG9uZSBvciBtb3JlIGZ1bmN0aW9ucyBhcmUgZGVmaW5lZCBhcyB0aGV5IGFyZSBib3VuZCBhdXRvbWF0aWNhbGx5XG4jXG5jbGFzcyBAQmFzZUNvbnRyb2xsZXJcbiAgQHJlZ2lzdGVyOiAoYXBwLCBuYW1lKSAtPlxuICAgIG5hbWUgPz0gQG5hbWUgfHwgQHRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uXFxzKiguKj8pXFwoLyk/WzFdXG4gICAgYXBwLmNvbnRyb2xsZXIgbmFtZSwgQFxuXG4gIEBpbmplY3Q6IChhcmdzLi4uKSAtPlxuICAgIEAkaW5qZWN0ID0gYXJnc1xuXG4gIGNvbnN0cnVjdG9yOiAoYXJncy4uLikgLT5cbiAgICBmb3Iga2V5LCBpbmRleCBpbiBAY29uc3RydWN0b3IuJGluamVjdFxuICAgICAgQFtrZXldID0gYXJnc1tpbmRleF1cblxuICAgIGZvciBrZXksIGZuIG9mIEBjb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICAgIGNvbnRpbnVlIHVubGVzcyB0eXBlb2YgZm4gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgY29udGludWUgaWYga2V5IGluIFsnY29uc3RydWN0b3InLCAnaW5pdGlhbGl6ZSddIG9yIGtleVswXSBpcyAnXydcbiAgICAgIEAkc2NvcGVba2V5XSA9IGZuLmJpbmQ/KEApIHx8IF8uYmluZChmbiwgQClcblxuICAgIEBpbml0aWFsaXplPygpIiwicmVjdXJyaW5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25hcndoYWxlLnJlY3VycmluZycsIFtdKVxuXG5yZWN1cnJpbmdNb2R1bGUuY29uZmlnICgkc3RhdGVQcm92aWRlciktPlxuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUoJ3JlY3VycmluZycsXG4gICAgdXJsOiAnL3JlY3VycmluZy8nXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcmVjdXJyaW5nLmh0bWwnXG4gICAgY29udHJvbGxlcjogJ1JlY3VycmluZ0NvbnRyb2xsZXInXG4gICAgcmVzb2x2ZTpcbiAgICAgIGN1cnJlbnRUcmFuc2FjdGlvbjogWyckcm9vdFNjb3BlJywgKCRyb290U2NvcGUpLT5cbiAgICAgICAgcmV0dXJuICRyb290U2NvcGUuY3VycmVudFRyYW5zYWN0aW9uXG4gICAgICBdXG4gICkiLCJyZXBvcnRNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbGUucmVwb3J0JywgW10pXG5cbnJlcG9ydE1vZHVsZS5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKS0+XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSgncmVwb3J0JyxcbiAgICB1cmw6ICcvcmVwb3J0LydcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZXBvcnQuaHRtbCdcbiAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcidcbiAgKSIsImFwcCA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsZSdcblxuY2xhc3MgSW5kZXhDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXJcblxuICBAcmVnaXN0ZXIgYXBwXG4gIEBpbmplY3QgJyRzY29wZScsICckaHR0cCcsICckc3RhdGUnLCAnJHJvb3RTY29wZSdcblxuICBpbml0aWFsaXplOiAoKT0+XG4gICAgY29uc29sZS5sb2cgdGhpc1xuXG4gIHJlZnJlc2g6ICgpLT5cbiAgICBAbG9hZFRyYW5zYWN0aW9ucygpXG4gICAgQCRzY29wZS4kYnJvYWRjYXN0KCdzY3JvbGwucmVmcmVzaENvbXBsZXRlJylcbiAgICBzZXRUaW1lb3V0KE1pLm1vdGlvbi5mYWRlU2xpZGVJblJpZ2h0KHtcbiAgICAgIHNlbGVjdG9yOiAnLmxpc3QgPiAqJ1xuICAgIH0pLCAxMClcblxuICBsb2FkVHJhbnNhY3Rpb25zOiAoKT0+XG4gICAgQCRzY29wZS50cmFuc2FjdGlvbnMgPSBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdBcmJ5cydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0F1IEJvbiBQYWluJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdCdWZmYWxvIFdpbGQgV2luZ3MnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0J1cmdlciBLaW5nJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdDYXJscyBKci4nXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0RhaXJ5IFF1ZWVuJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdEb21pbm9zIFBpenphJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdEdW5raW4gRG9udXRzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdIYXJkZWVzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdLRkMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0xpdHRsZSBDYWVzYXJzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdMb25nIEpvaG4gU2lsdmVycydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnTWNDYWbDqSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnTWNEb25hbGRzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdOYW5kb3MnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1BpenphIEh1dCdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnUm91bmQgVGFibGUgUGl6emEnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1NvbmljIERyaXZlLUluJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdTdGFyYnVja3MnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1N1YndheSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnVENCWSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnVGltIEhvcnRvbnMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1RhY28gQmVsbCdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnV2VuZHlzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXZW5keXMgU3VwYSBTdW5kYWVzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXaGF0YWJ1cmdlcidcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnV2hpdGUgQ2FzdGxlJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXaW5nc3RvcCdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdXaW5nU3RyZWUnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG4gICAgICB9XG4gICAgXVxuXG4gIGdldFJhbmRvbUFtb3VudDogKCk9PlxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDAwKSAvIDEwMFxuXG4gIHNob3dUcmFuc2FjdGlvbjogKHRyYW5zYWN0aW9uKS0+XG4gICAgQCRyb290U2NvcGUuY3VycmVudFRyYW5zYWN0aW9uID0gdHJhbnNhY3Rpb25cbiAgICBAJHN0YXRlLmdvKCdyZWN1cnJpbmcnKVxuXG4iLCJyZWN1cnJpbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbGUucmVjdXJyaW5nJ1xuXG5jbGFzcyBSZWN1cnJpbmdDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXJcblxuICBAcmVnaXN0ZXIgcmVjdXJyaW5nTW9kdWxlXG4gIEBpbmplY3QgJyRzY29wZScsICckaHR0cCcsICckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ2N1cnJlbnRUcmFuc2FjdGlvbidcblxuICBpbml0aWFsaXplOiAoKS0+XG4gICAgQCRzY29wZS5oZWxsbyA9IFwiV29ybGRcIlxuICAgIEAkc2NvcGUudHJhbnNhY3Rpb24gPSBAY3VycmVudFRyYW5zYWN0aW9uXG4iLCJyZXBvcnRNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbGUucmVwb3J0J1xuXG5jbGFzcyBSZXBvcnRDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXJcblxuICBAcmVnaXN0ZXIgcmVwb3J0TW9kdWxlXG4gIEBpbmplY3QgJyRzY29wZScsICckaHR0cCcsICckc2NvcGUnXG5cbiAgaW5pdGlhbGl6ZTogKCktPlxuICAgIEAkc2NvcGUucmVwb3J0cyA9IFt7XG4gICAgICBuYW1lOidNeVJlcG9ydCdcbiAgICB9XVxuICAgIHNldFRpbWVvdXQoICgpLT5cbiAgICAgIE1pLm1vdGlvbi5ibGluZHNEb3duKHsgc2VsZWN0b3I6ICcuY2FyZCd9KVxuICAgICwgNTAwKVxuIiwiLy8gRXh0ZW5kIG5hbWVzcGFjZSBpZiBtaSBpcyBhbHJlYWR5IGRlZmluZWRcbnZhciBNaSA9IE1pIHx8IHt9O1xuXG5cbi8vIE1pIGxpYnJhcnkgcmV0dXJuZWQgZnJvbSBjbG9zdXJlXG5NaSA9IChmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgLyogTGlicmFyeSBDb25zdGFudHMgKEVYUE9SVClcbiAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICB2YXIgdmVyc2lvbiA9ICcwLjAuMSc7XG5cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgLyogSEVMUEVSUyAobm9uLWV4cG9ydHMpXG4gICAgLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09KlxuICAgIC8gICBBYnN0cmFjdCBjb21tb24gbG9va3VwcyBhbmQgbWFuaXB1bGF0aW9ucyBpbiBjYXNlIGJldHRlciBhbHRlcm5hdGl2ZXNcbiAgICAvICAgYXJpc2Ugb3IgZnV0dXJlIGNyb3NzLXBsYXRmb3JtIGRpZmZlcmVuY2VzIHdhcnJhbnQgc2VwYXJhdGUgaGFuZGxpbmdcbiAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgZnVuY3Rpb24gZ2V0Vmlld3BvcnRIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGRvbU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGRvbU5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0O1xuICAgIH1cblxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAvKiBNT1RJT04gKEVYUE9SVClcbiAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qXG4gICAgLyAgIEFuaW1hdGlvbiBtZXRob2RzIGZvciB0aGUgbGlicmFyeVxuICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICAvLyBIb2lzdGluZyB0aGUgYW5pbWF0aW9uIGZ1bmN0aW9ucyBpbnRvIG91ciBtb3Rpb24gb2JqZWN0XG4gICAgdmFyIG1vdGlvbiA9IHtcbiAgICAgICAgYmxpbmRzRG93bjogYmxpbmRzRG93bixcbiAgICAgICAgZmFkZVNsaWRlSW46IGZhZGVTbGlkZUluLFxuICAgICAgICBmYWRlU2xpZGVJblJpZ2h0OiBmYWRlU2xpZGVJblJpZ2h0LFxuICAgICAgICBwYW5JbkxlZnQ6IHBhbkluTGVmdCxcbiAgICAgICAgcHVzaERvd246IHB1c2hEb3duLFxuICAgICAgICBzbGlkZVVwOiBzbGlkZVVwXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGJsaW5kc0Rvd24ob3B0aW9ucykge1xuXG4gICAgICAgIC8vIERlY2xhcmUgb3VyIGRlZmF1bHRzXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGZpbmlzaERlbGF5VGhyb3R0bGU6IDIsXG4gICAgICAgICAgICBmaW5pc2hTcGVlZFBlcmNlbnQ6IDAuNSxcbiAgICAgICAgICAgIGxlZnRPZmZzZXRQZXJjZW50YWdlOiAwLjgsXG4gICAgICAgICAgICBzdGFydFZlbG9jaXR5OiAxMTAwXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQXBwbHkgZGVmYXVsdHMgaWYgcHJvcGVydGllcyBhcmUgbm90IHBhc3NlZFxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgPSBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgfHwgZGVmYXVsdHMuZmluaXNoRGVsYXlUaHJvdHRsZTtcbiAgICAgICAgb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgPSBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCB8fCBkZWZhdWx0cy5maW5pc2hTcGVlZFBlcmNlbnQ7XG4gICAgICAgIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgPSBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlIHx8IGRlZmF1bHRzLmxlZnRPZmZzZXRQZXJjZW50YWdlO1xuICAgICAgICBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgPSBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgfHwgZGVmYXVsdHMuc3RhcnRWZWxvY2l0eTtcblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGJsaW5kc0Rvd24gc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlQmxpbmRzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IDA7XG5cbiAgICAgICAgLy8gQ291bnQgdGhlIGVsZW1lbnRzIHdpdGhpbiB0aGUgc3RhcnRpbmcgdmlld3BvcnQgc28gd2UncmUgbm90IGV4YWN0aW5nXG4gICAgICAgIC8vIG1vcmUgZWZmb3J0IHRoYW4gcmVxdWlyZWQuLi5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgdXNlIGNzcyB2aXNpYmxpdHk6IGhpZGRlbiBpbnN0ZWFkIG9mIGRpc3BsYXk6IG5vbmUgc28gdGhlIGVsZW1lbnRzXG4gICAgICAgIC8vIG1haW50YWluIHRoZWlyIERPTSBmbG93XG5cbiAgICAgICAgdmFyIHZpZXdwb3J0SGVpZ2h0ID0gZ2V0Vmlld3BvcnRIZWlnaHQoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbmltYXRlQmxpbmRzRG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5pbWF0ZUJsaW5kc0RvbVtpXS5vZmZzZXRUb3AgPCB2aWV3cG9ydEhlaWdodCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRBbmltYXRpb25Db3VudCArPSAxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXF1ZW50aWFsbHkgYW5pbWF0ZSB3aXRoIGEgZGVsYXkgYmFzZWQgb24gcHJveGltaXR5XG4gICAgICAgIHZhciBzcGVlZCA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZUJsaW5kc0RvbVtpXTtcbiAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNoaWxkT2Zmc2V0LmxlZnQgKiBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlICsgY2hpbGRPZmZzZXQudG9wO1xuICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChvZmZzZXQgLyBzcGVlZCkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLndlYmtpdFRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuY2xhc3NOYW1lICs9ICcgaW4nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2hlbiB3ZSdyZSBkb25lIGFuaW1hdGluZywgc3dpdGNoIHRoZSBjbGFzcyB0byAnZG9uZSdcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlQmxpbmRzRG9tW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KG9mZnNldCAvIHNwZWVkIC8gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgIGNoaWxkLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLnN0eWxlLndlYmtpdFRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICAgICAgY2hpbGQucXVlcnlTZWxlY3RvcignaW1nJykuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgICAgICAvL2NoaWxkLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLmNsYXNzTmFtZSArPSAnIGluJztcbiAgICAgICAgICAgICAgICBhbmltYXRlQmxpbmRzRG9tW2ldLnBhcmVudE5vZGUuY2xhc3NOYW1lICs9ICcgZG9uZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgc3BlZWQgKiBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmFkZVNsaWRlSW4ob3B0aW9ucykge1xuXG4gICAgICAgIC8vIERlY2xhcmUgb3VyIGRlZmF1bHRzXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGZpbmlzaERlbGF5VGhyb3R0bGU6IDIsXG4gICAgICAgICAgICBmaW5pc2hTcGVlZFBlcmNlbnQ6IDAuNzIsXG4gICAgICAgICAgICBsZWZ0T2Zmc2V0UGVyY2VudGFnZTogMC44LFxuICAgICAgICAgICAgc3RhcnRWZWxvY2l0eTogMTEwMFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFwcGx5IGRlZmF1bHRzIGlmIHByb3BlcnRpZXMgYXJlIG5vdCBwYXNzZWRcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlID0gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlIHx8IGRlZmF1bHRzLmZpbmlzaERlbGF5VGhyb3R0bGU7XG4gICAgICAgIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50ID0gb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgfHwgZGVmYXVsdHMuZmluaXNoU3BlZWRQZXJjZW50O1xuICAgICAgICBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlID0gb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSB8fCBkZWZhdWx0cy5sZWZ0T2Zmc2V0UGVyY2VudGFnZTtcbiAgICAgICAgb3B0aW9ucy5zdGFydFZlbG9jaXR5ID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5IHx8IGRlZmF1bHRzLnN0YXJ0VmVsb2NpdHk7XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBmYWRlU2xpZGVJbiBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVGYWRlU2xpZGVJbkRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBlbGVtZW50QW5pbWF0aW9uQ291bnQgPSAwO1xuXG4gICAgICAgIC8vIENvdW50IHRoZSBlbGVtZW50cyB3aXRoaW4gdGhlIHN0YXJ0aW5nIHZpZXdwb3J0IHNvIHdlJ3JlIG5vdCBleGFjdGluZ1xuICAgICAgICAvLyBtb3JlIGVmZm9ydCB0aGFuIHJlcXVpcmVkLi4uXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIHVzZSBjc3MgdmlzaWJsaXR5OiBoaWRkZW4gaW5zdGVhZCBvZiBkaXNwbGF5OiBub25lIHNvIHRoZSBlbGVtZW50c1xuICAgICAgICAvLyBtYWludGFpbiB0aGVpciBET00gZmxvd1xuXG4gICAgICAgIHZhciB2aWV3cG9ydEhlaWdodCA9IGdldFZpZXdwb3J0SGVpZ2h0KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5pbWF0ZUZhZGVTbGlkZUluRG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5pbWF0ZUZhZGVTbGlkZUluRG9tW2ldLm9mZnNldFRvcCA8IHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudEFuaW1hdGlvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlcXVlbnRpYWxseSBhbmltYXRlIHdpdGggYSBkZWxheSBiYXNlZCBvbiBwcm94aW1pdHlcbiAgICAgICAgdmFyIHNwZWVkID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlRmFkZVNsaWRlSW5Eb21baV07XG4gICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQob2Zmc2V0IC8gc3BlZWQpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS53ZWJraXRUcmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTmFtZSArPSAnIGluJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdoZW4gd2UncmUgZG9uZSBhbmltYXRpbmcsIHN3aXRjaCB0aGUgY2xhc3MgdG8gJ2RvbmUnXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZUZhZGVTbGlkZUluRG9tW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXlWYWx1ZSA9IG9mZnNldCAvIHNwZWVkIC8gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlO1xuICAgICAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQoZGVsYXlWYWx1ZSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAvL2FuaW1hdGVGYWRlU2xpZGVJbkRvbVswXS5jbGFzc05hbWUgKz0gJyBkb25lJztcbiAgICAgICAgICAgICAgICBhbmltYXRlRmFkZVNsaWRlSW5Eb21baV0uY2xhc3NOYW1lICs9ICcgZG9uZSc7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCBzcGVlZCAqIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmYWRlU2xpZGVJblJpZ2h0KG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBEZWNsYXJlIG91ciBkZWZhdWx0c1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBmaW5pc2hEZWxheVRocm90dGxlOiAyLFxuICAgICAgICAgICAgZmluaXNoU3BlZWRQZXJjZW50OiAwLjcyLFxuICAgICAgICAgICAgbGVmdE9mZnNldFBlcmNlbnRhZ2U6IDAuOCxcbiAgICAgICAgICAgIHN0YXJ0VmVsb2NpdHk6IDExMDBcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBcHBseSBkZWZhdWx0cyBpZiBwcm9wZXJ0aWVzIGFyZSBub3QgcGFzc2VkXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSA9IG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSB8fCBkZWZhdWx0cy5maW5pc2hEZWxheVRocm90dGxlO1xuICAgICAgICBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCA9IG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50IHx8IGRlZmF1bHRzLmZpbmlzaFNwZWVkUGVyY2VudDtcbiAgICAgICAgb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSA9IG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgfHwgZGVmYXVsdHMubGVmdE9mZnNldFBlcmNlbnRhZ2U7XG4gICAgICAgIG9wdGlvbnMuc3RhcnRWZWxvY2l0eSA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eSB8fCBkZWZhdWx0cy5zdGFydFZlbG9jaXR5O1xuXG4gICAgICAgIC8vIEZhaWwgZWFybHkgJiBzaWxlbnRseSBsb2dcbiAgICAgICAgdmFyIGlzSW52YWxpZFNlbGVjdG9yID0gdHlwZW9mIG9wdGlvbnMuc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuc2VsZWN0b3IgPT09ICcnO1xuXG4gICAgICAgIGlmIChpc0ludmFsaWRTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgZmFkZVNsaWRlSW5SaWdodCBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVTbGlkZUluUmlnaHREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gMDtcblxuICAgICAgICAvLyBDb3VudCB0aGUgZWxlbWVudHMgd2l0aGluIHRoZSBzdGFydGluZyB2aWV3cG9ydCBzbyB3ZSdyZSBub3RcbiAgICAgICAgLy8gZXhhY3RpbmcgbW9yZSBlZmZvcnQgdGhhbiByZXF1aXJlZC4uLlxuICAgICAgICAvL1xuICAgICAgICAvLyBXZSB1c2UgY3NzIHZpc2libGl0eTogaGlkZGVuIGluc3RlYWQgb2YgZGlzcGxheTogbm9uZSBzbyB0aGVcbiAgICAgICAgLy8gZWxlbWVudHMgbWFpbnRhaW4gdGhlaXIgRE9NIGZsb3dcblxuICAgICAgICB2YXIgdmlld3BvcnRIZWlnaHQgPSBnZXRWaWV3cG9ydEhlaWdodCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuaW1hdGVTbGlkZUluUmlnaHREb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhbmltYXRlU2xpZGVJblJpZ2h0RG9tW2ldLm9mZnNldFRvcCA8IHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudEFuaW1hdGlvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlcXVlbnRpYWxseSBhbmltYXRlIHdpdGggYSBkZWxheSBiYXNlZCBvbiBwcm94aW1pdHlcbiAgICAgICAgdmFyIHNwZWVkID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlU2xpZGVJblJpZ2h0RG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNoaWxkT2Zmc2V0ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KG9mZnNldCAvIHNwZWVkKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUud2Via2l0VHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5jbGFzc05hbWUgKz0gJyBpbic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXaGVuIHdlJ3JlIGRvbmUgYW5pbWF0aW5nLCBzd2l0Y2ggdGhlIGNsYXNzIHRvICdkb25lJ1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGFuaW1hdGVTbGlkZUluUmlnaHREb21baV07XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkT2Zmc2V0ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNoaWxkT2Zmc2V0LmxlZnQgKiBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlICsgY2hpbGRPZmZzZXQudG9wO1xuICAgICAgICAgICAgICAgIHZhciBkZWxheVZhbHVlID0gb2Zmc2V0IC8gc3BlZWQgLyBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGU7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChkZWxheVZhbHVlKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWF0ZVNsaWRlSW5SaWdodERvbS5pdGVtKDApLnBhcmVudE5vZGUuY2xhc3NOYW1lICs9ICcgZG9uZSc7XG5cbiAgICAgICAgfSwgc3BlZWQgKiBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFuSW5MZWZ0KG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBXZSBoYXZlIGEgc2luZ2xlIG9wdGlvbiwgc28gaXQgbWF5IGJlIHBhc3NlZCBhcyBhIHN0cmluZyBvciBwcm9wZXJ0eVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBvcHRpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBwdXNoRG93biBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVQYW5JbkxlZnREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gYW5pbWF0ZVBhbkluTGVmdERvbS5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gYW5pbWF0ZVBhbkluTGVmdERvbVtpXTtcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWVUb1JlbW92ZSA9ICdhbmltYXRlLXBhbi1pbi1sZWZ0JztcbiAgICAgICAgICAgIHZhciBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUgPSBlbGVtZW50LmNsYXNzTmFtZS5sYXN0SW5kZXhPZihjbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnN1YnN0cigwLCBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHVzaERvd24ob3B0aW9ucykge1xuXG4gICAgICAgIC8vIFdlIGhhdmUgYSBzaW5nbGUgb3B0aW9uLCBzbyBpdCBtYXkgYmUgcGFzc2VkIGFzIGEgc3RyaW5nIG9yIHByb3BlcnR5XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IG9wdGlvbnNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIHB1c2hEb3duIHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZVB1c2hEb3duRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IGFuaW1hdGVQdXNoRG93bkRvbS5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gYW5pbWF0ZVB1c2hEb3duRG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZVRvUmVtb3ZlID0gb3B0aW9ucy5zZWxlY3Rvci5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgdmFyIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSA9IGVsZW1lbnQuY2xhc3NOYW1lLmxhc3RJbmRleE9mKGNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUuc3Vic3RyKDAsIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzbGlkZVVwKG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBXZSBoYXZlIGEgc2luZ2xlIG9wdGlvbiwgc28gaXQgbWF5IGJlIHBhc3NlZCBhcyBhIHN0cmluZyBvciBwcm9wZXJ0eVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBvcHRpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBwdXNoRG93biBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVTbGlkZVVwRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IGFuaW1hdGVTbGlkZVVwRG9tLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBhbmltYXRlU2xpZGVVcERvbVtpXTtcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWVUb1JlbW92ZSA9IG9wdGlvbnMuc2VsZWN0b3Iuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIHZhciBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUgPSBlbGVtZW50LmNsYXNzTmFtZS5sYXN0SW5kZXhPZihjbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnN1YnN0cigwLCBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyogRXhwb3J0IG9iamVjdFxuICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXR1cm4ge1xuICAgICAgICBtb3Rpb246IG1vdGlvbixcbiAgICAgICAgdmVyc2lvbjogdmVyc2lvblxuICAgIH1cblxufSkoKTtcbiIsIi8qIVxuICogV2F2ZXMgdjAuNi4zXG4gKiBodHRwOi8vZmlhbi5teS5pZC9XYXZlcyBcbiAqIFxuICogQ29weXJpZ2h0IDIwMTQgQWxmaWFuYSBFLiBTaWJ1ZWEgYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9maWFucy9XYXZlcy9ibG9iL21hc3Rlci9MSUNFTlNFIFxuICovXG5cbjsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIFdhdmVzID0gV2F2ZXMgfHwge307XG4gICAgdmFyICQkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbC5iaW5kKGRvY3VtZW50KTtcblxuICAgIC8vIEZpbmQgZXhhY3QgcG9zaXRpb24gb2YgZWxlbWVudFxuICAgIGZ1bmN0aW9uIGlzV2luZG93KG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICE9PSBudWxsICYmIG9iaiA9PT0gb2JqLndpbmRvdztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRXaW5kb3coZWxlbSkge1xuICAgICAgICByZXR1cm4gaXNXaW5kb3coZWxlbSkgPyBlbGVtIDogZWxlbS5ub2RlVHlwZSA9PT0gOSAmJiBlbGVtLmRlZmF1bHRWaWV3O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9mZnNldChlbGVtKSB7XG4gICAgICAgIHZhciBkb2NFbGVtLCB3aW4sXG4gICAgICAgICAgICBib3ggPSB7dG9wOiAwLCBsZWZ0OiAwfSxcbiAgICAgICAgICAgIGRvYyA9IGVsZW0gJiYgZWxlbS5vd25lckRvY3VtZW50O1xuXG4gICAgICAgIGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgIT09IHR5cGVvZiB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgd2luID0gZ2V0V2luZG93KGRvYyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IGJveC50b3AgKyB3aW4ucGFnZVlPZmZzZXQgLSBkb2NFbGVtLmNsaWVudFRvcCxcbiAgICAgICAgICAgIGxlZnQ6IGJveC5sZWZ0ICsgd2luLnBhZ2VYT2Zmc2V0IC0gZG9jRWxlbS5jbGllbnRMZWZ0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29udmVydFN0eWxlKG9iaikge1xuICAgICAgICB2YXIgc3R5bGUgPSAnJztcblxuICAgICAgICBmb3IgKHZhciBhIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShhKSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IChhICsgJzonICsgb2JqW2FdICsgJzsnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICB9XG5cbiAgICB2YXIgRWZmZWN0ID0ge1xuXG4gICAgICAgIC8vIEVmZmVjdCBkZWxheVxuICAgICAgICBkdXJhdGlvbjogNzUwLFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKGUsIGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgLy8gRGlzYWJsZSByaWdodCBjbGlja1xuICAgICAgICAgICAgaWYgKGUuYnV0dG9uID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50IHx8IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSByaXBwbGVcbiAgICAgICAgICAgIHZhciByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJpcHBsZS5jbGFzc05hbWUgPSAnd2F2ZXMtcmlwcGxlJztcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHJpcHBsZSk7XG5cbiAgICAgICAgICAgIC8vIEdldCBjbGljayBjb29yZGluYXRlIGFuZCBlbGVtZW50IHdpdGRoXG4gICAgICAgICAgICB2YXIgcG9zICAgICAgICAgPSBvZmZzZXQoZWwpO1xuICAgICAgICAgICAgdmFyIHJlbGF0aXZlWSAgID0gKGUucGFnZVkgLSBwb3MudG9wKTtcbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVggICA9IChlLnBhZ2VYIC0gcG9zLmxlZnQpO1xuICAgICAgICAgICAgdmFyIHNjYWxlICAgICAgID0gJ3NjYWxlKCcrKChlbC5jbGllbnRXaWR0aCAvIDEwMCkgKiAzKSsnKSc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFN1cHBvcnQgZm9yIHRvdWNoIGRldmljZXNcbiAgICAgICAgICAgIGlmICgndG91Y2hlcycgaW4gZSkge1xuICAgICAgICAgICAgICByZWxhdGl2ZVkgICA9IChlLnRvdWNoZXNbMF0ucGFnZVkgLSBwb3MudG9wKTtcbiAgICAgICAgICAgICAgcmVsYXRpdmVYICAgPSAoZS50b3VjaGVzWzBdLnBhZ2VYIC0gcG9zLmxlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBdHRhY2ggZGF0YSB0byBlbGVtZW50XG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdkYXRhLWhvbGQnLCBEYXRlLm5vdygpKTtcbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2NhbGUnLCBzY2FsZSk7XG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdkYXRhLXgnLCByZWxhdGl2ZVgpO1xuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgcmVsYXRpdmVZKTtcblxuICAgICAgICAgICAgLy8gU2V0IHJpcHBsZSBwb3NpdGlvblxuICAgICAgICAgICAgdmFyIHJpcHBsZVN0eWxlID0ge1xuICAgICAgICAgICAgICAgICd0b3AnOiByZWxhdGl2ZVkrJ3B4JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IHJlbGF0aXZlWCsncHgnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByaXBwbGUuY2xhc3NOYW1lID0gcmlwcGxlLmNsYXNzTmFtZSArICcgd2F2ZXMtbm90cmFuc2l0aW9uJztcbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgY29udmVydFN0eWxlKHJpcHBsZVN0eWxlKSk7XG4gICAgICAgICAgICByaXBwbGUuY2xhc3NOYW1lID0gcmlwcGxlLmNsYXNzTmFtZS5yZXBsYWNlKCd3YXZlcy1ub3RyYW5zaXRpb24nLCAnJyk7XG5cbiAgICAgICAgICAgIC8vIFNjYWxlIHRoZSByaXBwbGVcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctd2Via2l0LXRyYW5zZm9ybSddID0gc2NhbGU7XG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLW1vei10cmFuc2Zvcm0nXSA9IHNjYWxlO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy1tcy10cmFuc2Zvcm0nXSA9IHNjYWxlO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy1vLXRyYW5zZm9ybSddID0gc2NhbGU7XG4gICAgICAgICAgICByaXBwbGVTdHlsZS50cmFuc2Zvcm0gPSBzY2FsZTtcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlLm9wYWNpdHkgICA9ICcxJztcblxuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy13ZWJraXQtdHJhbnNpdGlvbi1kdXJhdGlvbiddID0gRWZmZWN0LmR1cmF0aW9uICsgJ21zJztcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctbW96LXRyYW5zaXRpb24tZHVyYXRpb24nXSAgICA9IEVmZmVjdC5kdXJhdGlvbiArICdtcyc7XG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLW8tdHJhbnNpdGlvbi1kdXJhdGlvbiddICAgICAgPSBFZmZlY3QuZHVyYXRpb24gKyAnbXMnO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJ3RyYW5zaXRpb24tZHVyYXRpb24nXSAgICAgICAgID0gRWZmZWN0LmR1cmF0aW9uICsgJ21zJztcblxuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBjb252ZXJ0U3R5bGUocmlwcGxlU3R5bGUpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoaWRlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBUb3VjaEhhbmRsZXIudG91Y2h1cChlKTtcblxuICAgICAgICAgICAgdmFyIGVsID0gdGhpcztcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsLmNsaWVudFdpZHRoICogMS40O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHZXQgZmlyc3QgcmlwcGxlXG4gICAgICAgICAgICB2YXIgcmlwcGxlID0gbnVsbDtcbiAgICAgICAgICAgIHZhciByaXBwbGVzID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2F2ZXMtcmlwcGxlJyk7XG4gICAgICAgICAgICBpZiAocmlwcGxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmlwcGxlID0gcmlwcGxlc1tyaXBwbGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVggICA9IHJpcHBsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpO1xuICAgICAgICAgICAgdmFyIHJlbGF0aXZlWSAgID0gcmlwcGxlLmdldEF0dHJpYnV0ZSgnZGF0YS15Jyk7XG4gICAgICAgICAgICB2YXIgc2NhbGUgICAgICAgPSByaXBwbGUuZ2V0QXR0cmlidXRlKCdkYXRhLXNjYWxlJyk7XG5cbiAgICAgICAgICAgIC8vIEdldCBkZWxheSBiZWV0d2VlbiBtb3VzZWRvd24gYW5kIG1vdXNlIGxlYXZlXG4gICAgICAgICAgICB2YXIgZGlmZiA9IERhdGUubm93KCkgLSBOdW1iZXIocmlwcGxlLmdldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJykpO1xuICAgICAgICAgICAgdmFyIGRlbGF5ID0gMzUwIC0gZGlmZjtcblxuICAgICAgICAgICAgaWYgKGRlbGF5IDwgMCkge1xuICAgICAgICAgICAgICAgIGRlbGF5ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRmFkZSBvdXQgcmlwcGxlIGFmdGVyIGRlbGF5XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RvcCc6IHJlbGF0aXZlWSsncHgnLFxuICAgICAgICAgICAgICAgICAgICAnbGVmdCc6IHJlbGF0aXZlWCsncHgnLFxuICAgICAgICAgICAgICAgICAgICAnb3BhY2l0eSc6ICcwJyxcblxuICAgICAgICAgICAgICAgICAgICAvLyBEdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2l0aW9uLWR1cmF0aW9uJzogRWZmZWN0LmR1cmF0aW9uICsgJ21zJyxcbiAgICAgICAgICAgICAgICAgICAgJy1tb3otdHJhbnNpdGlvbi1kdXJhdGlvbic6IEVmZmVjdC5kdXJhdGlvbiArICdtcycsXG4gICAgICAgICAgICAgICAgICAgICctby10cmFuc2l0aW9uLWR1cmF0aW9uJzogRWZmZWN0LmR1cmF0aW9uICsgJ21zJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24tZHVyYXRpb24nOiBFZmZlY3QuZHVyYXRpb24gKyAnbXMnLFxuICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgJy1tb3otdHJhbnNmb3JtJzogc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICctbXMtdHJhbnNmb3JtJzogc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICctby10cmFuc2Zvcm0nOiBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6IHNjYWxlLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGNvbnZlcnRTdHlsZShzdHlsZSkpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKHJpcHBsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgRWZmZWN0LmR1cmF0aW9uKTtcbiAgICAgICAgICAgIH0sIGRlbGF5KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBMaXR0bGUgaGFjayB0byBtYWtlIDxpbnB1dD4gY2FuIHBlcmZvcm0gd2F2ZXMgZWZmZWN0XG4gICAgICAgIHdyYXBJbnB1dDogZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGEgPSAwOyBhIDwgZWxlbWVudHMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50c1thXTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGlucHV0IGFscmVhZHkgaGF2ZSBwYXJlbnQganVzdCBwYXNzIHRocm91Z2hcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpJyAmJiBwYXJlbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dhdmVzLWVmZmVjdCcpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBQdXQgZWxlbWVudCBjbGFzcyBhbmQgc3R5bGUgdG8gdGhlIHNwZWNpZmllZCBwYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lICsgJyB3YXZlcy1pbnB1dC13cmFwcGVyJztcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudFN0eWxlID0gZWwuZ2V0QXR0cmlidXRlKCdzdHlsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50U3R5bGUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsIGVsZW1lbnRTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBlbC5jbGFzc05hbWUgPSAnd2F2ZXMtYnV0dG9uLWlucHV0JztcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFB1dCBlbGVtZW50IGFzIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQod3JhcHBlciwgZWwpO1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBEaXNhYmxlIG1vdXNlZG93biBldmVudCBmb3IgNTAwbXMgZHVyaW5nIGFuZCBhZnRlciB0b3VjaFxuICAgICAqL1xuICAgIHZhciBUb3VjaEhhbmRsZXIgPSB7XG4gICAgICAgIC8qIHVzZXMgYW4gaW50ZWdlciByYXRoZXIgdGhhbiBib29sIHNvIHRoZXJlJ3Mgbm8gaXNzdWVzIHdpdGhcbiAgICAgICAgICogbmVlZGluZyB0byBjbGVhciB0aW1lb3V0cyBpZiBhbm90aGVyIHRvdWNoIGV2ZW50IG9jY3VycmVkXG4gICAgICAgICAqIHdpdGhpbiB0aGUgNTAwbXMuIENhbm5vdCBtb3VzZXVwIGJldHdlZW4gdG91Y2hzdGFydCBhbmRcbiAgICAgICAgICogdG91Y2hlbmQsIG5vciBpbiB0aGUgNTAwbXMgYWZ0ZXIgdG91Y2hlbmQuICovXG4gICAgICAgIHRvdWNoZXM6IDAsXG4gICAgICAgIGFsbG93RXZlbnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBhbGxvdyA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xuICAgICAgICAgICAgICAgIFRvdWNoSGFuZGxlci50b3VjaGVzICs9IDE7IC8vcHVzaFxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICd0b3VjaGVuZCcgfHwgZS50eXBlID09PSAndG91Y2hjYW5jZWwnKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFRvdWNoSGFuZGxlci50b3VjaGVzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG91Y2hIYW5kbGVyLnRvdWNoZXMgLT0gMTsgLy9wb3AgYWZ0ZXIgNTAwbXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgVG91Y2hIYW5kbGVyLnRvdWNoZXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgYWxsb3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFsbG93O1xuICAgICAgICB9LFxuICAgICAgICB0b3VjaHVwOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBUb3VjaEhhbmRsZXIuYWxsb3dFdmVudChlKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIERlbGVnYXRlZCBjbGljayBoYW5kbGVyIGZvciAud2F2ZXMtZWZmZWN0IGVsZW1lbnQuXG4gICAgICogcmV0dXJucyBudWxsIHdoZW4gLndhdmVzLWVmZmVjdCBlbGVtZW50IG5vdCBpbiBcImNsaWNrIHRyZWVcIlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFdhdmVzRWZmZWN0RWxlbWVudChlKSB7XG4gICAgICAgIGlmIChUb3VjaEhhbmRsZXIuYWxsb3dFdmVudChlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuXG4gICAgICAgIHdoaWxlICh0YXJnZXQucGFyZW50RWxlbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkgJiYgdGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCd3YXZlcy1lZmZlY3QnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3YXZlcy1lZmZlY3QnKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1YmJsZSB0aGUgY2xpY2sgYW5kIHNob3cgZWZmZWN0IGlmIC53YXZlcy1lZmZlY3QgZWxlbSB3YXMgZm91bmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaG93RWZmZWN0KGUpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBnZXRXYXZlc0VmZmVjdEVsZW1lbnQoZSk7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIEVmZmVjdC5zaG93KGUsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIEVmZmVjdC5oaWRlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIEVmZmVjdC5oaWRlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIEVmZmVjdC5oaWRlLCBmYWxzZSk7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBFZmZlY3QuaGlkZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgV2F2ZXMuZGlzcGxheUVmZmVjdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgaWYgKCdkdXJhdGlvbicgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgRWZmZWN0LmR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9XcmFwIGlucHV0IGluc2lkZSA8aT4gdGFnXG4gICAgICAgIEVmZmVjdC53cmFwSW5wdXQoJCQoJy53YXZlcy1lZmZlY3QnKSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzaG93RWZmZWN0LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2hvd0VmZmVjdCwgZmFsc2UpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggV2F2ZXMgdG8gYW4gaW5wdXQgZWxlbWVudCAob3IgYW55IGVsZW1lbnQgd2hpY2ggZG9lc24ndFxuICAgICAqIGJ1YmJsZSBtb3VzZXVwL21vdXNlZG93biBldmVudHMpLlxuICAgICAqICAgSW50ZW5kZWQgdG8gYmUgdXNlZCB3aXRoIGR5bmFtaWNhbGx5IGxvYWRlZCBmb3Jtcy9pbnB1dHMsIG9yXG4gICAgICogd2hlcmUgdGhlIHVzZXIgZG9lc24ndCB3YW50IGEgZGVsZWdhdGVkIGNsaWNrIGhhbmRsZXIuXG4gICAgICovXG4gICAgV2F2ZXMuYXR0YWNoID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvL0ZVVFVSRTogYXV0b21hdGljYWxseSBhZGQgd2F2ZXMgY2xhc3NlcyBhbmQgYWxsb3cgdXNlcnNcbiAgICAgICAgLy8gdG8gc3BlY2lmeSB0aGVtIHdpdGggYW4gb3B0aW9ucyBwYXJhbT8gRWcuIGxpZ2h0L2NsYXNzaWMvYnV0dG9uXG4gICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgRWZmZWN0LndyYXBJbnB1dChbZWxlbWVudF0pO1xuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNob3dFZmZlY3QsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2hvd0VmZmVjdCwgZmFsc2UpO1xuICAgIH07XG5cbiAgICB3aW5kb3cuV2F2ZXMgPSBXYXZlcztcbn0pKHdpbmRvdyk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=