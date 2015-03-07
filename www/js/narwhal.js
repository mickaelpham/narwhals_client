(function() {
  var app;

  app = angular.module('narwhal', ['ionic', 'narwhal.login', 'narwhal.report', 'narwhal.recurring', 'ui.router', 'angular-locker']);

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
      console.log("Changed route to " + toState.url);
      return console.log("Changed route to " + toState.name);
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      console.error('Could not change state');
      return console.error(error);
    });
    return $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      return console.log('Successfuly changed state');
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
  var app;

  app = angular.module('narwhal');

  app.factory('User', [
    '$http', function($http) {
      var User;
      return new (User = (function() {
        function User() {}

        User.prototype.login = function(username, password) {
          var request;
          request = $http.post('https://nameless-scrubland-4785.herokuapp.com/v1/session/', {
            email: username,
            password: password
          });
          return request;
        };

        User.prototype.getTransactions = function(sessionToken) {
          var request;
          request = $http.get('https://nameless-scrubland-4785.herokuapp.com/v1/transactions', {
            params: {
              session_token: sessionToken
            }
          });
          return request;
        };

        return User;

      })());
    }
  ]);

}).call(this);

(function() {
  var loginModule;

  loginModule = angular.module('narwhal.login', []);

  loginModule.config(function($stateProvider) {
    return $stateProvider.state('login', {
      url: '/login/',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    });
  });

}).call(this);

(function() {
  var recurringModule;

  recurringModule = angular.module('narwhal.recurring', []);

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

  reportModule = angular.module('narwhal.report', []);

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

  app = angular.module('narwhal');

  IndexController = (function(superClass) {
    extend(IndexController, superClass);

    function IndexController() {
      this.getRandomAmount = bind(this.getRandomAmount, this);
      this.loadTransactions = bind(this.loadTransactions, this);
      this.initialize = bind(this.initialize, this);
      return IndexController.__super__.constructor.apply(this, arguments);
    }

    IndexController.register(app);

    IndexController.inject('$scope', '$http', '$state', '$rootScope', 'User', 'locker');

    IndexController.prototype.initialize = function() {
      this.$scope.transactions = [];
      this.loadTransactions();
      if (this.locker.has('session_token')) {
        this.$rootScope.session_token = this.locker.get('session_token');
      }
      if (this.locker.has('transactions')) {
        this.$scope.transactions = this.locker.get('transactions');
        return ionic.DomUtil.ready(function() {
          return Mi.motion.fadeSlideInRight({
            selector: '.animate-fade-slide-in-right > *'
          });
        });
      }
    };

    IndexController.prototype.logout = function() {
      this.locker.forget('session_token');
      return this.$state.go('login');
    };

    IndexController.prototype.refresh = function() {
      this.loadTransactions();
      this.$scope.$broadcast('scroll.refreshComplete');
      return setTimeout(Mi.motion.fadeSlideInRight({
        selector: '.animate-fade-slide-in-right > *'
      }), 10);
    };

    IndexController.prototype.loadTransactions = function() {
      return this.User.getTransactions(this.$rootScope.session_token).then((function(_this) {
        return function(result) {
          _this.$scope.transactions = result.data;
          return _this.locker.put('transactions', _this.$scope.transactions);
        };
      })(this));
    };

    IndexController.prototype.getRandomAmount = function() {
      return Math.floor(Math.random() * 5000) / 100;
    };

    IndexController.prototype.showTransaction = function(transaction) {
      console.log("Current Transaction");
      console.log(transaction);
      this.$rootScope.currentTransaction = transaction;
      return this.$state.go('recurring');
    };

    return IndexController;

  })(BaseController);

}).call(this);

(function() {
  var LoginController, loginModule,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  loginModule = angular.module('narwhal.login');

  LoginController = (function(superClass) {
    extend(LoginController, superClass);

    function LoginController() {
      this.initialize = bind(this.initialize, this);
      this.login = bind(this.login, this);
      return LoginController.__super__.constructor.apply(this, arguments);
    }

    LoginController.register(loginModule);

    LoginController.inject('$scope', '$http', '$state', 'User', '$rootScope', '$ionicViewSwitcher', 'locker');

    LoginController.prototype.login = function() {
      this.$scope.isLoading = true;
      return this.User.login(this.$scope.username, this.$scope.password).then((function(_this) {
        return function(result) {
          _this.$scope.isLoading = false;
          _this.$ionicViewSwitcher.nextDirection('swap');
          _this.$rootScope.session_token = result.data.session_token;
          _this.locker.put('session_token', _this.$rootScope.session_token);
          return _this.$state.go('index');
        };
      })(this));
    };

    LoginController.prototype.initialize = function() {
      this.$ionicViewSwitcher.nextDirection('swap');
      console.log("initialized login module");
      if (this.locker.get('session_token')) {
        return this.$rootScope.session_token = this.locker.get('session_token');
      }
    };

    return LoginController;

  })(BaseController);

}).call(this);

(function() {
  angular.module('narwhal.login').directive('ionMdInput', function() {
    return {
      restrict: 'E',
      replace: true,
      require: '?ngModel',
      template: '<label class="item item-input item-md-label">' + '<input type="text">' + '<span class="input-label"></span>' + '<div class="highlight"></div>' + '</label>',
      compile: function(element, attr) {
        var cleanUp, highlight, highlightColor, input, label;
        highlight = element[0].querySelector('.highlight');
        highlightColor = void 0;
        if (!attr.highlightColor) {
          highlightColor = 'calm';
        } else {
          highlightColor = attr.highlightColor;
        }
        highlight.className += ' highlight-' + highlightColor;
        label = element.find('span');
        label.html(attr.placeholder);
        input = element.find('input');
        input.bind('blur', function() {
          console.log('blur');
          if (input.val()) {
            input.addClass('used');
          } else {
            input.removeClass('used');
          }
        });
        angular.forEach({
          'name': attr.name,
          'type': attr.type,
          'ng-value': attr.ngValue,
          'ng-model': attr.ngModel,
          'required': attr.required,
          'ng-required': attr.ngRequired,
          'ng-minlength': attr.ngMinlength,
          'ng-maxlength': attr.ngMaxlength,
          'ng-pattern': attr.ngPattern,
          'ng-change': attr.ngChange,
          'ng-trim': attr.trim,
          'ng-blur': attr.ngBlur,
          'ng-focus': attr.ngFocus
        }, function(value, name) {
          if (angular.isDefined(value)) {
            input.attr(name, value);
          }
        });
        cleanUp = function() {
          ionic.off('$destroy', cleanUp, element[0]);
        };
        ionic.on('$destroy', cleanUp, element[0]);
      }
    };
  });

}).call(this);

(function() {
  var RecurringController, recurringModule,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  recurringModule = angular.module('narwhal.recurring');

  RecurringController = (function(superClass) {
    extend(RecurringController, superClass);

    function RecurringController() {
      return RecurringController.__super__.constructor.apply(this, arguments);
    }

    RecurringController.register(recurringModule);

    RecurringController.inject('$scope', '$http', '$scope', '$rootScope', '$stateParams', '$state', 'currentTransaction', '$ionicViewSwitcher');

    RecurringController.prototype.initialize = function() {
      if (!this.$rootScope.currentTransaction) {
        this.$ionicViewSwitcher.nextDirection('back');
        return this.$state.go('index');
      }
    };

    return RecurringController;

  })(BaseController);

}).call(this);

(function() {
  var ReportController, reportModule,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  reportModule = angular.module('narwhal.report');

  ReportController = (function(superClass) {
    extend(ReportController, superClass);

    function ReportController() {
      return ReportController.__super__.constructor.apply(this, arguments);
    }

    ReportController.register(reportModule);

    ReportController.inject('$scope');

    ReportController.prototype.initialize = function() {
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
            }
            animateFadeSlideInDom[0].className += ' done';

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
            console.log(animateSlideInRightDom);
            if ( animateSlideInRightDom.length > 0) {
                animateSlideInRightDom[0].className += ' done';
            }

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

/**
 * angular-locker
 *
 * A simple & configurable abstraction for local/session storage in angular projects.
 *
 * @link https://github.com/tymondesigns/angular-locker
 * @author Sean Tymon @tymondesigns
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root.angular);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(root.angular || (window && window.angular));
    } else {
        factory(root.angular);
    }
})(this, function (angular) {

    'use strict';

    angular.module('angular-locker', [])

    .provider('locker', function () {

        /**
         * If value is a function then execute, otherwise return
         *
         * @param  {Mixed}  value
         * @param  {Mixed}  parameter
         * @return {Mixed}
         */
        var _value = function (value, param) {
            return angular.isFunction(value) ? value(param) : value;
        };

        /**
         * Get the key of an object by the value
         *
         * @param  {Object}  object
         * @param  {Mixed}   value
         * @return {String}
         */
        var _keyByVal = function (object, value) {
            return Object.keys(object).filter(function (key) { return object[key] === value; })[0];
        };

        /**
         * Trigger an error
         *
         * @param  {String}  msg
         * @return {void}
         */
        var _error = function (msg) {
            throw new Error('[angular-locker] ' + msg);
        };

        /**
         * Set the defaults
         *
         * @type {Object}
         */
        var defaults = {
            driver: 'local',
            namespace: 'locker',
            eventsEnabled: true,
            separator: '.'
        };

        return {

            /**
             * Allow setting of default storage driver via `lockerProvider`
             * e.g. lockerProvider.setDefaultDriver('session');
             *
             * @param  {String|Function}  driver
             * @return {self}
             */
            setDefaultDriver: function (driver) {
                defaults.driver = _value(driver);

                return this;
            },

            /**
             * Get the default driver
             *
             * @return {String}
             */
            getDefaultDriver: function () {
                return defaults.driver;
            },

            /**
             * Allow setting of default namespace via `lockerProvider`
             * e.g. lockerProvider.setDefaultNamespace('myAppName');
             *
             * @param  {String|Function}  namespace
             * @return {self}
             */
            setDefaultNamespace: function (namespace) {
                defaults.namespace = _value(namespace);

                return this;
            },

            /**
             * Get the default namespace
             *
             * @return {String}
             */
            getDefaultNamespace: function () {
                return defaults.namespace;
            },

            /**
             * Set whether the events are enabled
             *
             * @param  {Boolean|Function}  enabled
             * @return {self}
             */
            setEventsEnabled: function (enabled) {
                defaults.eventsEnabled = _value(enabled);

                return this;
            },

            /**
             * Get whether the events are enabled
             *
             * @return {Boolean}
             */
            getEventsEnabled: function () {
                return defaults.eventsEnabled;
            },

            /**
             * Set the separator to use with namespace in keys
             *
             * @param  {String|Function} separator
             * @return {self}
             */
            setSeparator: function (separator) {
                defaults.separator = _value(separator);

                return this;
            },

            /**
             * Get the separator
             *
             * @return {String}
             */
            getSeparator: function () {
                return defaults.separator;
            },

            /**
             * The locker service
             */
            $get: ['$window', '$rootScope', '$parse', function ($window, $rootScope, $parse) {

                /**
                 * Define the Locker class
                 *
                 * @param {Storage}  driver
                 * @param {String}   namespace
                 */
                function Locker (driver, namespace) {

                    /**
                     * Out of the box drivers
                     * 
                     * @type {Object}
                     */
                    this._registeredDrivers = {
                        local: $window.localStorage,
                        session: $window.sessionStorage
                    };

                    /**
                     * Get the Storage instance from the key
                     *
                     * @param  {String}  driver
                     * @return {Storage}
                     */
                    this._resolveDriver = function (driver) {
                        if (! this._registeredDrivers.hasOwnProperty(driver)) {
                            _error('The driver "' + driver + '" was not found.');
                        }

                        return this._registeredDrivers[driver];
                    };

                    /**
                     * Get the driver key (local/session) by the Storage instance
                     *
                     * @param  {Storage}  driver
                     * @return {String}
                     */
                    this._deriveDriver = function (driver) {
                        return _keyByVal(this._registeredDrivers, driver);
                    };

                    /**
                     * @type {Storage}
                     */
                    this._driver = this._resolveDriver(driver);

                    /**
                     * @type {String}
                     */
                    this._namespace = namespace;

                    /**
                     * @type {Boolean}
                     */
                    this._eventsEnabled = defaults.eventsEnabled;

                    /**
                     * @type {String}
                     */
                    this._separator = defaults.separator;

                    /**
                     * @type {Object}
                     */
                    this._watchers = {};

                    /**
                     * Check browser support
                     *
                     * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js#L38-L47
                     * @param  {String}  driver
                     * @return {Boolean}
                     */
                    this._checkSupport = function (driver) {
                        if (angular.isUndefined(this._supported)) {
                            var l = 'l';
                            try {
                                this._resolveDriver(driver || 'local').setItem(l, l);
                                this._resolveDriver(driver || 'local').removeItem(l);
                                this._supported = true;
                            } catch (e) {
                                this._supported = false;
                            }
                        }

                        return this._supported;
                    };

                    /**
                     * Build the storage key from the namspace
                     *
                     * @param  {String}  key
                     * @return {String}
                     */
                    this._getPrefix = function (key) {
                        if (! this._namespace) return key;

                        return this._namespace + this._separator + key;
                    };

                    /**
                     * Try to encode value as json, or just return the value upon failure
                     *
                     * @param  {Mixed}  value
                     * @return {Mixed}
                     */
                    this._serialize = function (value) {
                        try {
                            return angular.toJson(value);
                        } catch (e) {
                            return value;
                        }
                    };

                    /**
                     * Try to parse value as json, if it fails then it probably isn't json so just return it
                     *
                     * @param  {String}  value
                     * @return {Object|String}
                     */
                    this._unserialize = function (value) {
                        try {
                            return angular.fromJson(value);
                        } catch (e) {
                            return value;
                        }
                    };

                    /**
                     * Trigger an event
                     *
                     * @param  {String}  name
                     * @param  {Object}  payload
                     * @return {void}
                     */
                    this._event = function (name, payload) {
                        if (! this._eventsEnabled) return;

                        $rootScope.$emit(name, angular.extend(payload, {
                            driver: this._deriveDriver(this._driver),
                            namespace: this._namespace,
                        }));
                    };

                    /**
                     * Add to storage
                     *
                     * @param {String}  key
                     * @param {Mixed}  value
                     */
                    this._setItem = function (key, value) {
                        if (! this._checkSupport()) _error('The browser does not support localStorage');

                        try {
                            var oldVal = this._getItem(key);
                            this._driver.setItem(this._getPrefix(key), this._serialize(value));
                            if (this._exists(key) && ! angular.equals(oldVal, value)) {
                                this._event('locker.item.updated', { key: key, oldValue: oldVal, newValue: value });
                            } else {
                                this._event('locker.item.added', { key: key, value: value });
                            }
                        } catch (e) {
                            if (['QUOTA_EXCEEDED_ERR', 'NS_ERROR_DOM_QUOTA_REACHED', 'QuotaExceededError'].indexOf(e.name) !== -1) {
                                _error('The browser storage quota has been exceeded');
                            } else {
                                _error('Could not add item with key "' + key + '"');
                            }
                        }
                    };

                    /**
                     * Get from storage
                     *
                     * @param  {String}  key
                     * @return {Mixed}
                     */
                    this._getItem = function (key) {
                        if (! this._checkSupport()) _error('The browser does not support localStorage');

                        return this._unserialize(this._driver.getItem(this._getPrefix(key)));
                    };

                    /**
                     * Exists in storage
                     *
                     * @param  {String}  key
                     * @return {Boolean}
                     */
                    this._exists = function (key) {
                        if (! this._checkSupport()) _error('The browser does not support localStorage');

                        return this._driver.hasOwnProperty(this._getPrefix(_value(key)));
                    };

                    /**
                     * Remove from storage
                     *
                     * @param  {String}  key
                     * @return {Boolean}
                     */
                    this._removeItem = function (key) {
                        if (! this._checkSupport()) _error('The browser does not support localStorage');

                        if (! this._exists(key)) return false;
                        this._driver.removeItem(this._getPrefix(key));

                        this._event('locker.item.forgotten', { key: key });

                        return true;
                    };
                }

                /**
                 * Define the public api
                 *
                 * @type {Object}
                 */
                Locker.prototype = {

                    /**
                     * Add a new item to storage (even if it already exists)
                     *
                     * @param  {Mixed}  key
                     * @param  {Mixed}  value
                     * @return {self}
                     */
                    put: function (key, value) {
                        if (! key) return false;
                        key = _value(key);

                        if (angular.isObject(key)) {
                            angular.forEach(key, function (value, key) {
                                this._setItem(key, value);
                            }, this);
                        } else {
                            if (! angular.isDefined(value)) return false;
                            this._setItem(key, _value(value, this._getItem(key)));
                        }

                        return this;
                    },

                    /**
                     * Add an item to storage if it doesn't already exist
                     *
                     * @param  {Mixed}  key
                     * @param  {Mixed}  value
                     * @return {Boolean}
                     */
                    add: function (key, value) {
                        if (! this.has(key)) {
                            this.put(key, value);
                            return true;
                        }

                        return false;
                    },

                    /**
                     * Retrieve the specified item from storage
                     *
                     * @param  {String|Array}  key
                     * @param  {Mixed}  def
                     * @return {Mixed}
                     */
                    get: function (key, def) {
                        if (angular.isArray(key)) {
                            var items = {};
                            angular.forEach(key, function (k) {
                                if (this.has(k)) items[k] = this._getItem(k);
                            }, this);

                            return items;
                        }

                        if (! this.has(key)) return arguments.length === 2 ? def : void 0;

                        return this._getItem(key);
                    },

                    /**
                     * Determine whether the item exists in storage
                     *
                     * @param  {String|Function}  key
                     * @return {Boolean}
                     */
                    has: function (key) {
                        return this._exists(key);
                    },

                    /**
                     * Remove specified item(s) from storage
                     *
                     * @param  {Mixed}  key
                     * @return {Object}
                     */
                    forget: function (key) {
                        key = _value(key);

                        if (angular.isArray(key)) {
                            key.map(this._removeItem, this);
                        } else {
                            this._removeItem(key);
                        }

                        return this;
                    },

                    /**
                     * Retrieve the specified item from storage and then remove it
                     *
                     * @param  {String|Array}  key
                     * @param  {Mixed}  def
                     * @return {Mixed}
                     */
                    pull: function (key, def) {
                        var value = this.get(key, def);
                        this.forget(key);

                        return value;
                    },

                    /**
                     * Return all items in storage within the current namespace/driver
                     *
                     * @return {Object}
                     */
                    all: function () {
                        var items = {};
                        angular.forEach(this._driver, function (value, key) {
                            var split = key.split(this._separator);
                            if (split.length > 1 && split[0] === this._namespace) {
                                split.splice(0, 1);
                                key = split.join(this._separator);
                            }
                            if (this.has(key)) items[key] = this.get(key);
                        }, this);

                        return items;
                    },

                    /**
                     * Remove all items set within the current namespace/driver
                     *
                     * @return {self}
                     */
                    clean: function () {
                        this.forget(Object.keys(this.all()));

                        return this;
                    },

                    /**
                     * Empty the current storage driver completely. careful now.
                     *
                     * @return {self}
                     */
                    empty: function () {
                        this._driver.clear();

                        return this;
                    },

                    /**
                     * Get the total number of items within the current namespace
                     *
                     * @return {Integer}
                     */
                    count: function () {
                        return Object.keys(this.all()).length;
                    },

                    /**
                     * Bind a storage key to a $scope property
                     *
                     * @param  {Object}  $scope
                     * @param  {String}  key
                     * @param  {Mixed}   def
                     * @return {self}
                     */
                    bind: function ($scope, key, def) {
                        if (angular.isUndefined( $scope.$eval(key) )) {
                            $parse(key).assign($scope, this.get(key, def));
                            if (! this.has(key)) this.put(key, def);
                        }

                        var self = this;
                        this._watchers[key + $scope.$id] = $scope.$watch(key, function (newVal) {
                            if (angular.isDefined(newVal)) self.put(key, newVal);
                        }, angular.isObject($scope[key]));

                        return this;
                    },

                    /**
                     * Unbind a storage key from a $scope property
                     *
                     * @param  {Object}  $scope
                     * @param  {String}  key
                     * @return {self}
                     */
                    unbind: function ($scope, key) {
                        $parse(key).assign($scope, void 0);
                        this.forget(key);

                        var watchId = key + $scope.$id;
                        
                        if (this._watchers[watchId]) {
                            // execute the de-registration function
                            this._watchers[watchId]();
                            delete this._watchers[watchId];
                        }

                        return this;
                    },

                    /**
                     * Set the storage driver on a new instance to enable overriding defaults
                     *
                     * @param  {String}  driver
                     * @return {self}
                     */
                    driver: function (driver) {
                        return this.instance(driver, this._namespace);
                    },

                    /**
                     * Get the currently set driver
                     *
                     * @return {Storage}
                     */
                    getDriver: function () {
                        return this._driver;
                    },

                    /**
                     * Set the namespace on a new instance to enable overriding defaults
                     *
                     * @param  {String}  namespace
                     * @return {self}
                     */
                    namespace: function (namespace) {
                        return this.instance(this._deriveDriver(this._driver), namespace);
                    },

                    /**
                     * Get the currently set namespace
                     *
                     * @return {String}
                     */
                    getNamespace: function () {
                        return this._namespace;
                    },

                    /**
                     * Check browser support
                     *
                     * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js#L38-L47
                     * @param  {String}  driver
                     * @return {Boolean}
                     */
                    supported: function (driver) {
                        return this._checkSupport(driver);
                    },

                    /**
                     * Get a new instance of Locker
                     *
                     * @param  {String}  driver
                     * @param  {String}  namespace
                     * @return {Locker}
                     */
                    instance: function (driver, namespace) {
                        return new Locker(driver, namespace);
                    }
                };

                // return the default instance
                return new Locker(defaults.driver, defaults.namespace);
            }]
        };

    });

});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC5jb2ZmZWUiLCJjb250cm9sbGVyL0Jhc2VDb250cm9sbGVyLmNvZmZlZSIsInNlcnZpY2UvVXNlclNlcnZpY2UuY29mZmVlIiwibG9naW4vTG9naW5Nb2R1bGUuY29mZmVlIiwicmVjdXJyaW5nL1JlY3VycmluZ01vZHVsZS5jb2ZmZWUiLCJyZXBvcnQvUmVwb3J0TW9kdWxlLmNvZmZlZSIsImluZGV4L2NvbnRyb2xsZXIvSW5kZXhDb250cm9sbGVyLmNvZmZlZSIsImxvZ2luL2NvbnRyb2xsZXIvTG9naW5Db250cm9sbGVyLmNvZmZlZSIsImxvZ2luL2RpcmVjdGl2ZS9pb25NZElucHV0LmNvZmZlZSIsInJlY3VycmluZy9jb250cm9sbGVyL1JlY3VycmluZ0NvbnRyb2xsZXIuY29mZmVlIiwicmVwb3J0L2NvbnRyb2xsZXIvUmVwb3J0Q29udHJvbGxlci5jb2ZmZWUiLCJtYXRlcmlhbC1pb25pYy5qcyIsIndhdmVzLmpzIiwiYW5ndWxhci1sb2NrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUE7QUFBQSxNQUFBLEdBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmLEVBQTBCLENBQzlCLE9BRDhCLEVBRTlCLGVBRjhCLEVBRzlCLGdCQUg4QixFQUk5QixtQkFKOEIsRUFLOUIsV0FMOEIsRUFNOUIsZ0JBTjhCLENBQTFCLENBQU4sQ0FBQTs7QUFBQSxFQVNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsU0FBQyxjQUFELEVBQWlCLFVBQWpCLEdBQUE7QUFDTixJQUFBLGNBQWMsQ0FBQyxLQUFmLENBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsSUFBbUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBN0M7QUFDRSxRQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im5hcndoYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIjIElvbmljIFN0YXJ0ZXIgQXBwXG4jIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4jICdzdGFydGVyJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuIyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4jICdzdGFydGVyLnNlcnZpY2VzJyBpcyBmb3VuZCBpbiBzZXJ2aWNlcy5qc1xuIyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbmFwcCA9IGFuZ3VsYXIubW9kdWxlKCduYXJ3aGFsJywgW1xuICAnaW9uaWMnXG4gICduYXJ3aGFsLmxvZ2luJ1xuICAnbmFyd2hhbC5yZXBvcnQnXG4gICduYXJ3aGFsLnJlY3VycmluZydcbiAgJ3VpLnJvdXRlcidcbiAgJ2FuZ3VsYXItbG9ja2VyJ1xuXSlcblxuYXBwLnJ1bigoJGlvbmljUGxhdGZvcm0sICRyb290U2NvcGUpIC0+XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5IC0+XG4gICAgY29uc29sZS5sb2cgXCJSZWFkeSFcIlxuICAgIGlmIHdpbmRvdy5jb3Jkb3ZhIGFuZCB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkXG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyIHRydWVcbiAgICBpZiB3aW5kb3cuU3RhdHVzQmFyXG4gICAgICAjIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKVxuXG5cbiAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN0YXJ0JywgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiQ2hhbmdlZCByb3V0ZSB0byAje3RvU3RhdGUudXJsfVwiXG4gICAgY29uc29sZS5sb2cgXCJDaGFuZ2VkIHJvdXRlIHRvICN7dG9TdGF0ZS5uYW1lfVwiXG4gICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VFcnJvcicsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpLT5cbiAgICBjb25zb2xlLmVycm9yICdDb3VsZCBub3QgY2hhbmdlIHN0YXRlJ1xuICAgIGNvbnNvbGUuZXJyb3IgZXJyb3JcbiAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpLT5cbiAgICBjb25zb2xlLmxvZyAnU3VjY2Vzc2Z1bHkgY2hhbmdlZCBzdGF0ZSdcblxuKVxuXG5hcHAuY29uZmlnICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSAtPlxuICAjIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAjIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gICMgU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgIyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2luZGV4JyxcbiAgICB1cmw6ICcvJ1xuICAgIGNvbnRyb2xsZXI6ICdJbmRleENvbnRyb2xsZXInXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaW5kZXguaHRtbCcpXG5cbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSAnLydcblxuXG4gIHJldHVybiIsIiMgQmFzZSBjbGFzcyBmb3IgYW5ndWxhciBjb250cm9sbGVycywgd2hpY2ggZWFzZXMgdGhlIHByb2Nlc3Mgb2YgaW5pdGlhbGl6YXRpb24gYW5kIGRlcGVuZGVuY3kgaW5qZWN0aW9uLlxuIyBUaGlzIGFwcHJvYWNoIGlzIGJhc2VkIG9uIGh0dHA6Ly93d3cuZGV2aWduLm1lL2FuZ3VsYXItZG90LWpzLWNvZmZlZXNjcmlwdC1jb250cm9sbGVyLWJhc2UtY2xhc3NcbiNcbiMgVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgaXQ6XG4jXG4jIHNvbWVBcHBNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnc29tZUFwcCdcbiNcbiMgY2xhc3MgTXlBd2Vzb21lQ29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyXG4jICAgIyByZWdpc3RlciB0aGUgY29udHJvbGxlciBhdCBvdXIgbW9kdWxlXG4jICAgQHJlZ2lzdGVyIHNvbWVBcHBNb2R1bGVcbiMgICAjIGRlcGVuZGVuY2llcyB0byBpbmplY3QsIHdpbGwgYmUgYXZhaWxhYmxlIGFzIG1lbWJlciB2YXJpYWJsZSBlLmcuIEAkc2NvcGVcbiMgICBAaW5qZWN0ICckc2NvcGUnLCAnJGh0dHAnLCAnTXlTZXJ2aWNlJ1xuIyAgICMgY2FsbGVkIGFmdGVyIGluc3RhbnRpYXRpb24gaWYgZXhpc3RzXG4jICAgaW5pdGlhbGl6ZTogLT5cbiMgICAgICMgaW5pdCBzb21lIHN0dWZmIC4uLlxuIyAgIHN1Ym1pdDogLT5cbiMgICAgICMgYm91bmQgdG8gJHNjb3BlIGFuZCB1c2FibGUgaW4gdGVtcGxhdGUgYXV0b21hdGljYWxseVxuI1xuIyBUT0RPOiBBZGQgY2hlY2sgdG8gZW5zdXJlICRzY29wZSBhcyBkZXBlbmRlbmN5IHdoZW4gb25lIG9yIG1vcmUgZnVuY3Rpb25zIGFyZSBkZWZpbmVkIGFzIHRoZXkgYXJlIGJvdW5kIGF1dG9tYXRpY2FsbHlcbiNcbmNsYXNzIEBCYXNlQ29udHJvbGxlclxuICBAcmVnaXN0ZXI6IChhcHAsIG5hbWUpIC0+XG4gICAgbmFtZSA/PSBAbmFtZSB8fCBAdG9TdHJpbmcoKS5tYXRjaCgvZnVuY3Rpb25cXHMqKC4qPylcXCgvKT9bMV1cbiAgICBhcHAuY29udHJvbGxlciBuYW1lLCBAXG5cbiAgQGluamVjdDogKGFyZ3MuLi4pIC0+XG4gICAgQCRpbmplY3QgPSBhcmdzXG5cblxuICBjb25zdHJ1Y3RvcjogKGFyZ3MuLi4pIC0+XG4gICAgZm9yIGtleSwgaW5kZXggaW4gQGNvbnN0cnVjdG9yLiRpbmplY3RcbiAgICAgIEBba2V5XSA9IGFyZ3NbaW5kZXhdXG5cbiAgICBmb3Iga2V5LCBmbiBvZiBAY29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgICBjb250aW51ZSB1bmxlc3MgdHlwZW9mIGZuIGlzICdmdW5jdGlvbidcbiAgICAgIGNvbnRpbnVlIGlmIGtleSBpbiBbJ2NvbnN0cnVjdG9yJywgJ2luaXRpYWxpemUnXSBvciBrZXlbMF0gaXMgJ18nXG4gICAgICBAJHNjb3BlW2tleV0gPSBmbi5iaW5kPyhAKSB8fCBfLmJpbmQoZm4sIEApXG5cbiAgICBAaW5pdGlhbGl6ZT8oKSIsImFwcCA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsJ1xuXG5hcHAuZmFjdG9yeSAnVXNlcicsIFsnJGh0dHAnLCAoJGh0dHApIC0+XG4gIG5ldyBjbGFzcyBVc2VyXG4gICAgY29uc3RydWN0b3I6IC0+XG5cbiAgICBsb2dpbjogKHVzZXJuYW1lLCBwYXNzd29yZCkgLT5cbiAgICAgIHJlcXVlc3QgPSAkaHR0cC5wb3N0ICdodHRwczovL25hbWVsZXNzLXNjcnVibGFuZC00Nzg1Lmhlcm9rdWFwcC5jb20vdjEvc2Vzc2lvbi8nLCB7ZW1haWw6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQgfVxuICAgICAgcmV0dXJuIHJlcXVlc3RcblxuICAgIGdldFRyYW5zYWN0aW9uczogKHNlc3Npb25Ub2tlbikgLT5cbiAgICAgIHJlcXVlc3QgPSAkaHR0cC5nZXQgJ2h0dHBzOi8vbmFtZWxlc3Mtc2NydWJsYW5kLTQ3ODUuaGVyb2t1YXBwLmNvbS92MS90cmFuc2FjdGlvbnMnLCB7IHBhcmFtczogeyBzZXNzaW9uX3Rva2VuOiBzZXNzaW9uVG9rZW4gfX1cbiAgICAgIHJldHVybiByZXF1ZXN0XG5dIiwibG9naW5Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbC5sb2dpbicsIFtdKVxuXG5sb2dpbk1vZHVsZS5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKS0+XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSgnbG9naW4nLFxuICAgIHVybDogJy9sb2dpbi8nXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCdcbiAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJ1xuICApIiwicmVjdXJyaW5nTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25hcndoYWwucmVjdXJyaW5nJywgW10pXG5cbnJlY3VycmluZ01vZHVsZS5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKS0+XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSgncmVjdXJyaW5nJyxcbiAgICB1cmw6ICcvcmVjdXJyaW5nLydcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZWN1cnJpbmcuaHRtbCdcbiAgICBjb250cm9sbGVyOiAnUmVjdXJyaW5nQ29udHJvbGxlcidcbiAgICByZXNvbHZlOlxuICAgICAgY3VycmVudFRyYW5zYWN0aW9uOiBbJyRyb290U2NvcGUnLCAoJHJvb3RTY29wZSktPlxuICAgICAgICByZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50VHJhbnNhY3Rpb25cbiAgICAgIF1cbiAgKSIsInJlcG9ydE1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCduYXJ3aGFsLnJlcG9ydCcsIFtdKVxuXG5yZXBvcnRNb2R1bGUuY29uZmlnICgkc3RhdGVQcm92aWRlciktPlxuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUoJ3JlcG9ydCcsXG4gICAgdXJsOiAnL3JlcG9ydC8nXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcmVwb3J0Lmh0bWwnXG4gICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInXG4gICkiLCJhcHAgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbCdcblxuY2xhc3MgSW5kZXhDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXJcblxuICBAcmVnaXN0ZXIgYXBwXG4gIEBpbmplY3QgJyRzY29wZScsICckaHR0cCcsICckc3RhdGUnLCAnJHJvb3RTY29wZScsICAnVXNlcicsICdsb2NrZXInXG5cbiAgaW5pdGlhbGl6ZTogKCk9PlxuICAgIEAkc2NvcGUudHJhbnNhY3Rpb25zID0gW11cbiAgICBAbG9hZFRyYW5zYWN0aW9ucygpXG4gICAgaWYgQGxvY2tlci5oYXMgJ3Nlc3Npb25fdG9rZW4nXG4gICAgICBAJHJvb3RTY29wZS5zZXNzaW9uX3Rva2VuID0gQGxvY2tlci5nZXQgJ3Nlc3Npb25fdG9rZW4nXG5cbiAgICBpZiBAbG9ja2VyLmhhcyAndHJhbnNhY3Rpb25zJ1xuICAgICAgQCRzY29wZS50cmFuc2FjdGlvbnMgPSBAbG9ja2VyLmdldCAndHJhbnNhY3Rpb25zJ1xuICAgICAgaW9uaWMuRG9tVXRpbC5yZWFkeSggKCktPlxuICAgICAgICBNaS5tb3Rpb24uZmFkZVNsaWRlSW5SaWdodCh7c2VsZWN0b3I6ICcuYW5pbWF0ZS1mYWRlLXNsaWRlLWluLXJpZ2h0ID4gKid9KVxuICAgICAgKVxuICAgICAgXG4gIGxvZ291dDogKCktPlxuICAgIEBsb2NrZXIuZm9yZ2V0KCdzZXNzaW9uX3Rva2VuJylcbiAgICBAJHN0YXRlLmdvICdsb2dpbidcblxuICByZWZyZXNoOiAoKS0+XG4gICAgQGxvYWRUcmFuc2FjdGlvbnMoKVxuICAgIEAkc2NvcGUuJGJyb2FkY2FzdCgnc2Nyb2xsLnJlZnJlc2hDb21wbGV0ZScpXG4gICAgc2V0VGltZW91dChNaS5tb3Rpb24uZmFkZVNsaWRlSW5SaWdodCh7XG4gICAgICBzZWxlY3RvcjogJy5hbmltYXRlLWZhZGUtc2xpZGUtaW4tcmlnaHQgPiAqJ1xuICAgIH0pLCAxMClcblxuICBsb2FkVHJhbnNhY3Rpb25zOiAoKT0+XG4gICAgQFVzZXIuZ2V0VHJhbnNhY3Rpb25zKEAkcm9vdFNjb3BlLnNlc3Npb25fdG9rZW4pLnRoZW4gKHJlc3VsdCk9PlxuICAgICAgQCRzY29wZS50cmFuc2FjdGlvbnMgPSByZXN1bHQuZGF0YVxuICAgICAgQGxvY2tlci5wdXQgJ3RyYW5zYWN0aW9ucycsIEAkc2NvcGUudHJhbnNhY3Rpb25zXG5cbiAgZ2V0UmFuZG9tQW1vdW50OiAoKT0+XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMDApIC8gMTAwXG5cbiAgc2hvd1RyYW5zYWN0aW9uOiAodHJhbnNhY3Rpb24pLT5cbiAgICBjb25zb2xlLmxvZyBcIkN1cnJlbnQgVHJhbnNhY3Rpb25cIlxuICAgIGNvbnNvbGUubG9nIHRyYW5zYWN0aW9uXG4gICAgQCRyb290U2NvcGUuY3VycmVudFRyYW5zYWN0aW9uID0gdHJhbnNhY3Rpb25cbiAgICBAJHN0YXRlLmdvKCdyZWN1cnJpbmcnKVxuXG4iLCJsb2dpbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsLmxvZ2luJ1xuXG5jbGFzcyBMb2dpbkNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuXG4gIEByZWdpc3RlciBsb2dpbk1vZHVsZVxuICBAaW5qZWN0ICckc2NvcGUnLCAnJGh0dHAnLCAnJHN0YXRlJywgJ1VzZXInLCAnJHJvb3RTY29wZScsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnbG9ja2VyJ1xuXG4gIGxvZ2luOiAoKT0+XG4gICAgQCRzY29wZS5pc0xvYWRpbmcgPSB0cnVlXG4gICAgQFVzZXIubG9naW4oQCRzY29wZS51c2VybmFtZSwgQCRzY29wZS5wYXNzd29yZCkudGhlbiggKHJlc3VsdCk9PlxuICAgICAgQCRzY29wZS5pc0xvYWRpbmcgPSBmYWxzZVxuXG4gICAgICBAJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24gJ3N3YXAnXG4gICAgICBAJHJvb3RTY29wZS5zZXNzaW9uX3Rva2VuID0gcmVzdWx0LmRhdGEuc2Vzc2lvbl90b2tlblxuXG4gICAgICBAbG9ja2VyLnB1dCAnc2Vzc2lvbl90b2tlbicsIEAkcm9vdFNjb3BlLnNlc3Npb25fdG9rZW5cblxuICAgICAgQCRzdGF0ZS5nbyAnaW5kZXgnXG4gICAgKVxuXG4gIGluaXRpYWxpemU6ICgpPT5cbiAgICBAJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24gJ3N3YXAnXG4gICAgY29uc29sZS5sb2cgXCJpbml0aWFsaXplZCBsb2dpbiBtb2R1bGVcIlxuXG4gICAgaWYgQGxvY2tlci5nZXQoJ3Nlc3Npb25fdG9rZW4nKVxuICAgICAgQCRyb290U2NvcGUuc2Vzc2lvbl90b2tlbiA9IEBsb2NrZXIuZ2V0KCdzZXNzaW9uX3Rva2VuJylcblxuIiwiYW5ndWxhci5tb2R1bGUoJ25hcndoYWwubG9naW4nKS5kaXJlY3RpdmUgJ2lvbk1kSW5wdXQnLCAtPlxuICB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcGxhY2U6IHRydWVcbiAgICByZXF1aXJlOiAnP25nTW9kZWwnXG4gICAgdGVtcGxhdGU6ICc8bGFiZWwgY2xhc3M9XCJpdGVtIGl0ZW0taW5wdXQgaXRlbS1tZC1sYWJlbFwiPicgKyAnPGlucHV0IHR5cGU9XCJ0ZXh0XCI+JyArICc8c3BhbiBjbGFzcz1cImlucHV0LWxhYmVsXCI+PC9zcGFuPicgKyAnPGRpdiBjbGFzcz1cImhpZ2hsaWdodFwiPjwvZGl2PicgKyAnPC9sYWJlbD4nXG4gICAgY29tcGlsZTogKGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBoaWdobGlnaHQgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5oaWdobGlnaHQnKVxuICAgICAgaGlnaGxpZ2h0Q29sb3IgPSB1bmRlZmluZWRcbiAgICAgIGlmICFhdHRyLmhpZ2hsaWdodENvbG9yXG4gICAgICAgIGhpZ2hsaWdodENvbG9yID0gJ2NhbG0nXG4gICAgICBlbHNlXG4gICAgICAgIGhpZ2hsaWdodENvbG9yID0gYXR0ci5oaWdobGlnaHRDb2xvclxuICAgICAgaGlnaGxpZ2h0LmNsYXNzTmFtZSArPSAnIGhpZ2hsaWdodC0nICsgaGlnaGxpZ2h0Q29sb3JcbiAgICAgIGxhYmVsID0gZWxlbWVudC5maW5kKCdzcGFuJylcbiAgICAgIGxhYmVsLmh0bWwgYXR0ci5wbGFjZWhvbGRlclxuICAgICAgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0JylcbiAgICAgIGlucHV0LmJpbmQgJ2JsdXInLCAtPlxuICAgICAgICBjb25zb2xlLmxvZyAnYmx1cidcbiAgICAgICAgaWYgaW5wdXQudmFsKClcbiAgICAgICAgICBpbnB1dC5hZGRDbGFzcyAndXNlZCdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlucHV0LnJlbW92ZUNsYXNzICd1c2VkJ1xuICAgICAgICByZXR1cm5cbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCB7XG4gICAgICAgICduYW1lJzogYXR0ci5uYW1lXG4gICAgICAgICd0eXBlJzogYXR0ci50eXBlXG4gICAgICAgICduZy12YWx1ZSc6IGF0dHIubmdWYWx1ZVxuICAgICAgICAnbmctbW9kZWwnOiBhdHRyLm5nTW9kZWxcbiAgICAgICAgJ3JlcXVpcmVkJzogYXR0ci5yZXF1aXJlZFxuICAgICAgICAnbmctcmVxdWlyZWQnOiBhdHRyLm5nUmVxdWlyZWRcbiAgICAgICAgJ25nLW1pbmxlbmd0aCc6IGF0dHIubmdNaW5sZW5ndGhcbiAgICAgICAgJ25nLW1heGxlbmd0aCc6IGF0dHIubmdNYXhsZW5ndGhcbiAgICAgICAgJ25nLXBhdHRlcm4nOiBhdHRyLm5nUGF0dGVyblxuICAgICAgICAnbmctY2hhbmdlJzogYXR0ci5uZ0NoYW5nZVxuICAgICAgICAnbmctdHJpbSc6IGF0dHIudHJpbVxuICAgICAgICAnbmctYmx1cic6IGF0dHIubmdCbHVyXG4gICAgICAgICduZy1mb2N1cyc6IGF0dHIubmdGb2N1c1xuICAgICAgfSwgKHZhbHVlLCBuYW1lKSAtPlxuICAgICAgICBpZiBhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSlcbiAgICAgICAgICBpbnB1dC5hdHRyIG5hbWUsIHZhbHVlXG4gICAgICAgIHJldHVyblxuXG4gICAgICBjbGVhblVwID0gLT5cbiAgICAgICAgaW9uaWMub2ZmICckZGVzdHJveScsIGNsZWFuVXAsIGVsZW1lbnRbMF1cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlvbmljLm9uICckZGVzdHJveScsIGNsZWFuVXAsIGVsZW1lbnRbMF1cbiAgICAgIHJldHVyblxuXG4gIH1cbiIsInJlY3VycmluZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsLnJlY3VycmluZydcblxuY2xhc3MgUmVjdXJyaW5nQ29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyXG5cbiAgQHJlZ2lzdGVyIHJlY3VycmluZ01vZHVsZVxuICBAaW5qZWN0ICckc2NvcGUnLCAnJGh0dHAnLCAnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgICckc3RhdGUnLCAnY3VycmVudFRyYW5zYWN0aW9uJywgJyRpb25pY1ZpZXdTd2l0Y2hlcidcblxuICBpbml0aWFsaXplOiAoKS0+XG4gICAgaWYgIUAkcm9vdFNjb3BlLmN1cnJlbnRUcmFuc2FjdGlvblxuICAgICAgQCRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uICdiYWNrJ1xuICAgICAgQCRzdGF0ZS5nbyAnaW5kZXgnXG4iLCJyZXBvcnRNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbC5yZXBvcnQnXG5cbmNsYXNzIFJlcG9ydENvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuXG4gIEByZWdpc3RlciByZXBvcnRNb2R1bGVcbiAgQGluamVjdCAnJHNjb3BlJ1xuXG4gIGluaXRpYWxpemU6ICgpLT5cbiAgICBzZXRUaW1lb3V0KCAoKS0+XG4gICAgICBNaS5tb3Rpb24uYmxpbmRzRG93bih7IHNlbGVjdG9yOiAnLmNhcmQnfSlcbiAgICAsIDUwMClcbiIsIi8vIEV4dGVuZCBuYW1lc3BhY2UgaWYgbWkgaXMgYWxyZWFkeSBkZWZpbmVkXG52YXIgTWkgPSBNaSB8fCB7fTtcblxuXG4vLyBNaSBsaWJyYXJ5IHJldHVybmVkIGZyb20gY2xvc3VyZVxuTWkgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIC8qIExpYnJhcnkgQ29uc3RhbnRzIChFWFBPUlQpXG4gICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuICAgIHZhciB2ZXJzaW9uID0gJzAuMC4xJztcblxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAvKiBIRUxQRVJTIChub24tZXhwb3J0cylcbiAgICAgLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09KlxuICAgICAvICAgQWJzdHJhY3QgY29tbW9uIGxvb2t1cHMgYW5kIG1hbmlwdWxhdGlvbnMgaW4gY2FzZSBiZXR0ZXIgYWx0ZXJuYXRpdmVzXG4gICAgIC8gICBhcmlzZSBvciBmdXR1cmUgY3Jvc3MtcGxhdGZvcm0gZGlmZmVyZW5jZXMgd2FycmFudCBzZXBhcmF0ZSBoYW5kbGluZ1xuICAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgZnVuY3Rpb24gZ2V0Vmlld3BvcnRIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGRvbU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGRvbU5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0O1xuICAgIH1cblxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAvKiBNT1RJT04gKEVYUE9SVClcbiAgICAgLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09KlxuICAgICAvICAgQW5pbWF0aW9uIG1ldGhvZHMgZm9yIHRoZSBsaWJyYXJ5XG4gICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICAvLyBIb2lzdGluZyB0aGUgYW5pbWF0aW9uIGZ1bmN0aW9ucyBpbnRvIG91ciBtb3Rpb24gb2JqZWN0XG4gICAgdmFyIG1vdGlvbiA9IHtcbiAgICAgICAgYmxpbmRzRG93bjogYmxpbmRzRG93bixcbiAgICAgICAgZmFkZVNsaWRlSW46IGZhZGVTbGlkZUluLFxuICAgICAgICBmYWRlU2xpZGVJblJpZ2h0OiBmYWRlU2xpZGVJblJpZ2h0LFxuICAgICAgICBwYW5JbkxlZnQ6IHBhbkluTGVmdCxcbiAgICAgICAgcHVzaERvd246IHB1c2hEb3duLFxuICAgICAgICBzbGlkZVVwOiBzbGlkZVVwXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGJsaW5kc0Rvd24ob3B0aW9ucykge1xuXG4gICAgICAgIC8vIERlY2xhcmUgb3VyIGRlZmF1bHRzXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGZpbmlzaERlbGF5VGhyb3R0bGU6IDIsXG4gICAgICAgICAgICBmaW5pc2hTcGVlZFBlcmNlbnQ6IDAuNSxcbiAgICAgICAgICAgIGxlZnRPZmZzZXRQZXJjZW50YWdlOiAwLjgsXG4gICAgICAgICAgICBzdGFydFZlbG9jaXR5OiAxMTAwXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQXBwbHkgZGVmYXVsdHMgaWYgcHJvcGVydGllcyBhcmUgbm90IHBhc3NlZFxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgPSBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgfHwgZGVmYXVsdHMuZmluaXNoRGVsYXlUaHJvdHRsZTtcbiAgICAgICAgb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgPSBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCB8fCBkZWZhdWx0cy5maW5pc2hTcGVlZFBlcmNlbnQ7XG4gICAgICAgIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgPSBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlIHx8IGRlZmF1bHRzLmxlZnRPZmZzZXRQZXJjZW50YWdlO1xuICAgICAgICBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgPSBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgfHwgZGVmYXVsdHMuc3RhcnRWZWxvY2l0eTtcblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGJsaW5kc0Rvd24gc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlQmxpbmRzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IDA7XG5cbiAgICAgICAgLy8gQ291bnQgdGhlIGVsZW1lbnRzIHdpdGhpbiB0aGUgc3RhcnRpbmcgdmlld3BvcnQgc28gd2UncmUgbm90IGV4YWN0aW5nXG4gICAgICAgIC8vIG1vcmUgZWZmb3J0IHRoYW4gcmVxdWlyZWQuLi5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgdXNlIGNzcyB2aXNpYmxpdHk6IGhpZGRlbiBpbnN0ZWFkIG9mIGRpc3BsYXk6IG5vbmUgc28gdGhlIGVsZW1lbnRzXG4gICAgICAgIC8vIG1haW50YWluIHRoZWlyIERPTSBmbG93XG5cbiAgICAgICAgdmFyIHZpZXdwb3J0SGVpZ2h0ID0gZ2V0Vmlld3BvcnRIZWlnaHQoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbmltYXRlQmxpbmRzRG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5pbWF0ZUJsaW5kc0RvbVtpXS5vZmZzZXRUb3AgPCB2aWV3cG9ydEhlaWdodCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRBbmltYXRpb25Db3VudCArPSAxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXF1ZW50aWFsbHkgYW5pbWF0ZSB3aXRoIGEgZGVsYXkgYmFzZWQgb24gcHJveGltaXR5XG4gICAgICAgIHZhciBzcGVlZCA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZUJsaW5kc0RvbVtpXTtcbiAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNoaWxkT2Zmc2V0LmxlZnQgKiBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlICsgY2hpbGRPZmZzZXQudG9wO1xuICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChvZmZzZXQgLyBzcGVlZCkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLndlYmtpdFRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuY2xhc3NOYW1lICs9ICcgaW4nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2hlbiB3ZSdyZSBkb25lIGFuaW1hdGluZywgc3dpdGNoIHRoZSBjbGFzcyB0byAnZG9uZSdcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlQmxpbmRzRG9tW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KG9mZnNldCAvIHNwZWVkIC8gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgIGNoaWxkLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLnN0eWxlLndlYmtpdFRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICAgICAgY2hpbGQucXVlcnlTZWxlY3RvcignaW1nJykuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgICAgICAvL2NoaWxkLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLmNsYXNzTmFtZSArPSAnIGluJztcbiAgICAgICAgICAgICAgICBhbmltYXRlQmxpbmRzRG9tW2ldLnBhcmVudE5vZGUuY2xhc3NOYW1lICs9ICcgZG9uZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgc3BlZWQgKiBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmFkZVNsaWRlSW4ob3B0aW9ucykge1xuXG4gICAgICAgIC8vIERlY2xhcmUgb3VyIGRlZmF1bHRzXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGZpbmlzaERlbGF5VGhyb3R0bGU6IDIsXG4gICAgICAgICAgICBmaW5pc2hTcGVlZFBlcmNlbnQ6IDAuNzIsXG4gICAgICAgICAgICBsZWZ0T2Zmc2V0UGVyY2VudGFnZTogMC44LFxuICAgICAgICAgICAgc3RhcnRWZWxvY2l0eTogMTEwMFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFwcGx5IGRlZmF1bHRzIGlmIHByb3BlcnRpZXMgYXJlIG5vdCBwYXNzZWRcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlID0gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlIHx8IGRlZmF1bHRzLmZpbmlzaERlbGF5VGhyb3R0bGU7XG4gICAgICAgIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50ID0gb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgfHwgZGVmYXVsdHMuZmluaXNoU3BlZWRQZXJjZW50O1xuICAgICAgICBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlID0gb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSB8fCBkZWZhdWx0cy5sZWZ0T2Zmc2V0UGVyY2VudGFnZTtcbiAgICAgICAgb3B0aW9ucy5zdGFydFZlbG9jaXR5ID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5IHx8IGRlZmF1bHRzLnN0YXJ0VmVsb2NpdHk7XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBmYWRlU2xpZGVJbiBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVGYWRlU2xpZGVJbkRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBlbGVtZW50QW5pbWF0aW9uQ291bnQgPSAwO1xuXG4gICAgICAgIC8vIENvdW50IHRoZSBlbGVtZW50cyB3aXRoaW4gdGhlIHN0YXJ0aW5nIHZpZXdwb3J0IHNvIHdlJ3JlIG5vdCBleGFjdGluZ1xuICAgICAgICAvLyBtb3JlIGVmZm9ydCB0aGFuIHJlcXVpcmVkLi4uXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIHVzZSBjc3MgdmlzaWJsaXR5OiBoaWRkZW4gaW5zdGVhZCBvZiBkaXNwbGF5OiBub25lIHNvIHRoZSBlbGVtZW50c1xuICAgICAgICAvLyBtYWludGFpbiB0aGVpciBET00gZmxvd1xuXG4gICAgICAgIHZhciB2aWV3cG9ydEhlaWdodCA9IGdldFZpZXdwb3J0SGVpZ2h0KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5pbWF0ZUZhZGVTbGlkZUluRG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5pbWF0ZUZhZGVTbGlkZUluRG9tW2ldLm9mZnNldFRvcCA8IHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudEFuaW1hdGlvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlcXVlbnRpYWxseSBhbmltYXRlIHdpdGggYSBkZWxheSBiYXNlZCBvbiBwcm94aW1pdHlcbiAgICAgICAgdmFyIHNwZWVkID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlRmFkZVNsaWRlSW5Eb21baV07XG4gICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQob2Zmc2V0IC8gc3BlZWQpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS53ZWJraXRUcmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTmFtZSArPSAnIGluJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdoZW4gd2UncmUgZG9uZSBhbmltYXRpbmcsIHN3aXRjaCB0aGUgY2xhc3MgdG8gJ2RvbmUnXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZUZhZGVTbGlkZUluRG9tW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXlWYWx1ZSA9IG9mZnNldCAvIHNwZWVkIC8gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlO1xuICAgICAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQoZGVsYXlWYWx1ZSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuaW1hdGVGYWRlU2xpZGVJbkRvbVswXS5jbGFzc05hbWUgKz0gJyBkb25lJztcblxuICAgICAgICB9LCBzcGVlZCAqIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmYWRlU2xpZGVJblJpZ2h0KG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBEZWNsYXJlIG91ciBkZWZhdWx0c1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBmaW5pc2hEZWxheVRocm90dGxlOiAyLFxuICAgICAgICAgICAgZmluaXNoU3BlZWRQZXJjZW50OiAwLjcyLFxuICAgICAgICAgICAgbGVmdE9mZnNldFBlcmNlbnRhZ2U6IDAuOCxcbiAgICAgICAgICAgIHN0YXJ0VmVsb2NpdHk6IDExMDBcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBcHBseSBkZWZhdWx0cyBpZiBwcm9wZXJ0aWVzIGFyZSBub3QgcGFzc2VkXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSA9IG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSB8fCBkZWZhdWx0cy5maW5pc2hEZWxheVRocm90dGxlO1xuICAgICAgICBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCA9IG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50IHx8IGRlZmF1bHRzLmZpbmlzaFNwZWVkUGVyY2VudDtcbiAgICAgICAgb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSA9IG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgfHwgZGVmYXVsdHMubGVmdE9mZnNldFBlcmNlbnRhZ2U7XG4gICAgICAgIG9wdGlvbnMuc3RhcnRWZWxvY2l0eSA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eSB8fCBkZWZhdWx0cy5zdGFydFZlbG9jaXR5O1xuXG4gICAgICAgIC8vIEZhaWwgZWFybHkgJiBzaWxlbnRseSBsb2dcbiAgICAgICAgdmFyIGlzSW52YWxpZFNlbGVjdG9yID0gdHlwZW9mIG9wdGlvbnMuc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuc2VsZWN0b3IgPT09ICcnO1xuXG4gICAgICAgIGlmIChpc0ludmFsaWRTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgZmFkZVNsaWRlSW5SaWdodCBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVTbGlkZUluUmlnaHREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gMDtcblxuICAgICAgICAvLyBDb3VudCB0aGUgZWxlbWVudHMgd2l0aGluIHRoZSBzdGFydGluZyB2aWV3cG9ydCBzbyB3ZSdyZSBub3RcbiAgICAgICAgLy8gZXhhY3RpbmcgbW9yZSBlZmZvcnQgdGhhbiByZXF1aXJlZC4uLlxuICAgICAgICAvL1xuICAgICAgICAvLyBXZSB1c2UgY3NzIHZpc2libGl0eTogaGlkZGVuIGluc3RlYWQgb2YgZGlzcGxheTogbm9uZSBzbyB0aGVcbiAgICAgICAgLy8gZWxlbWVudHMgbWFpbnRhaW4gdGhlaXIgRE9NIGZsb3dcblxuICAgICAgICB2YXIgdmlld3BvcnRIZWlnaHQgPSBnZXRWaWV3cG9ydEhlaWdodCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuaW1hdGVTbGlkZUluUmlnaHREb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhbmltYXRlU2xpZGVJblJpZ2h0RG9tW2ldLm9mZnNldFRvcCA8IHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudEFuaW1hdGlvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlcXVlbnRpYWxseSBhbmltYXRlIHdpdGggYSBkZWxheSBiYXNlZCBvbiBwcm94aW1pdHlcbiAgICAgICAgdmFyIHNwZWVkID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlU2xpZGVJblJpZ2h0RG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNoaWxkT2Zmc2V0ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KG9mZnNldCAvIHNwZWVkKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUud2Via2l0VHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5jbGFzc05hbWUgKz0gJyBpbic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXaGVuIHdlJ3JlIGRvbmUgYW5pbWF0aW5nLCBzd2l0Y2ggdGhlIGNsYXNzIHRvICdkb25lJ1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGFuaW1hdGVTbGlkZUluUmlnaHREb21baV07XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkT2Zmc2V0ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNoaWxkT2Zmc2V0LmxlZnQgKiBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlICsgY2hpbGRPZmZzZXQudG9wO1xuICAgICAgICAgICAgICAgIHZhciBkZWxheVZhbHVlID0gb2Zmc2V0IC8gc3BlZWQgLyBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGU7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChkZWxheVZhbHVlKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coYW5pbWF0ZVNsaWRlSW5SaWdodERvbSk7XG4gICAgICAgICAgICBpZiAoIGFuaW1hdGVTbGlkZUluUmlnaHREb20ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVTbGlkZUluUmlnaHREb21bMF0uY2xhc3NOYW1lICs9ICcgZG9uZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgc3BlZWQgKiBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFuSW5MZWZ0KG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBXZSBoYXZlIGEgc2luZ2xlIG9wdGlvbiwgc28gaXQgbWF5IGJlIHBhc3NlZCBhcyBhIHN0cmluZyBvciBwcm9wZXJ0eVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBvcHRpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBwdXNoRG93biBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVQYW5JbkxlZnREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gYW5pbWF0ZVBhbkluTGVmdERvbS5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gYW5pbWF0ZVBhbkluTGVmdERvbVtpXTtcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWVUb1JlbW92ZSA9ICdhbmltYXRlLXBhbi1pbi1sZWZ0JztcbiAgICAgICAgICAgIHZhciBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUgPSBlbGVtZW50LmNsYXNzTmFtZS5sYXN0SW5kZXhPZihjbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnN1YnN0cigwLCBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHVzaERvd24ob3B0aW9ucykge1xuXG4gICAgICAgIC8vIFdlIGhhdmUgYSBzaW5nbGUgb3B0aW9uLCBzbyBpdCBtYXkgYmUgcGFzc2VkIGFzIGEgc3RyaW5nIG9yIHByb3BlcnR5XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IG9wdGlvbnNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIHB1c2hEb3duIHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZVB1c2hEb3duRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IGFuaW1hdGVQdXNoRG93bkRvbS5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gYW5pbWF0ZVB1c2hEb3duRG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZVRvUmVtb3ZlID0gb3B0aW9ucy5zZWxlY3Rvci5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgdmFyIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSA9IGVsZW1lbnQuY2xhc3NOYW1lLmxhc3RJbmRleE9mKGNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUuc3Vic3RyKDAsIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzbGlkZVVwKG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBXZSBoYXZlIGEgc2luZ2xlIG9wdGlvbiwgc28gaXQgbWF5IGJlIHBhc3NlZCBhcyBhIHN0cmluZyBvciBwcm9wZXJ0eVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBvcHRpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBwdXNoRG93biBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVTbGlkZVVwRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IGFuaW1hdGVTbGlkZVVwRG9tLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBhbmltYXRlU2xpZGVVcERvbVtpXTtcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWVUb1JlbW92ZSA9IG9wdGlvbnMuc2VsZWN0b3Iuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIHZhciBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUgPSBlbGVtZW50LmNsYXNzTmFtZS5sYXN0SW5kZXhPZihjbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnN1YnN0cigwLCBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyogRXhwb3J0IG9iamVjdFxuICAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbW90aW9uOiBtb3Rpb24sXG4gICAgICAgIHZlcnNpb246IHZlcnNpb25cbiAgICB9XG5cbn0pKCk7XG4iLCIvKiFcbiAqIFdhdmVzIHYwLjYuM1xuICogaHR0cDovL2ZpYW4ubXkuaWQvV2F2ZXMgXG4gKiBcbiAqIENvcHlyaWdodCAyMDE0IEFsZmlhbmEgRS4gU2lidWVhIGFuZCBvdGhlciBjb250cmlidXRvcnMgXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmlhbnMvV2F2ZXMvYmxvYi9tYXN0ZXIvTElDRU5TRSBcbiAqL1xuXG47KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBXYXZlcyA9IFdhdmVzIHx8IHt9O1xuICAgIHZhciAkJCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwuYmluZChkb2N1bWVudCk7XG5cbiAgICAvLyBGaW5kIGV4YWN0IHBvc2l0aW9uIG9mIGVsZW1lbnRcbiAgICBmdW5jdGlvbiBpc1dpbmRvdyhvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiBvYmogPT09IG9iai53aW5kb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0V2luZG93KGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGlzV2luZG93KGVsZW0pID8gZWxlbSA6IGVsZW0ubm9kZVR5cGUgPT09IDkgJiYgZWxlbS5kZWZhdWx0VmlldztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvZmZzZXQoZWxlbSkge1xuICAgICAgICB2YXIgZG9jRWxlbSwgd2luLFxuICAgICAgICAgICAgYm94ID0ge3RvcDogMCwgbGVmdDogMH0sXG4gICAgICAgICAgICBkb2MgPSBlbGVtICYmIGVsZW0ub3duZXJEb2N1bWVudDtcblxuICAgICAgICBkb2NFbGVtID0gZG9jLmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICBpZiAodHlwZW9mIGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICE9PSB0eXBlb2YgdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBib3ggPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIHdpbiA9IGdldFdpbmRvdyhkb2MpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBib3gudG9wICsgd2luLnBhZ2VZT2Zmc2V0IC0gZG9jRWxlbS5jbGllbnRUb3AsXG4gICAgICAgICAgICBsZWZ0OiBib3gubGVmdCArIHdpbi5wYWdlWE9mZnNldCAtIGRvY0VsZW0uY2xpZW50TGVmdFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnZlcnRTdHlsZShvYmopIHtcbiAgICAgICAgdmFyIHN0eWxlID0gJyc7XG5cbiAgICAgICAgZm9yICh2YXIgYSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoYSkpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSAoYSArICc6JyArIG9ialthXSArICc7Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgfVxuXG4gICAgdmFyIEVmZmVjdCA9IHtcblxuICAgICAgICAvLyBFZmZlY3QgZGVsYXlcbiAgICAgICAgZHVyYXRpb246IDc1MCxcblxuICAgICAgICBzaG93OiBmdW5jdGlvbihlLCBlbGVtZW50KSB7XG5cbiAgICAgICAgICAgIC8vIERpc2FibGUgcmlnaHQgY2xpY2tcbiAgICAgICAgICAgIGlmIChlLmJ1dHRvbiA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVsID0gZWxlbWVudCB8fCB0aGlzO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgcmlwcGxlXG4gICAgICAgICAgICB2YXIgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByaXBwbGUuY2xhc3NOYW1lID0gJ3dhdmVzLXJpcHBsZSc7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChyaXBwbGUpO1xuXG4gICAgICAgICAgICAvLyBHZXQgY2xpY2sgY29vcmRpbmF0ZSBhbmQgZWxlbWVudCB3aXRkaFxuICAgICAgICAgICAgdmFyIHBvcyAgICAgICAgID0gb2Zmc2V0KGVsKTtcbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVkgICA9IChlLnBhZ2VZIC0gcG9zLnRvcCk7XG4gICAgICAgICAgICB2YXIgcmVsYXRpdmVYICAgPSAoZS5wYWdlWCAtIHBvcy5sZWZ0KTtcbiAgICAgICAgICAgIHZhciBzY2FsZSAgICAgICA9ICdzY2FsZSgnKygoZWwuY2xpZW50V2lkdGggLyAxMDApICogMykrJyknO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBTdXBwb3J0IGZvciB0b3VjaCBkZXZpY2VzXG4gICAgICAgICAgICBpZiAoJ3RvdWNoZXMnIGluIGUpIHtcbiAgICAgICAgICAgICAgcmVsYXRpdmVZICAgPSAoZS50b3VjaGVzWzBdLnBhZ2VZIC0gcG9zLnRvcCk7XG4gICAgICAgICAgICAgIHJlbGF0aXZlWCAgID0gKGUudG91Y2hlc1swXS5wYWdlWCAtIHBvcy5sZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQXR0YWNoIGRhdGEgdG8gZWxlbWVudFxuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJywgRGF0ZS5ub3coKSk7XG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdkYXRhLXNjYWxlJywgc2NhbGUpO1xuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnZGF0YS14JywgcmVsYXRpdmVYKTtcbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEteScsIHJlbGF0aXZlWSk7XG5cbiAgICAgICAgICAgIC8vIFNldCByaXBwbGUgcG9zaXRpb25cbiAgICAgICAgICAgIHZhciByaXBwbGVTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAndG9wJzogcmVsYXRpdmVZKydweCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiByZWxhdGl2ZVgrJ3B4J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmlwcGxlLmNsYXNzTmFtZSA9IHJpcHBsZS5jbGFzc05hbWUgKyAnIHdhdmVzLW5vdHJhbnNpdGlvbic7XG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGNvbnZlcnRTdHlsZShyaXBwbGVTdHlsZSkpO1xuICAgICAgICAgICAgcmlwcGxlLmNsYXNzTmFtZSA9IHJpcHBsZS5jbGFzc05hbWUucmVwbGFjZSgnd2F2ZXMtbm90cmFuc2l0aW9uJywgJycpO1xuXG4gICAgICAgICAgICAvLyBTY2FsZSB0aGUgcmlwcGxlXG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0nXSA9IHNjYWxlO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy1tb3otdHJhbnNmb3JtJ10gPSBzY2FsZTtcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctbXMtdHJhbnNmb3JtJ10gPSBzY2FsZTtcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctby10cmFuc2Zvcm0nXSA9IHNjYWxlO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGUudHJhbnNmb3JtID0gc2NhbGU7XG4gICAgICAgICAgICByaXBwbGVTdHlsZS5vcGFjaXR5ICAgPSAnMSc7XG5cbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctd2Via2l0LXRyYW5zaXRpb24tZHVyYXRpb24nXSA9IEVmZmVjdC5kdXJhdGlvbiArICdtcyc7XG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLW1vei10cmFuc2l0aW9uLWR1cmF0aW9uJ10gICAgPSBFZmZlY3QuZHVyYXRpb24gKyAnbXMnO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy1vLXRyYW5zaXRpb24tZHVyYXRpb24nXSAgICAgID0gRWZmZWN0LmR1cmF0aW9uICsgJ21zJztcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyd0cmFuc2l0aW9uLWR1cmF0aW9uJ10gICAgICAgICA9IEVmZmVjdC5kdXJhdGlvbiArICdtcyc7XG5cbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgY29udmVydFN0eWxlKHJpcHBsZVN0eWxlKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGlkZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgVG91Y2hIYW5kbGVyLnRvdWNodXAoZSk7XG5cbiAgICAgICAgICAgIHZhciBlbCA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSBlbC5jbGllbnRXaWR0aCAqIDEuNDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR2V0IGZpcnN0IHJpcHBsZVxuICAgICAgICAgICAgdmFyIHJpcHBsZSA9IG51bGw7XG4gICAgICAgICAgICB2YXIgcmlwcGxlcyA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dhdmVzLXJpcHBsZScpO1xuICAgICAgICAgICAgaWYgKHJpcHBsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJpcHBsZSA9IHJpcHBsZXNbcmlwcGxlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVsYXRpdmVYICAgPSByaXBwbGUuZ2V0QXR0cmlidXRlKCdkYXRhLXgnKTtcbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVkgICA9IHJpcHBsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpO1xuICAgICAgICAgICAgdmFyIHNjYWxlICAgICAgID0gcmlwcGxlLmdldEF0dHJpYnV0ZSgnZGF0YS1zY2FsZScpO1xuXG4gICAgICAgICAgICAvLyBHZXQgZGVsYXkgYmVldHdlZW4gbW91c2Vkb3duIGFuZCBtb3VzZSBsZWF2ZVxuICAgICAgICAgICAgdmFyIGRpZmYgPSBEYXRlLm5vdygpIC0gTnVtYmVyKHJpcHBsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcpKTtcbiAgICAgICAgICAgIHZhciBkZWxheSA9IDM1MCAtIGRpZmY7XG5cbiAgICAgICAgICAgIGlmIChkZWxheSA8IDApIHtcbiAgICAgICAgICAgICAgICBkZWxheSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZhZGUgb3V0IHJpcHBsZSBhZnRlciBkZWxheVxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICd0b3AnOiByZWxhdGl2ZVkrJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiByZWxhdGl2ZVgrJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgJ29wYWNpdHknOiAnMCcsXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNpdGlvbi1kdXJhdGlvbic6IEVmZmVjdC5kdXJhdGlvbiArICdtcycsXG4gICAgICAgICAgICAgICAgICAgICctbW96LXRyYW5zaXRpb24tZHVyYXRpb24nOiBFZmZlY3QuZHVyYXRpb24gKyAnbXMnLFxuICAgICAgICAgICAgICAgICAgICAnLW8tdHJhbnNpdGlvbi1kdXJhdGlvbic6IEVmZmVjdC5kdXJhdGlvbiArICdtcycsXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uLWR1cmF0aW9uJzogRWZmZWN0LmR1cmF0aW9uICsgJ21zJyxcbiAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICctbW96LXRyYW5zZm9ybSc6IHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAnLW1zLXRyYW5zZm9ybSc6IHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAnLW8tdHJhbnNmb3JtJzogc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nOiBzY2FsZSxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBjb252ZXJ0U3R5bGUoc3R5bGUpKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChyaXBwbGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIEVmZmVjdC5kdXJhdGlvbik7XG4gICAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gTGl0dGxlIGhhY2sgdG8gbWFrZSA8aW5wdXQ+IGNhbiBwZXJmb3JtIHdhdmVzIGVmZmVjdFxuICAgICAgICB3cmFwSW5wdXQ6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGVsZW1lbnRzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsID0gZWxlbWVudHNbYV07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnB1dCBhbHJlYWR5IGhhdmUgcGFyZW50IGp1c3QgcGFzcyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaScgJiYgcGFyZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3YXZlcy1lZmZlY3QnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUHV0IGVsZW1lbnQgY2xhc3MgYW5kIHN0eWxlIHRvIHRoZSBzcGVjaWZpZWQgcGFyZW50XG4gICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZSArICcgd2F2ZXMtaW5wdXQtd3JhcHBlcic7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRTdHlsZSA9IGVsLmdldEF0dHJpYnV0ZSgnc3R5bGUnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnRTdHlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFN0eWxlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBlbGVtZW50U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gJ3dhdmVzLWJ1dHRvbi1pbnB1dCc7XG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBQdXQgZWxlbWVudCBhcyBjaGlsZFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKHdyYXBwZXIsIGVsKTtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogRGlzYWJsZSBtb3VzZWRvd24gZXZlbnQgZm9yIDUwMG1zIGR1cmluZyBhbmQgYWZ0ZXIgdG91Y2hcbiAgICAgKi9cbiAgICB2YXIgVG91Y2hIYW5kbGVyID0ge1xuICAgICAgICAvKiB1c2VzIGFuIGludGVnZXIgcmF0aGVyIHRoYW4gYm9vbCBzbyB0aGVyZSdzIG5vIGlzc3VlcyB3aXRoXG4gICAgICAgICAqIG5lZWRpbmcgdG8gY2xlYXIgdGltZW91dHMgaWYgYW5vdGhlciB0b3VjaCBldmVudCBvY2N1cnJlZFxuICAgICAgICAgKiB3aXRoaW4gdGhlIDUwMG1zLiBDYW5ub3QgbW91c2V1cCBiZXR3ZWVuIHRvdWNoc3RhcnQgYW5kXG4gICAgICAgICAqIHRvdWNoZW5kLCBub3IgaW4gdGhlIDUwMG1zIGFmdGVyIHRvdWNoZW5kLiAqL1xuICAgICAgICB0b3VjaGVzOiAwLFxuICAgICAgICBhbGxvd0V2ZW50OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgYWxsb3cgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoZS50eXBlID09PSAndG91Y2hzdGFydCcpIHtcbiAgICAgICAgICAgICAgICBUb3VjaEhhbmRsZXIudG91Y2hlcyArPSAxOyAvL3B1c2hcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS50eXBlID09PSAndG91Y2hlbmQnIHx8IGUudHlwZSA9PT0gJ3RvdWNoY2FuY2VsJykge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChUb3VjaEhhbmRsZXIudG91Y2hlcyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvdWNoSGFuZGxlci50b3VjaGVzIC09IDE7IC8vcG9wIGFmdGVyIDUwMG1zXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICdtb3VzZWRvd24nICYmIFRvdWNoSGFuZGxlci50b3VjaGVzID4gMCkge1xuICAgICAgICAgICAgICAgIGFsbG93ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhbGxvdztcbiAgICAgICAgfSxcbiAgICAgICAgdG91Y2h1cDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgVG91Y2hIYW5kbGVyLmFsbG93RXZlbnQoZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBEZWxlZ2F0ZWQgY2xpY2sgaGFuZGxlciBmb3IgLndhdmVzLWVmZmVjdCBlbGVtZW50LlxuICAgICAqIHJldHVybnMgbnVsbCB3aGVuIC53YXZlcy1lZmZlY3QgZWxlbWVudCBub3QgaW4gXCJjbGljayB0cmVlXCJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRXYXZlc0VmZmVjdEVsZW1lbnQoZSkge1xuICAgICAgICBpZiAoVG91Y2hIYW5kbGVyLmFsbG93RXZlbnQoZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcblxuICAgICAgICB3aGlsZSAodGFyZ2V0LnBhcmVudEVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpICYmIHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZignd2F2ZXMtZWZmZWN0JykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRhcmdldDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnd2F2ZXMtZWZmZWN0JykpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWJibGUgdGhlIGNsaWNrIGFuZCBzaG93IGVmZmVjdCBpZiAud2F2ZXMtZWZmZWN0IGVsZW0gd2FzIGZvdW5kXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2hvd0VmZmVjdChlKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZ2V0V2F2ZXNFZmZlY3RFbGVtZW50KGUpO1xuXG4gICAgICAgIGlmIChlbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBFZmZlY3Quc2hvdyhlLCBlbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBFZmZlY3QuaGlkZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBFZmZlY3QuaGlkZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBFZmZlY3QuaGlkZSwgZmFsc2UpO1xuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgRWZmZWN0LmhpZGUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFdhdmVzLmRpc3BsYXlFZmZlY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIGlmICgnZHVyYXRpb24nIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIEVmZmVjdC5kdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vV3JhcCBpbnB1dCBpbnNpZGUgPGk+IHRhZ1xuICAgICAgICBFZmZlY3Qud3JhcElucHV0KCQkKCcud2F2ZXMtZWZmZWN0JykpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgc2hvd0VmZmVjdCwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNob3dFZmZlY3QsIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIFdhdmVzIHRvIGFuIGlucHV0IGVsZW1lbnQgKG9yIGFueSBlbGVtZW50IHdoaWNoIGRvZXNuJ3RcbiAgICAgKiBidWJibGUgbW91c2V1cC9tb3VzZWRvd24gZXZlbnRzKS5cbiAgICAgKiAgIEludGVuZGVkIHRvIGJlIHVzZWQgd2l0aCBkeW5hbWljYWxseSBsb2FkZWQgZm9ybXMvaW5wdXRzLCBvclxuICAgICAqIHdoZXJlIHRoZSB1c2VyIGRvZXNuJ3Qgd2FudCBhIGRlbGVnYXRlZCBjbGljayBoYW5kbGVyLlxuICAgICAqL1xuICAgIFdhdmVzLmF0dGFjaCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgLy9GVVRVUkU6IGF1dG9tYXRpY2FsbHkgYWRkIHdhdmVzIGNsYXNzZXMgYW5kIGFsbG93IHVzZXJzXG4gICAgICAgIC8vIHRvIHNwZWNpZnkgdGhlbSB3aXRoIGFuIG9wdGlvbnMgcGFyYW0/IEVnLiBsaWdodC9jbGFzc2ljL2J1dHRvblxuICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbnB1dCcpIHtcbiAgICAgICAgICAgIEVmZmVjdC53cmFwSW5wdXQoW2VsZW1lbnRdKTtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzaG93RWZmZWN0LCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNob3dFZmZlY3QsIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgd2luZG93LldhdmVzID0gV2F2ZXM7XG59KSh3aW5kb3cpO1xuIiwiLyoqXG4gKiBhbmd1bGFyLWxvY2tlclxuICpcbiAqIEEgc2ltcGxlICYgY29uZmlndXJhYmxlIGFic3RyYWN0aW9uIGZvciBsb2NhbC9zZXNzaW9uIHN0b3JhZ2UgaW4gYW5ndWxhciBwcm9qZWN0cy5cbiAqXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vdHltb25kZXNpZ25zL2FuZ3VsYXItbG9ja2VyXG4gKiBAYXV0aG9yIFNlYW4gVHltb24gQHR5bW9uZGVzaWduc1xuICogQGxpY2Vuc2UgTUlUIExpY2Vuc2UsIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhY3Rvcnkocm9vdC5hbmd1bGFyKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QuYW5ndWxhciB8fCAod2luZG93ICYmIHdpbmRvdy5hbmd1bGFyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeShyb290LmFuZ3VsYXIpO1xuICAgIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChhbmd1bGFyKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhci1sb2NrZXInLCBbXSlcblxuICAgIC5wcm92aWRlcignbG9ja2VyJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uIHRoZW4gZXhlY3V0ZSwgb3RoZXJ3aXNlIHJldHVyblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtNaXhlZH0gIHZhbHVlXG4gICAgICAgICAqIEBwYXJhbSAge01peGVkfSAgcGFyYW1ldGVyXG4gICAgICAgICAqIEByZXR1cm4ge01peGVkfVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF92YWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgcGFyYW0pIHtcbiAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUocGFyYW0pIDogdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUga2V5IG9mIGFuIG9iamVjdCBieSB0aGUgdmFsdWVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSAgb2JqZWN0XG4gICAgICAgICAqIEBwYXJhbSAge01peGVkfSAgIHZhbHVlXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfa2V5QnlWYWwgPSBmdW5jdGlvbiAob2JqZWN0LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIG9iamVjdFtrZXldID09PSB2YWx1ZTsgfSlbMF07XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyaWdnZXIgYW4gZXJyb3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAgbXNnXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2Vycm9yID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbYW5ndWxhci1sb2NrZXJdICcgKyBtc2cpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIGRlZmF1bHRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBkcml2ZXI6ICdsb2NhbCcsXG4gICAgICAgICAgICBuYW1lc3BhY2U6ICdsb2NrZXInLFxuICAgICAgICAgICAgZXZlbnRzRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHNlcGFyYXRvcjogJy4nXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBbGxvdyBzZXR0aW5nIG9mIGRlZmF1bHQgc3RvcmFnZSBkcml2ZXIgdmlhIGBsb2NrZXJQcm92aWRlcmBcbiAgICAgICAgICAgICAqIGUuZy4gbG9ja2VyUHJvdmlkZXIuc2V0RGVmYXVsdERyaXZlcignc2Vzc2lvbicpO1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ3xGdW5jdGlvbn0gIGRyaXZlclxuICAgICAgICAgICAgICogQHJldHVybiB7c2VsZn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2V0RGVmYXVsdERyaXZlcjogZnVuY3Rpb24gKGRyaXZlcikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzLmRyaXZlciA9IF92YWx1ZShkcml2ZXIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldCB0aGUgZGVmYXVsdCBkcml2ZXJcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldERlZmF1bHREcml2ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdHMuZHJpdmVyO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBbGxvdyBzZXR0aW5nIG9mIGRlZmF1bHQgbmFtZXNwYWNlIHZpYSBgbG9ja2VyUHJvdmlkZXJgXG4gICAgICAgICAgICAgKiBlLmcuIGxvY2tlclByb3ZpZGVyLnNldERlZmF1bHROYW1lc3BhY2UoJ215QXBwTmFtZScpO1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ3xGdW5jdGlvbn0gIG5hbWVzcGFjZVxuICAgICAgICAgICAgICogQHJldHVybiB7c2VsZn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2V0RGVmYXVsdE5hbWVzcGFjZTogZnVuY3Rpb24gKG5hbWVzcGFjZSkge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzLm5hbWVzcGFjZSA9IF92YWx1ZShuYW1lc3BhY2UpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldCB0aGUgZGVmYXVsdCBuYW1lc3BhY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldERlZmF1bHROYW1lc3BhY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdHMubmFtZXNwYWNlO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTZXQgd2hldGhlciB0aGUgZXZlbnRzIGFyZSBlbmFibGVkXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtICB7Qm9vbGVhbnxGdW5jdGlvbn0gIGVuYWJsZWRcbiAgICAgICAgICAgICAqIEByZXR1cm4ge3NlbGZ9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHNldEV2ZW50c0VuYWJsZWQ6IGZ1bmN0aW9uIChlbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMuZXZlbnRzRW5hYmxlZCA9IF92YWx1ZShlbmFibGVkKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHZXQgd2hldGhlciB0aGUgZXZlbnRzIGFyZSBlbmFibGVkXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RXZlbnRzRW5hYmxlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0cy5ldmVudHNFbmFibGVkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTZXQgdGhlIHNlcGFyYXRvciB0byB1c2Ugd2l0aCBuYW1lc3BhY2UgaW4ga2V5c1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ3xGdW5jdGlvbn0gc2VwYXJhdG9yXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtzZWxmfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZXRTZXBhcmF0b3I6IGZ1bmN0aW9uIChzZXBhcmF0b3IpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0cy5zZXBhcmF0b3IgPSBfdmFsdWUoc2VwYXJhdG9yKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHZXQgdGhlIHNlcGFyYXRvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0U2VwYXJhdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRzLnNlcGFyYXRvcjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIGxvY2tlciBzZXJ2aWNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRnZXQ6IFsnJHdpbmRvdycsICckcm9vdFNjb3BlJywgJyRwYXJzZScsIGZ1bmN0aW9uICgkd2luZG93LCAkcm9vdFNjb3BlLCAkcGFyc2UpIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIERlZmluZSB0aGUgTG9ja2VyIGNsYXNzXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0b3JhZ2V9ICBkcml2ZXJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBMb2NrZXIgKGRyaXZlciwgbmFtZXNwYWNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIE91dCBvZiB0aGUgYm94IGRyaXZlcnNcbiAgICAgICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RlcmVkRHJpdmVycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsOiAkd2luZG93LmxvY2FsU3RvcmFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb246ICR3aW5kb3cuc2Vzc2lvblN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHRoZSBTdG9yYWdlIGluc3RhbmNlIGZyb20gdGhlIGtleVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBkcml2ZXJcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RvcmFnZX1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmVEcml2ZXIgPSBmdW5jdGlvbiAoZHJpdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLl9yZWdpc3RlcmVkRHJpdmVycy5oYXNPd25Qcm9wZXJ0eShkcml2ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2Vycm9yKCdUaGUgZHJpdmVyIFwiJyArIGRyaXZlciArICdcIiB3YXMgbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0ZXJlZERyaXZlcnNbZHJpdmVyXTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHRoZSBkcml2ZXIga2V5IChsb2NhbC9zZXNzaW9uKSBieSB0aGUgU3RvcmFnZSBpbnN0YW5jZVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdG9yYWdlfSAgZHJpdmVyXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rlcml2ZURyaXZlciA9IGZ1bmN0aW9uIChkcml2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfa2V5QnlWYWwodGhpcy5fcmVnaXN0ZXJlZERyaXZlcnMsIGRyaXZlcik7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtTdG9yYWdlfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJpdmVyID0gdGhpcy5fcmVzb2x2ZURyaXZlcihkcml2ZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c0VuYWJsZWQgPSBkZWZhdWx0cy5ldmVudHNFbmFibGVkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VwYXJhdG9yID0gZGVmYXVsdHMuc2VwYXJhdG9yO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2F0Y2hlcnMgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2hlY2sgYnJvd3NlciBzdXBwb3J0XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvYmxvYi9tYXN0ZXIvZmVhdHVyZS1kZXRlY3RzL3N0b3JhZ2UvbG9jYWxzdG9yYWdlLmpzI0wzOC1MNDdcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAgZHJpdmVyXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGVja1N1cHBvcnQgPSBmdW5jdGlvbiAoZHJpdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZCh0aGlzLl9zdXBwb3J0ZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSAnbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZURyaXZlcihkcml2ZXIgfHwgJ2xvY2FsJykuc2V0SXRlbShsLCBsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZURyaXZlcihkcml2ZXIgfHwgJ2xvY2FsJykucmVtb3ZlSXRlbShsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwcG9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cHBvcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1cHBvcnRlZDtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQnVpbGQgdGhlIHN0b3JhZ2Uga2V5IGZyb20gdGhlIG5hbXNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIGtleVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRQcmVmaXggPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLl9uYW1lc3BhY2UpIHJldHVybiBrZXk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2UgKyB0aGlzLl9zZXBhcmF0b3IgKyBrZXk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFRyeSB0byBlbmNvZGUgdmFsdWUgYXMganNvbiwgb3IganVzdCByZXR1cm4gdGhlIHZhbHVlIHVwb24gZmFpbHVyZVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtNaXhlZH0gIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge01peGVkfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VyaWFsaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLnRvSnNvbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBUcnkgdG8gcGFyc2UgdmFsdWUgYXMganNvbiwgaWYgaXQgZmFpbHMgdGhlbiBpdCBwcm9iYWJseSBpc24ndCBqc29uIHNvIGp1c3QgcmV0dXJuIGl0XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdHxTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBUcmlnZ2VyIGFuIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSAgcGF5bG9hZFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnQgPSBmdW5jdGlvbiAobmFtZSwgcGF5bG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEgdGhpcy5fZXZlbnRzRW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KG5hbWUsIGFuZ3VsYXIuZXh0ZW5kKHBheWxvYWQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcml2ZXI6IHRoaXMuX2Rlcml2ZURyaXZlcih0aGlzLl9kcml2ZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdGhpcy5fbmFtZXNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBBZGQgdG8gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIGtleVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge01peGVkfSAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldEl0ZW0gPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEgdGhpcy5fY2hlY2tTdXBwb3J0KCkpIF9lcnJvcignVGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBsb2NhbFN0b3JhZ2UnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2xkVmFsID0gdGhpcy5fZ2V0SXRlbShrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyaXZlci5zZXRJdGVtKHRoaXMuX2dldFByZWZpeChrZXkpLCB0aGlzLl9zZXJpYWxpemUodmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXhpc3RzKGtleSkgJiYgISBhbmd1bGFyLmVxdWFscyhvbGRWYWwsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudCgnbG9ja2VyLml0ZW0udXBkYXRlZCcsIHsga2V5OiBrZXksIG9sZFZhbHVlOiBvbGRWYWwsIG5ld1ZhbHVlOiB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudCgnbG9ja2VyLml0ZW0uYWRkZWQnLCB7IGtleToga2V5LCB2YWx1ZTogdmFsdWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChbJ1FVT1RBX0VYQ0VFREVEX0VSUicsICdOU19FUlJPUl9ET01fUVVPVEFfUkVBQ0hFRCcsICdRdW90YUV4Y2VlZGVkRXJyb3InXS5pbmRleE9mKGUubmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9lcnJvcignVGhlIGJyb3dzZXIgc3RvcmFnZSBxdW90YSBoYXMgYmVlbiBleGNlZWRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9lcnJvcignQ291bGQgbm90IGFkZCBpdGVtIHdpdGgga2V5IFwiJyArIGtleSArICdcIicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IGZyb20gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBrZXlcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7TWl4ZWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEgdGhpcy5fY2hlY2tTdXBwb3J0KCkpIF9lcnJvcignVGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBsb2NhbFN0b3JhZ2UnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Vuc2VyaWFsaXplKHRoaXMuX2RyaXZlci5nZXRJdGVtKHRoaXMuX2dldFByZWZpeChrZXkpKSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEV4aXN0cyBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIGtleVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXhpc3RzID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEgdGhpcy5fY2hlY2tTdXBwb3J0KCkpIF9lcnJvcignVGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBsb2NhbFN0b3JhZ2UnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RyaXZlci5oYXNPd25Qcm9wZXJ0eSh0aGlzLl9nZXRQcmVmaXgoX3ZhbHVlKGtleSkpKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUmVtb3ZlIGZyb20gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBrZXlcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUl0ZW0gPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLl9jaGVja1N1cHBvcnQoKSkgX2Vycm9yKCdUaGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGxvY2FsU3RvcmFnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLl9leGlzdHMoa2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJpdmVyLnJlbW92ZUl0ZW0odGhpcy5fZ2V0UHJlZml4KGtleSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudCgnbG9ja2VyLml0ZW0uZm9yZ290dGVuJywgeyBrZXk6IGtleSB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogRGVmaW5lIHRoZSBwdWJsaWMgYXBpXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIExvY2tlci5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEFkZCBhIG5ldyBpdGVtIHRvIHN0b3JhZ2UgKGV2ZW4gaWYgaXQgYWxyZWFkeSBleGlzdHMpXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge01peGVkfSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge01peGVkfSAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7c2VsZn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHB1dDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIGtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gX3ZhbHVlKGtleSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goa2V5LCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISBhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRJdGVtKGtleSwgX3ZhbHVlKHZhbHVlLCB0aGlzLl9nZXRJdGVtKGtleSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEFkZCBhbiBpdGVtIHRvIHN0b3JhZ2UgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge01peGVkfSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge01peGVkfSAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFkZDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIHRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1dChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBSZXRyaWV2ZSB0aGUgc3BlY2lmaWVkIGl0ZW0gZnJvbSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ3xBcnJheX0gIGtleVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtNaXhlZH0gIGRlZlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtNaXhlZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGtleSwgZGVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goa2V5LCBmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXMoaykpIGl0ZW1zW2tdID0gdGhpcy5fZ2V0SXRlbShrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEgdGhpcy5oYXMoa2V5KSkgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDIgPyBkZWYgOiB2b2lkIDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRJdGVtKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIERldGVybWluZSB3aGV0aGVyIHRoZSBpdGVtIGV4aXN0cyBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ3xGdW5jdGlvbn0gIGtleVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaGFzOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhpc3RzKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFJlbW92ZSBzcGVjaWZpZWQgaXRlbShzKSBmcm9tIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7TWl4ZWR9ICBrZXlcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZm9yZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBfdmFsdWUoa2V5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5Lm1hcCh0aGlzLl9yZW1vdmVJdGVtLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUmV0cmlldmUgdGhlIHNwZWNpZmllZCBpdGVtIGZyb20gc3RvcmFnZSBhbmQgdGhlbiByZW1vdmUgaXRcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfEFycmF5fSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge01peGVkfSAgZGVmXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge01peGVkfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcHVsbDogZnVuY3Rpb24gKGtleSwgZGVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldChrZXksIGRlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcmdldChrZXkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFJldHVybiBhbGwgaXRlbXMgaW4gc3RvcmFnZSB3aXRoaW4gdGhlIGN1cnJlbnQgbmFtZXNwYWNlL2RyaXZlclxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBhbGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoaXMuX2RyaXZlciwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3BsaXQgPSBrZXkuc3BsaXQodGhpcy5fc2VwYXJhdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID4gMSAmJiBzcGxpdFswXSA9PT0gdGhpcy5fbmFtZXNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0LnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gc3BsaXQuam9pbih0aGlzLl9zZXBhcmF0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXMoa2V5KSkgaXRlbXNba2V5XSA9IHRoaXMuZ2V0KGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBSZW1vdmUgYWxsIGl0ZW1zIHNldCB3aXRoaW4gdGhlIGN1cnJlbnQgbmFtZXNwYWNlL2RyaXZlclxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzZWxmfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY2xlYW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yZ2V0KE9iamVjdC5rZXlzKHRoaXMuYWxsKCkpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEVtcHR5IHRoZSBjdXJyZW50IHN0b3JhZ2UgZHJpdmVyIGNvbXBsZXRlbHkuIGNhcmVmdWwgbm93LlxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzZWxmfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyaXZlci5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHRoZSB0b3RhbCBudW1iZXIgb2YgaXRlbXMgd2l0aGluIHRoZSBjdXJyZW50IG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtJbnRlZ2VyfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmFsbCgpKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEJpbmQgYSBzdG9yYWdlIGtleSB0byBhICRzY29wZSBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICAkc2NvcGVcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge01peGVkfSAgIGRlZlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzZWxmfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgYmluZDogZnVuY3Rpb24gKCRzY29wZSwga2V5LCBkZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKCAkc2NvcGUuJGV2YWwoa2V5KSApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHBhcnNlKGtleSkuYXNzaWduKCRzY29wZSwgdGhpcy5nZXQoa2V5LCBkZWYpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLmhhcyhrZXkpKSB0aGlzLnB1dChrZXksIGRlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dhdGNoZXJzW2tleSArICRzY29wZS4kaWRdID0gJHNjb3BlLiR3YXRjaChrZXksIGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQobmV3VmFsKSkgc2VsZi5wdXQoa2V5LCBuZXdWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgYW5ndWxhci5pc09iamVjdCgkc2NvcGVba2V5XSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVW5iaW5kIGEgc3RvcmFnZSBrZXkgZnJvbSBhICRzY29wZSBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICAkc2NvcGVcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3NlbGZ9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB1bmJpbmQ6IGZ1bmN0aW9uICgkc2NvcGUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHBhcnNlKGtleSkuYXNzaWduKCRzY29wZSwgdm9pZCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yZ2V0KGtleSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3YXRjaElkID0ga2V5ICsgJHNjb3BlLiRpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3dhdGNoZXJzW3dhdGNoSWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgZGUtcmVnaXN0cmF0aW9uIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2F0Y2hlcnNbd2F0Y2hJZF0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fd2F0Y2hlcnNbd2F0Y2hJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBTZXQgdGhlIHN0b3JhZ2UgZHJpdmVyIG9uIGEgbmV3IGluc3RhbmNlIHRvIGVuYWJsZSBvdmVycmlkaW5nIGRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIGRyaXZlclxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzZWxmfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZHJpdmVyOiBmdW5jdGlvbiAoZHJpdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZShkcml2ZXIsIHRoaXMuX25hbWVzcGFjZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEdldCB0aGUgY3VycmVudGx5IHNldCBkcml2ZXJcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RvcmFnZX1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldERyaXZlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RyaXZlcjtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogU2V0IHRoZSBuYW1lc3BhY2Ugb24gYSBuZXcgaW5zdGFuY2UgdG8gZW5hYmxlIG92ZXJyaWRpbmcgZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3NlbGZ9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IGZ1bmN0aW9uIChuYW1lc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlKHRoaXMuX2Rlcml2ZURyaXZlcih0aGlzLl9kcml2ZXIpLCBuYW1lc3BhY2UpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGN1cnJlbnRseSBzZXQgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGdldE5hbWVzcGFjZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2hlY2sgYnJvd3NlciBzdXBwb3J0XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvYmxvYi9tYXN0ZXIvZmVhdHVyZS1kZXRlY3RzL3N0b3JhZ2UvbG9jYWxzdG9yYWdlLmpzI0wzOC1MNDdcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAgZHJpdmVyXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBzdXBwb3J0ZWQ6IGZ1bmN0aW9uIChkcml2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGVja1N1cHBvcnQoZHJpdmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IGEgbmV3IGluc3RhbmNlIG9mIExvY2tlclxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBkcml2ZXJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0xvY2tlcn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiBmdW5jdGlvbiAoZHJpdmVyLCBuYW1lc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTG9ja2VyKGRyaXZlciwgbmFtZXNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gdGhlIGRlZmF1bHQgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExvY2tlcihkZWZhdWx0cy5kcml2ZXIsIGRlZmF1bHRzLm5hbWVzcGFjZSk7XG4gICAgICAgICAgICB9XVxuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9