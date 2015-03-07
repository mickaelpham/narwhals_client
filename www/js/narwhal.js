(function() {
  var app;

  app = angular.module('narwhal', ['ionic', 'narwhal.login', 'narwhal.report', 'narwhal.recurring', 'ui.router']);

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
          console.log("Username: " + username);
          console.log("Password: " + password);
          request = $http.put('https://nameless-scrubland-4785.herokuapp.com/v1/users', {
            'user[email]': username,
            'user[password]': password
          });
          return request.then((function(_this) {
            return function(result) {
              return _this.currentUser = _this.result;
            };
          })(this));
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

    LoginController.inject('$scope', '$http', 'User');

    LoginController.prototype.login = function() {
      return this.User.login(this.$scope.username, this.$scope.password);
    };

    LoginController.prototype.initialize = function() {
      this.$scope.username = '';
      return this.$scope.password = '';
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

  reportModule = angular.module('narwhal.report');

  ReportController = (function(superClass) {
    extend(ReportController, superClass);

    function ReportController() {
      return ReportController.__super__.constructor.apply(this, arguments);
    }

    ReportController.register(reportModule);

    ReportController.inject('$scope');

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC5jb2ZmZWUiLCJjb250cm9sbGVyL0Jhc2VDb250cm9sbGVyLmNvZmZlZSIsInNlcnZpY2UvVXNlclNlcnZpY2UuY29mZmVlIiwibG9naW4vTG9naW5Nb2R1bGUuY29mZmVlIiwicmVjdXJyaW5nL1JlY3VycmluZ01vZHVsZS5jb2ZmZWUiLCJyZXBvcnQvUmVwb3J0TW9kdWxlLmNvZmZlZSIsImluZGV4L2NvbnRyb2xsZXIvSW5kZXhDb250cm9sbGVyLmNvZmZlZSIsImxvZ2luL2NvbnRyb2xsZXIvTG9naW5Db250cm9sbGVyLmNvZmZlZSIsImxvZ2luL2RpcmVjdGl2ZS9pb25NZElucHV0LmNvZmZlZSIsInJlY3VycmluZy9jb250cm9sbGVyL1JlY3VycmluZ0NvbnRyb2xsZXIuY29mZmVlIiwicmVwb3J0L2NvbnRyb2xsZXIvUmVwb3J0Q29udHJvbGxlci5jb2ZmZWUiLCJtYXRlcmlhbC1pb25pYy5qcyIsIndhdmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BO0FBQUEsTUFBQSxHQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsU0FBZixFQUEwQixDQUM5QixPQUQ4QixFQUU5QixlQUY4QixFQUc5QixnQkFIOEIsRUFJOUIsbUJBSjhCLEVBSzlCLFdBTDhCLENBQTFCLENBQU4sQ0FBQTs7QUFBQSxFQVFBLEdBQUcsQ0FBQyxHQUFKLENBQVEsU0FBQyxjQUFELEVBQWlCLFVBQWpCLEdBQUE7QUFDTixJQUFBLGNBQWMsQ0FBQyxLQUFmLENBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsSUFBbUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBN0M7QUFDRSxRQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF6QixDQUFrRCxJQUFsRCxDQUFBLENBREY7T0FE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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJuYXJ3aGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIyBJb25pYyBTdGFydGVyIEFwcFxuIyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuIyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbiMgdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuIyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbiMgJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG5hcHAgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbCcsIFtcbiAgJ2lvbmljJ1xuICAnbmFyd2hhbC5sb2dpbidcbiAgJ25hcndoYWwucmVwb3J0J1xuICAnbmFyd2hhbC5yZWN1cnJpbmcnXG4gICd1aS5yb3V0ZXInXG5dKVxuXG5hcHAucnVuKCgkaW9uaWNQbGF0Zm9ybSwgJHJvb3RTY29wZSkgLT5cbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkgLT5cbiAgICBjb25zb2xlLmxvZyBcIlJlYWR5IVwiXG4gICAgaWYgd2luZG93LmNvcmRvdmEgYW5kIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmRcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIgdHJ1ZVxuICAgIGlmIHdpbmRvdy5TdGF0dXNCYXJcbiAgICAgICMgb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpXG5cblxuICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlU3RhcnQnLCAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIC0+XG4gICAgY29uc29sZS5sb2cgXCJDaGFuZ2VkIHJvdXRlIHRvICN7dG9TdGF0ZS51cmx9XCJcbiAgICBjb25zb2xlLmxvZyBcIkNoYW5nZWQgcm91dGUgdG8gI3t0b1N0YXRlLm5hbWV9XCJcbiAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZUVycm9yJywgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvciktPlxuICAgIGNvbnNvbGUuZXJyb3IgJ0NvdWxkIG5vdCBjaGFuZ2Ugc3RhdGUnXG4gICAgY29uc29sZS5lcnJvciBlcnJvclxuICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlU3VjY2VzcycsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyktPlxuICAgIGNvbnNvbGUubG9nICdTdWNjZXNzZnVseSBjaGFuZ2VkIHN0YXRlJ1xuXG4pXG5cbmFwcC5jb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIC0+XG4gICMgSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gICMgTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgIyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAjIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaW5kZXgnLFxuICAgIHVybDogJy8nXG4gICAgY29udHJvbGxlcjogJ0luZGV4Q29udHJvbGxlcidcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9pbmRleC5odG1sJylcblxuICByZXR1cm4iLCIjIEJhc2UgY2xhc3MgZm9yIGFuZ3VsYXIgY29udHJvbGxlcnMsIHdoaWNoIGVhc2VzIHRoZSBwcm9jZXNzIG9mIGluaXRpYWxpemF0aW9uIGFuZCBkZXBlbmRlbmN5IGluamVjdGlvbi5cbiMgVGhpcyBhcHByb2FjaCBpcyBiYXNlZCBvbiBodHRwOi8vd3d3LmRldmlnbi5tZS9hbmd1bGFyLWRvdC1qcy1jb2ZmZWVzY3JpcHQtY29udHJvbGxlci1iYXNlLWNsYXNzXG4jXG4jIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gdXNlIGl0OlxuI1xuIyBzb21lQXBwTW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ3NvbWVBcHAnXG4jXG4jIGNsYXNzIE15QXdlc29tZUNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuIyAgICMgcmVnaXN0ZXIgdGhlIGNvbnRyb2xsZXIgYXQgb3VyIG1vZHVsZVxuIyAgIEByZWdpc3RlciBzb21lQXBwTW9kdWxlXG4jICAgIyBkZXBlbmRlbmNpZXMgdG8gaW5qZWN0LCB3aWxsIGJlIGF2YWlsYWJsZSBhcyBtZW1iZXIgdmFyaWFibGUgZS5nLiBAJHNjb3BlXG4jICAgQGluamVjdCAnJHNjb3BlJywgJyRodHRwJywgJ015U2VydmljZSdcbiMgICAjIGNhbGxlZCBhZnRlciBpbnN0YW50aWF0aW9uIGlmIGV4aXN0c1xuIyAgIGluaXRpYWxpemU6IC0+XG4jICAgICAjIGluaXQgc29tZSBzdHVmZiAuLi5cbiMgICBzdWJtaXQ6IC0+XG4jICAgICAjIGJvdW5kIHRvICRzY29wZSBhbmQgdXNhYmxlIGluIHRlbXBsYXRlIGF1dG9tYXRpY2FsbHlcbiNcbiMgVE9ETzogQWRkIGNoZWNrIHRvIGVuc3VyZSAkc2NvcGUgYXMgZGVwZW5kZW5jeSB3aGVuIG9uZSBvciBtb3JlIGZ1bmN0aW9ucyBhcmUgZGVmaW5lZCBhcyB0aGV5IGFyZSBib3VuZCBhdXRvbWF0aWNhbGx5XG4jXG5jbGFzcyBAQmFzZUNvbnRyb2xsZXJcbiAgQHJlZ2lzdGVyOiAoYXBwLCBuYW1lKSAtPlxuICAgIG5hbWUgPz0gQG5hbWUgfHwgQHRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uXFxzKiguKj8pXFwoLyk/WzFdXG4gICAgYXBwLmNvbnRyb2xsZXIgbmFtZSwgQFxuXG4gIEBpbmplY3Q6IChhcmdzLi4uKSAtPlxuICAgIEAkaW5qZWN0ID0gYXJnc1xuXG5cbiAgY29uc3RydWN0b3I6IChhcmdzLi4uKSAtPlxuICAgIGZvciBrZXksIGluZGV4IGluIEBjb25zdHJ1Y3Rvci4kaW5qZWN0XG4gICAgICBAW2tleV0gPSBhcmdzW2luZGV4XVxuXG4gICAgZm9yIGtleSwgZm4gb2YgQGNvbnN0cnVjdG9yLnByb3RvdHlwZVxuICAgICAgY29udGludWUgdW5sZXNzIHR5cGVvZiBmbiBpcyAnZnVuY3Rpb24nXG4gICAgICBjb250aW51ZSBpZiBrZXkgaW4gWydjb25zdHJ1Y3RvcicsICdpbml0aWFsaXplJ10gb3Iga2V5WzBdIGlzICdfJ1xuICAgICAgQCRzY29wZVtrZXldID0gZm4uYmluZD8oQCkgfHwgXy5iaW5kKGZuLCBAKVxuXG4gICAgQGluaXRpYWxpemU/KCkiLCJhcHAgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbCdcblxuYXBwLmZhY3RvcnkgJ1VzZXInLCBbJyRodHRwJywgKCRodHRwKSAtPlxuICBuZXcgY2xhc3MgVXNlclxuICAgIGNvbnN0cnVjdG9yOiAtPlxuXG5cbiAgICBsb2dpbjogKHVzZXJuYW1lLCBwYXNzd29yZCkgLT5cbiAgICAgIGNvbnNvbGUubG9nIFwiVXNlcm5hbWU6ICN7dXNlcm5hbWV9XCJcbiAgICAgIGNvbnNvbGUubG9nIFwiUGFzc3dvcmQ6ICN7cGFzc3dvcmR9XCJcbiAgICAgIHJlcXVlc3QgPSAkaHR0cC5wdXQgJ2h0dHBzOi8vbmFtZWxlc3Mtc2NydWJsYW5kLTQ3ODUuaGVyb2t1YXBwLmNvbS92MS91c2VycycsIHsndXNlcltlbWFpbF0nIDogdXNlcm5hbWUsICd1c2VyW3Bhc3N3b3JkXScgOiBwYXNzd29yZH1cbiAgICAgIHJlcXVlc3QudGhlbiAocmVzdWx0KT0+XG4gICAgICAgIEBjdXJyZW50VXNlciA9IEByZXN1bHRcbl0iLCJsb2dpbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCduYXJ3aGFsLmxvZ2luJywgW10pXG5cbmxvZ2luTW9kdWxlLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpLT5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgLnN0YXRlKCdsb2dpbicsXG4gICAgdXJsOiAnL2xvZ2luLydcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xuICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInXG4gICkiLCJyZWN1cnJpbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbC5yZWN1cnJpbmcnLCBbXSlcblxucmVjdXJyaW5nTW9kdWxlLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpLT5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgLnN0YXRlKCdyZWN1cnJpbmcnLFxuICAgIHVybDogJy9yZWN1cnJpbmcvJ1xuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3JlY3VycmluZy5odG1sJ1xuICAgIGNvbnRyb2xsZXI6ICdSZWN1cnJpbmdDb250cm9sbGVyJ1xuICAgIHJlc29sdmU6XG4gICAgICBjdXJyZW50VHJhbnNhY3Rpb246IFsnJHJvb3RTY29wZScsICgkcm9vdFNjb3BlKS0+XG4gICAgICAgIHJldHVybiAkcm9vdFNjb3BlLmN1cnJlbnRUcmFuc2FjdGlvblxuICAgICAgXVxuICApIiwicmVwb3J0TW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25hcndoYWwucmVwb3J0JywgW10pXG5cbnJlcG9ydE1vZHVsZS5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKS0+XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSgncmVwb3J0JyxcbiAgICB1cmw6ICcvcmVwb3J0LydcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZXBvcnQuaHRtbCdcbiAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcidcbiAgKSIsImFwcCA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsJ1xuXG5jbGFzcyBJbmRleENvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuXG4gIEByZWdpc3RlciBhcHBcbiAgQGluamVjdCAnJHNjb3BlJywgJyRodHRwJywgJyRzdGF0ZScsICckcm9vdFNjb3BlJ1xuXG4gIGluaXRpYWxpemU6ICgpPT5cbiAgICBjb25zb2xlLmxvZyB0aGlzXG5cbiAgcmVmcmVzaDogKCktPlxuICAgIEBsb2FkVHJhbnNhY3Rpb25zKClcbiAgICBAJHNjb3BlLiRicm9hZGNhc3QoJ3Njcm9sbC5yZWZyZXNoQ29tcGxldGUnKVxuICAgIHNldFRpbWVvdXQoTWkubW90aW9uLmZhZGVTbGlkZUluUmlnaHQoe1xuICAgICAgc2VsZWN0b3I6ICcubGlzdCA+IConXG4gICAgfSksIDEwKVxuXG4gIGxvYWRUcmFuc2FjdGlvbnM6ICgpPT5cbiAgICBAJHNjb3BlLnRyYW5zYWN0aW9ucyA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ0FyYnlzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnQXUgQm9uIFBhaW4nXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0J1ZmZhbG8gV2lsZCBXaW5ncydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnQnVyZ2VyIEtpbmcnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0NhcmxzIEpyLidcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnRGFpcnkgUXVlZW4nXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0RvbWlub3MgUGl6emEnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0R1bmtpbiBEb251dHMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0hhcmRlZXMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0tGQydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnTGl0dGxlIENhZXNhcnMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0xvbmcgSm9obiBTaWx2ZXJzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdNY0NhZsOpJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdNY0RvbmFsZHMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ05hbmRvcydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnUGl6emEgSHV0J1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdSb3VuZCBUYWJsZSBQaXp6YSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnU29uaWMgRHJpdmUtSW4nXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1N0YXJidWNrcydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnU3Vid2F5J1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdUQ0JZJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdUaW0gSG9ydG9ucydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnVGFjbyBCZWxsJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXZW5keXMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1dlbmR5cyBTdXBhIFN1bmRhZXMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1doYXRhYnVyZ2VyJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXaGl0ZSBDYXN0bGUnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1dpbmdzdG9wJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ1dpbmdTdHJlZSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcbiAgICAgIH1cbiAgICBdXG5cbiAgZ2V0UmFuZG9tQW1vdW50OiAoKT0+XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMDApIC8gMTAwXG5cbiAgc2hvd1RyYW5zYWN0aW9uOiAodHJhbnNhY3Rpb24pLT5cbiAgICBAJHJvb3RTY29wZS5jdXJyZW50VHJhbnNhY3Rpb24gPSB0cmFuc2FjdGlvblxuICAgIEAkc3RhdGUuZ28oJ3JlY3VycmluZycpXG5cbiIsImxvZ2luTW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ25hcndoYWwubG9naW4nXG5cbmNsYXNzIExvZ2luQ29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyXG5cbiAgQHJlZ2lzdGVyIGxvZ2luTW9kdWxlXG4gIEBpbmplY3QgJyRzY29wZScsICckaHR0cCcsICdVc2VyJ1xuXG4gIGxvZ2luOiAoKT0+XG4gICAgQFVzZXIubG9naW4oQCRzY29wZS51c2VybmFtZSwgQCRzY29wZS5wYXNzd29yZClcblxuXG4gIGluaXRpYWxpemU6ICgpPT5cbiAgICBAJHNjb3BlLnVzZXJuYW1lID0gJydcbiAgICBAJHNjb3BlLnBhc3N3b3JkID0gJydcblxuIiwiYW5ndWxhci5tb2R1bGUoJ25hcndoYWwubG9naW4nKS5kaXJlY3RpdmUgJ2lvbk1kSW5wdXQnLCAtPlxuICB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcGxhY2U6IHRydWVcbiAgICByZXF1aXJlOiAnP25nTW9kZWwnXG4gICAgdGVtcGxhdGU6ICc8bGFiZWwgY2xhc3M9XCJpdGVtIGl0ZW0taW5wdXQgaXRlbS1tZC1sYWJlbFwiPicgKyAnPGlucHV0IHR5cGU9XCJ0ZXh0XCI+JyArICc8c3BhbiBjbGFzcz1cImlucHV0LWxhYmVsXCI+PC9zcGFuPicgKyAnPGRpdiBjbGFzcz1cImhpZ2hsaWdodFwiPjwvZGl2PicgKyAnPC9sYWJlbD4nXG4gICAgY29tcGlsZTogKGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBoaWdobGlnaHQgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5oaWdobGlnaHQnKVxuICAgICAgaGlnaGxpZ2h0Q29sb3IgPSB1bmRlZmluZWRcbiAgICAgIGlmICFhdHRyLmhpZ2hsaWdodENvbG9yXG4gICAgICAgIGhpZ2hsaWdodENvbG9yID0gJ2NhbG0nXG4gICAgICBlbHNlXG4gICAgICAgIGhpZ2hsaWdodENvbG9yID0gYXR0ci5oaWdobGlnaHRDb2xvclxuICAgICAgaGlnaGxpZ2h0LmNsYXNzTmFtZSArPSAnIGhpZ2hsaWdodC0nICsgaGlnaGxpZ2h0Q29sb3JcbiAgICAgIGxhYmVsID0gZWxlbWVudC5maW5kKCdzcGFuJylcbiAgICAgIGxhYmVsLmh0bWwgYXR0ci5wbGFjZWhvbGRlclxuICAgICAgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0JylcbiAgICAgIGlucHV0LmJpbmQgJ2JsdXInLCAtPlxuICAgICAgICBjb25zb2xlLmxvZyAnYmx1cidcbiAgICAgICAgaWYgaW5wdXQudmFsKClcbiAgICAgICAgICBpbnB1dC5hZGRDbGFzcyAndXNlZCdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlucHV0LnJlbW92ZUNsYXNzICd1c2VkJ1xuICAgICAgICByZXR1cm5cbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCB7XG4gICAgICAgICduYW1lJzogYXR0ci5uYW1lXG4gICAgICAgICd0eXBlJzogYXR0ci50eXBlXG4gICAgICAgICduZy12YWx1ZSc6IGF0dHIubmdWYWx1ZVxuICAgICAgICAnbmctbW9kZWwnOiBhdHRyLm5nTW9kZWxcbiAgICAgICAgJ3JlcXVpcmVkJzogYXR0ci5yZXF1aXJlZFxuICAgICAgICAnbmctcmVxdWlyZWQnOiBhdHRyLm5nUmVxdWlyZWRcbiAgICAgICAgJ25nLW1pbmxlbmd0aCc6IGF0dHIubmdNaW5sZW5ndGhcbiAgICAgICAgJ25nLW1heGxlbmd0aCc6IGF0dHIubmdNYXhsZW5ndGhcbiAgICAgICAgJ25nLXBhdHRlcm4nOiBhdHRyLm5nUGF0dGVyblxuICAgICAgICAnbmctY2hhbmdlJzogYXR0ci5uZ0NoYW5nZVxuICAgICAgICAnbmctdHJpbSc6IGF0dHIudHJpbVxuICAgICAgICAnbmctYmx1cic6IGF0dHIubmdCbHVyXG4gICAgICAgICduZy1mb2N1cyc6IGF0dHIubmdGb2N1c1xuICAgICAgfSwgKHZhbHVlLCBuYW1lKSAtPlxuICAgICAgICBpZiBhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSlcbiAgICAgICAgICBpbnB1dC5hdHRyIG5hbWUsIHZhbHVlXG4gICAgICAgIHJldHVyblxuXG4gICAgICBjbGVhblVwID0gLT5cbiAgICAgICAgaW9uaWMub2ZmICckZGVzdHJveScsIGNsZWFuVXAsIGVsZW1lbnRbMF1cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlvbmljLm9uICckZGVzdHJveScsIGNsZWFuVXAsIGVsZW1lbnRbMF1cbiAgICAgIHJldHVyblxuXG4gIH1cbiIsInJlY3VycmluZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsLnJlY3VycmluZydcblxuY2xhc3MgUmVjdXJyaW5nQ29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyXG5cbiAgQHJlZ2lzdGVyIHJlY3VycmluZ01vZHVsZVxuICBAaW5qZWN0ICckc2NvcGUnLCAnJGh0dHAnLCAnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdjdXJyZW50VHJhbnNhY3Rpb24nXG5cbiAgaW5pdGlhbGl6ZTogKCktPlxuICAgIEAkc2NvcGUuaGVsbG8gPSBcIldvcmxkXCJcbiAgICBAJHNjb3BlLnRyYW5zYWN0aW9uID0gQGN1cnJlbnRUcmFuc2FjdGlvblxuIiwicmVwb3J0TW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ25hcndoYWwucmVwb3J0J1xuXG5jbGFzcyBSZXBvcnRDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXJcblxuICBAcmVnaXN0ZXIgcmVwb3J0TW9kdWxlXG4gIEBpbmplY3QgJyRzY29wZSdcblxuICBpbml0aWFsaXplOiAoKS0+XG4gICAgQCRzY29wZS5yZXBvcnRzID0gW3tcbiAgICAgIG5hbWU6J015UmVwb3J0J1xuICAgIH1dXG4gICAgc2V0VGltZW91dCggKCktPlxuICAgICAgTWkubW90aW9uLmJsaW5kc0Rvd24oeyBzZWxlY3RvcjogJy5jYXJkJ30pXG4gICAgLCA1MDApXG4iLCIvLyBFeHRlbmQgbmFtZXNwYWNlIGlmIG1pIGlzIGFscmVhZHkgZGVmaW5lZFxudmFyIE1pID0gTWkgfHwge307XG5cblxuLy8gTWkgbGlicmFyeSByZXR1cm5lZCBmcm9tIGNsb3N1cmVcbk1pID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAvKiBMaWJyYXJ5IENvbnN0YW50cyAoRVhQT1JUKVxuICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuICAgIHZhciB2ZXJzaW9uID0gJzAuMC4xJztcblxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAvKiBIRUxQRVJTIChub24tZXhwb3J0cylcbiAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qXG4gICAgLyAgIEFic3RyYWN0IGNvbW1vbiBsb29rdXBzIGFuZCBtYW5pcHVsYXRpb25zIGluIGNhc2UgYmV0dGVyIGFsdGVybmF0aXZlc1xuICAgIC8gICBhcmlzZSBvciBmdXR1cmUgY3Jvc3MtcGxhdGZvcm0gZGlmZmVyZW5jZXMgd2FycmFudCBzZXBhcmF0ZSBoYW5kbGluZ1xuICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICBmdW5jdGlvbiBnZXRWaWV3cG9ydEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZG9tTm9kZSkge1xuICAgICAgICByZXR1cm4gZG9tTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3Q7XG4gICAgfVxuXG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIC8qIE1PVElPTiAoRVhQT1JUKVxuICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSpcbiAgICAvICAgQW5pbWF0aW9uIG1ldGhvZHMgZm9yIHRoZSBsaWJyYXJ5XG4gICAgLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuICAgIC8vIEhvaXN0aW5nIHRoZSBhbmltYXRpb24gZnVuY3Rpb25zIGludG8gb3VyIG1vdGlvbiBvYmplY3RcbiAgICB2YXIgbW90aW9uID0ge1xuICAgICAgICBibGluZHNEb3duOiBibGluZHNEb3duLFxuICAgICAgICBmYWRlU2xpZGVJbjogZmFkZVNsaWRlSW4sXG4gICAgICAgIGZhZGVTbGlkZUluUmlnaHQ6IGZhZGVTbGlkZUluUmlnaHQsXG4gICAgICAgIHBhbkluTGVmdDogcGFuSW5MZWZ0LFxuICAgICAgICBwdXNoRG93bjogcHVzaERvd24sXG4gICAgICAgIHNsaWRlVXA6IHNsaWRlVXBcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYmxpbmRzRG93bihvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gRGVjbGFyZSBvdXIgZGVmYXVsdHNcbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgZmluaXNoRGVsYXlUaHJvdHRsZTogMixcbiAgICAgICAgICAgIGZpbmlzaFNwZWVkUGVyY2VudDogMC41LFxuICAgICAgICAgICAgbGVmdE9mZnNldFBlcmNlbnRhZ2U6IDAuOCxcbiAgICAgICAgICAgIHN0YXJ0VmVsb2NpdHk6IDExMDBcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBcHBseSBkZWZhdWx0cyBpZiBwcm9wZXJ0aWVzIGFyZSBub3QgcGFzc2VkXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSA9IG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSB8fCBkZWZhdWx0cy5maW5pc2hEZWxheVRocm90dGxlO1xuICAgICAgICBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCA9IG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50IHx8IGRlZmF1bHRzLmZpbmlzaFNwZWVkUGVyY2VudDtcbiAgICAgICAgb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSA9IG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgfHwgZGVmYXVsdHMubGVmdE9mZnNldFBlcmNlbnRhZ2U7XG4gICAgICAgIG9wdGlvbnMuc3RhcnRWZWxvY2l0eSA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eSB8fCBkZWZhdWx0cy5zdGFydFZlbG9jaXR5O1xuXG4gICAgICAgIC8vIEZhaWwgZWFybHkgJiBzaWxlbnRseSBsb2dcbiAgICAgICAgdmFyIGlzSW52YWxpZFNlbGVjdG9yID0gdHlwZW9mIG9wdGlvbnMuc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuc2VsZWN0b3IgPT09ICcnO1xuXG4gICAgICAgIGlmIChpc0ludmFsaWRTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgYmxpbmRzRG93biBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVCbGluZHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gMDtcblxuICAgICAgICAvLyBDb3VudCB0aGUgZWxlbWVudHMgd2l0aGluIHRoZSBzdGFydGluZyB2aWV3cG9ydCBzbyB3ZSdyZSBub3QgZXhhY3RpbmdcbiAgICAgICAgLy8gbW9yZSBlZmZvcnQgdGhhbiByZXF1aXJlZC4uLlxuICAgICAgICAvL1xuICAgICAgICAvLyBXZSB1c2UgY3NzIHZpc2libGl0eTogaGlkZGVuIGluc3RlYWQgb2YgZGlzcGxheTogbm9uZSBzbyB0aGUgZWxlbWVudHNcbiAgICAgICAgLy8gbWFpbnRhaW4gdGhlaXIgRE9NIGZsb3dcblxuICAgICAgICB2YXIgdmlld3BvcnRIZWlnaHQgPSBnZXRWaWV3cG9ydEhlaWdodCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuaW1hdGVCbGluZHNEb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhbmltYXRlQmxpbmRzRG9tW2ldLm9mZnNldFRvcCA8IHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudEFuaW1hdGlvbkNvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlcXVlbnRpYWxseSBhbmltYXRlIHdpdGggYSBkZWxheSBiYXNlZCBvbiBwcm94aW1pdHlcbiAgICAgICAgdmFyIHNwZWVkID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlQmxpbmRzRG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNoaWxkT2Zmc2V0ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KG9mZnNldCAvIHNwZWVkKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUud2Via2l0VHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5jbGFzc05hbWUgKz0gJyBpbic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXaGVuIHdlJ3JlIGRvbmUgYW5pbWF0aW5nLCBzd2l0Y2ggdGhlIGNsYXNzIHRvICdkb25lJ1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGFuaW1hdGVCbGluZHNEb21baV07XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkT2Zmc2V0ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNoaWxkT2Zmc2V0LmxlZnQgKiBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlICsgY2hpbGRPZmZzZXQudG9wO1xuICAgICAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQob2Zmc2V0IC8gc3BlZWQgLyBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgY2hpbGQucXVlcnlTZWxlY3RvcignaW1nJykuc3R5bGUud2Via2l0VHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgICAgICBjaGlsZC5xdWVyeVNlbGVjdG9yKCdpbWcnKS5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgICAgIC8vY2hpbGQucXVlcnlTZWxlY3RvcignaW1nJykuY2xhc3NOYW1lICs9ICcgaW4nO1xuICAgICAgICAgICAgICAgIGFuaW1hdGVCbGluZHNEb21baV0ucGFyZW50Tm9kZS5jbGFzc05hbWUgKz0gJyBkb25lJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCBzcGVlZCAqIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmYWRlU2xpZGVJbihvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gRGVjbGFyZSBvdXIgZGVmYXVsdHNcbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgZmluaXNoRGVsYXlUaHJvdHRsZTogMixcbiAgICAgICAgICAgIGZpbmlzaFNwZWVkUGVyY2VudDogMC43MixcbiAgICAgICAgICAgIGxlZnRPZmZzZXRQZXJjZW50YWdlOiAwLjgsXG4gICAgICAgICAgICBzdGFydFZlbG9jaXR5OiAxMTAwXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQXBwbHkgZGVmYXVsdHMgaWYgcHJvcGVydGllcyBhcmUgbm90IHBhc3NlZFxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgPSBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgfHwgZGVmYXVsdHMuZmluaXNoRGVsYXlUaHJvdHRsZTtcbiAgICAgICAgb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgPSBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCB8fCBkZWZhdWx0cy5maW5pc2hTcGVlZFBlcmNlbnQ7XG4gICAgICAgIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgPSBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlIHx8IGRlZmF1bHRzLmxlZnRPZmZzZXRQZXJjZW50YWdlO1xuICAgICAgICBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgPSBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgfHwgZGVmYXVsdHMuc3RhcnRWZWxvY2l0eTtcblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGZhZGVTbGlkZUluIHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZUZhZGVTbGlkZUluRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IDA7XG5cbiAgICAgICAgLy8gQ291bnQgdGhlIGVsZW1lbnRzIHdpdGhpbiB0aGUgc3RhcnRpbmcgdmlld3BvcnQgc28gd2UncmUgbm90IGV4YWN0aW5nXG4gICAgICAgIC8vIG1vcmUgZWZmb3J0IHRoYW4gcmVxdWlyZWQuLi5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgdXNlIGNzcyB2aXNpYmxpdHk6IGhpZGRlbiBpbnN0ZWFkIG9mIGRpc3BsYXk6IG5vbmUgc28gdGhlIGVsZW1lbnRzXG4gICAgICAgIC8vIG1haW50YWluIHRoZWlyIERPTSBmbG93XG5cbiAgICAgICAgdmFyIHZpZXdwb3J0SGVpZ2h0ID0gZ2V0Vmlld3BvcnRIZWlnaHQoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbmltYXRlRmFkZVNsaWRlSW5Eb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhbmltYXRlRmFkZVNsaWRlSW5Eb21baV0ub2Zmc2V0VG9wIDwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50QW5pbWF0aW9uQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VxdWVudGlhbGx5IGFuaW1hdGUgd2l0aCBhIGRlbGF5IGJhc2VkIG9uIHByb3hpbWl0eVxuICAgICAgICB2YXIgc3BlZWQgPSBvcHRpb25zLnN0YXJ0VmVsb2NpdHk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGFuaW1hdGVGYWRlU2xpZGVJbkRvbVtpXTtcbiAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNoaWxkT2Zmc2V0LmxlZnQgKiBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlICsgY2hpbGRPZmZzZXQudG9wO1xuICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChvZmZzZXQgLyBzcGVlZCkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLndlYmtpdFRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuY2xhc3NOYW1lICs9ICcgaW4nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2hlbiB3ZSdyZSBkb25lIGFuaW1hdGluZywgc3dpdGNoIHRoZSBjbGFzcyB0byAnZG9uZSdcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlRmFkZVNsaWRlSW5Eb21baV07XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkT2Zmc2V0ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNoaWxkT2Zmc2V0LmxlZnQgKiBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlICsgY2hpbGRPZmZzZXQudG9wO1xuICAgICAgICAgICAgICAgIHZhciBkZWxheVZhbHVlID0gb2Zmc2V0IC8gc3BlZWQgLyBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGU7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChkZWxheVZhbHVlKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgIC8vYW5pbWF0ZUZhZGVTbGlkZUluRG9tWzBdLmNsYXNzTmFtZSArPSAnIGRvbmUnO1xuICAgICAgICAgICAgICAgIGFuaW1hdGVGYWRlU2xpZGVJbkRvbVtpXS5jbGFzc05hbWUgKz0gJyBkb25lJztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIHNwZWVkICogb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZhZGVTbGlkZUluUmlnaHQob3B0aW9ucykge1xuXG4gICAgICAgIC8vIERlY2xhcmUgb3VyIGRlZmF1bHRzXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGZpbmlzaERlbGF5VGhyb3R0bGU6IDIsXG4gICAgICAgICAgICBmaW5pc2hTcGVlZFBlcmNlbnQ6IDAuNzIsXG4gICAgICAgICAgICBsZWZ0T2Zmc2V0UGVyY2VudGFnZTogMC44LFxuICAgICAgICAgICAgc3RhcnRWZWxvY2l0eTogMTEwMFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFwcGx5IGRlZmF1bHRzIGlmIHByb3BlcnRpZXMgYXJlIG5vdCBwYXNzZWRcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlID0gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlIHx8IGRlZmF1bHRzLmZpbmlzaERlbGF5VGhyb3R0bGU7XG4gICAgICAgIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50ID0gb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgfHwgZGVmYXVsdHMuZmluaXNoU3BlZWRQZXJjZW50O1xuICAgICAgICBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlID0gb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSB8fCBkZWZhdWx0cy5sZWZ0T2Zmc2V0UGVyY2VudGFnZTtcbiAgICAgICAgb3B0aW9ucy5zdGFydFZlbG9jaXR5ID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5IHx8IGRlZmF1bHRzLnN0YXJ0VmVsb2NpdHk7XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBmYWRlU2xpZGVJblJpZ2h0IHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZVNsaWRlSW5SaWdodERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBlbGVtZW50QW5pbWF0aW9uQ291bnQgPSAwO1xuXG4gICAgICAgIC8vIENvdW50IHRoZSBlbGVtZW50cyB3aXRoaW4gdGhlIHN0YXJ0aW5nIHZpZXdwb3J0IHNvIHdlJ3JlIG5vdFxuICAgICAgICAvLyBleGFjdGluZyBtb3JlIGVmZm9ydCB0aGFuIHJlcXVpcmVkLi4uXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIHVzZSBjc3MgdmlzaWJsaXR5OiBoaWRkZW4gaW5zdGVhZCBvZiBkaXNwbGF5OiBub25lIHNvIHRoZVxuICAgICAgICAvLyBlbGVtZW50cyBtYWludGFpbiB0aGVpciBET00gZmxvd1xuXG4gICAgICAgIHZhciB2aWV3cG9ydEhlaWdodCA9IGdldFZpZXdwb3J0SGVpZ2h0KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5pbWF0ZVNsaWRlSW5SaWdodERvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuaW1hdGVTbGlkZUluUmlnaHREb21baV0ub2Zmc2V0VG9wIDwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50QW5pbWF0aW9uQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VxdWVudGlhbGx5IGFuaW1hdGUgd2l0aCBhIGRlbGF5IGJhc2VkIG9uIHByb3hpbWl0eVxuICAgICAgICB2YXIgc3BlZWQgPSBvcHRpb25zLnN0YXJ0VmVsb2NpdHk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGFuaW1hdGVTbGlkZUluUmlnaHREb21baV07XG4gICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQob2Zmc2V0IC8gc3BlZWQpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS53ZWJraXRUcmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTmFtZSArPSAnIGluJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdoZW4gd2UncmUgZG9uZSBhbmltYXRpbmcsIHN3aXRjaCB0aGUgY2xhc3MgdG8gJ2RvbmUnXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZVNsaWRlSW5SaWdodERvbVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGF5VmFsdWUgPSBvZmZzZXQgLyBzcGVlZCAvIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZTtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KGRlbGF5VmFsdWUpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbmltYXRlU2xpZGVJblJpZ2h0RG9tLml0ZW0oMCkucGFyZW50Tm9kZS5jbGFzc05hbWUgKz0gJyBkb25lJztcblxuICAgICAgICB9LCBzcGVlZCAqIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYW5JbkxlZnQob3B0aW9ucykge1xuXG4gICAgICAgIC8vIFdlIGhhdmUgYSBzaW5nbGUgb3B0aW9uLCBzbyBpdCBtYXkgYmUgcGFzc2VkIGFzIGEgc3RyaW5nIG9yIHByb3BlcnR5XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IG9wdGlvbnNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIHB1c2hEb3duIHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZVBhbkluTGVmdERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBlbGVtZW50QW5pbWF0aW9uQ291bnQgPSBhbmltYXRlUGFuSW5MZWZ0RG9tLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBhbmltYXRlUGFuSW5MZWZ0RG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZVRvUmVtb3ZlID0gJ2FuaW1hdGUtcGFuLWluLWxlZnQnO1xuICAgICAgICAgICAgdmFyIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSA9IGVsZW1lbnQuY2xhc3NOYW1lLmxhc3RJbmRleE9mKGNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUuc3Vic3RyKDAsIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwdXNoRG93bihvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSBhIHNpbmdsZSBvcHRpb24sIHNvIGl0IG1heSBiZSBwYXNzZWQgYXMgYSBzdHJpbmcgb3IgcHJvcGVydHlcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcjogb3B0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZhaWwgZWFybHkgJiBzaWxlbnRseSBsb2dcbiAgICAgICAgdmFyIGlzSW52YWxpZFNlbGVjdG9yID0gdHlwZW9mIG9wdGlvbnMuc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuc2VsZWN0b3IgPT09ICcnO1xuXG4gICAgICAgIGlmIChpc0ludmFsaWRTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgcHVzaERvd24gc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlUHVzaERvd25Eb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gYW5pbWF0ZVB1c2hEb3duRG9tLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBhbmltYXRlUHVzaERvd25Eb21baV07XG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lVG9SZW1vdmUgPSBvcHRpb25zLnNlbGVjdG9yLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICB2YXIgaW5kZXhPZkNsYXNzTmFtZVRvUmVtb3ZlID0gZWxlbWVudC5jbGFzc05hbWUubGFzdEluZGV4T2YoY2xhc3NOYW1lVG9SZW1vdmUpO1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5zdWJzdHIoMCwgaW5kZXhPZkNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNsaWRlVXAob3B0aW9ucykge1xuXG4gICAgICAgIC8vIFdlIGhhdmUgYSBzaW5nbGUgb3B0aW9uLCBzbyBpdCBtYXkgYmUgcGFzc2VkIGFzIGEgc3RyaW5nIG9yIHByb3BlcnR5XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IG9wdGlvbnNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIHB1c2hEb3duIHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZVNsaWRlVXBEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gYW5pbWF0ZVNsaWRlVXBEb20ubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGFuaW1hdGVTbGlkZVVwRG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZVRvUmVtb3ZlID0gb3B0aW9ucy5zZWxlY3Rvci5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgdmFyIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSA9IGVsZW1lbnQuY2xhc3NOYW1lLmxhc3RJbmRleE9mKGNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUuc3Vic3RyKDAsIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBFeHBvcnQgb2JqZWN0XG4gICAgLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJldHVybiB7XG4gICAgICAgIG1vdGlvbjogbW90aW9uLFxuICAgICAgICB2ZXJzaW9uOiB2ZXJzaW9uXG4gICAgfVxuXG59KSgpO1xuIiwiLyohXG4gKiBXYXZlcyB2MC42LjNcbiAqIGh0dHA6Ly9maWFuLm15LmlkL1dhdmVzIFxuICogXG4gKiBDb3B5cmlnaHQgMjAxNCBBbGZpYW5hIEUuIFNpYnVlYSBhbmQgb3RoZXIgY29udHJpYnV0b3JzIFxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIFxuICogaHR0cHM6Ly9naXRodWIuY29tL2ZpYW5zL1dhdmVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UgXG4gKi9cblxuOyhmdW5jdGlvbih3aW5kb3cpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgV2F2ZXMgPSBXYXZlcyB8fCB7fTtcbiAgICB2YXIgJCQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsLmJpbmQoZG9jdW1lbnQpO1xuXG4gICAgLy8gRmluZCBleGFjdCBwb3NpdGlvbiBvZiBlbGVtZW50XG4gICAgZnVuY3Rpb24gaXNXaW5kb3cob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgb2JqID09PSBvYmoud2luZG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFdpbmRvdyhlbGVtKSB7XG4gICAgICAgIHJldHVybiBpc1dpbmRvdyhlbGVtKSA/IGVsZW0gOiBlbGVtLm5vZGVUeXBlID09PSA5ICYmIGVsZW0uZGVmYXVsdFZpZXc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2Zmc2V0KGVsZW0pIHtcbiAgICAgICAgdmFyIGRvY0VsZW0sIHdpbixcbiAgICAgICAgICAgIGJveCA9IHt0b3A6IDAsIGxlZnQ6IDB9LFxuICAgICAgICAgICAgZG9jID0gZWxlbSAmJiBlbGVtLm93bmVyRG9jdW1lbnQ7XG5cbiAgICAgICAgZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCAhPT0gdHlwZW9mIHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgfVxuICAgICAgICB3aW4gPSBnZXRXaW5kb3coZG9jKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogYm94LnRvcCArIHdpbi5wYWdlWU9mZnNldCAtIGRvY0VsZW0uY2xpZW50VG9wLFxuICAgICAgICAgICAgbGVmdDogYm94LmxlZnQgKyB3aW4ucGFnZVhPZmZzZXQgLSBkb2NFbGVtLmNsaWVudExlZnRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb252ZXJ0U3R5bGUob2JqKSB7XG4gICAgICAgIHZhciBzdHlsZSA9ICcnO1xuXG4gICAgICAgIGZvciAodmFyIGEgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGEpKSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gKGEgKyAnOicgKyBvYmpbYV0gKyAnOycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgIH1cblxuICAgIHZhciBFZmZlY3QgPSB7XG5cbiAgICAgICAgLy8gRWZmZWN0IGRlbGF5XG4gICAgICAgIGR1cmF0aW9uOiA3NTAsXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oZSwgZWxlbWVudCkge1xuXG4gICAgICAgICAgICAvLyBEaXNhYmxlIHJpZ2h0IGNsaWNrXG4gICAgICAgICAgICBpZiAoZS5idXR0b24gPT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbCA9IGVsZW1lbnQgfHwgdGhpcztcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHJpcHBsZVxuICAgICAgICAgICAgdmFyIHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmlwcGxlLmNsYXNzTmFtZSA9ICd3YXZlcy1yaXBwbGUnO1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQocmlwcGxlKTtcblxuICAgICAgICAgICAgLy8gR2V0IGNsaWNrIGNvb3JkaW5hdGUgYW5kIGVsZW1lbnQgd2l0ZGhcbiAgICAgICAgICAgIHZhciBwb3MgICAgICAgICA9IG9mZnNldChlbCk7XG4gICAgICAgICAgICB2YXIgcmVsYXRpdmVZICAgPSAoZS5wYWdlWSAtIHBvcy50b3ApO1xuICAgICAgICAgICAgdmFyIHJlbGF0aXZlWCAgID0gKGUucGFnZVggLSBwb3MubGVmdCk7XG4gICAgICAgICAgICB2YXIgc2NhbGUgICAgICAgPSAnc2NhbGUoJysoKGVsLmNsaWVudFdpZHRoIC8gMTAwKSAqIDMpKycpJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gU3VwcG9ydCBmb3IgdG91Y2ggZGV2aWNlc1xuICAgICAgICAgICAgaWYgKCd0b3VjaGVzJyBpbiBlKSB7XG4gICAgICAgICAgICAgIHJlbGF0aXZlWSAgID0gKGUudG91Y2hlc1swXS5wYWdlWSAtIHBvcy50b3ApO1xuICAgICAgICAgICAgICByZWxhdGl2ZVggICA9IChlLnRvdWNoZXNbMF0ucGFnZVggLSBwb3MubGVmdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCBkYXRhIHRvIGVsZW1lbnRcbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcsIERhdGUubm93KCkpO1xuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnZGF0YS1zY2FsZScsIHNjYWxlKTtcbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIHJlbGF0aXZlWCk7XG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdkYXRhLXknLCByZWxhdGl2ZVkpO1xuXG4gICAgICAgICAgICAvLyBTZXQgcmlwcGxlIHBvc2l0aW9uXG4gICAgICAgICAgICB2YXIgcmlwcGxlU3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgJ3RvcCc6IHJlbGF0aXZlWSsncHgnLFxuICAgICAgICAgICAgICAgICdsZWZ0JzogcmVsYXRpdmVYKydweCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJpcHBsZS5jbGFzc05hbWUgPSByaXBwbGUuY2xhc3NOYW1lICsgJyB3YXZlcy1ub3RyYW5zaXRpb24nO1xuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBjb252ZXJ0U3R5bGUocmlwcGxlU3R5bGUpKTtcbiAgICAgICAgICAgIHJpcHBsZS5jbGFzc05hbWUgPSByaXBwbGUuY2xhc3NOYW1lLnJlcGxhY2UoJ3dhdmVzLW5vdHJhbnNpdGlvbicsICcnKTtcblxuICAgICAgICAgICAgLy8gU2NhbGUgdGhlIHJpcHBsZVxuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtJ10gPSBzY2FsZTtcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctbW96LXRyYW5zZm9ybSddID0gc2NhbGU7XG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLW1zLXRyYW5zZm9ybSddID0gc2NhbGU7XG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLW8tdHJhbnNmb3JtJ10gPSBzY2FsZTtcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlLnRyYW5zZm9ybSA9IHNjYWxlO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGUub3BhY2l0eSAgID0gJzEnO1xuXG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLXdlYmtpdC10cmFuc2l0aW9uLWR1cmF0aW9uJ10gPSBFZmZlY3QuZHVyYXRpb24gKyAnbXMnO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy1tb3otdHJhbnNpdGlvbi1kdXJhdGlvbiddICAgID0gRWZmZWN0LmR1cmF0aW9uICsgJ21zJztcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctby10cmFuc2l0aW9uLWR1cmF0aW9uJ10gICAgICA9IEVmZmVjdC5kdXJhdGlvbiArICdtcyc7XG4gICAgICAgICAgICByaXBwbGVTdHlsZVsndHJhbnNpdGlvbi1kdXJhdGlvbiddICAgICAgICAgPSBFZmZlY3QuZHVyYXRpb24gKyAnbXMnO1xuXG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGNvbnZlcnRTdHlsZShyaXBwbGVTdHlsZSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFRvdWNoSGFuZGxlci50b3VjaHVwKGUpO1xuXG4gICAgICAgICAgICB2YXIgZWwgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gZWwuY2xpZW50V2lkdGggKiAxLjQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdldCBmaXJzdCByaXBwbGVcbiAgICAgICAgICAgIHZhciByaXBwbGUgPSBudWxsO1xuICAgICAgICAgICAgdmFyIHJpcHBsZXMgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3YXZlcy1yaXBwbGUnKTtcbiAgICAgICAgICAgIGlmIChyaXBwbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByaXBwbGUgPSByaXBwbGVzW3JpcHBsZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlbGF0aXZlWCAgID0gcmlwcGxlLmdldEF0dHJpYnV0ZSgnZGF0YS14Jyk7XG4gICAgICAgICAgICB2YXIgcmVsYXRpdmVZICAgPSByaXBwbGUuZ2V0QXR0cmlidXRlKCdkYXRhLXknKTtcbiAgICAgICAgICAgIHZhciBzY2FsZSAgICAgICA9IHJpcHBsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NhbGUnKTtcblxuICAgICAgICAgICAgLy8gR2V0IGRlbGF5IGJlZXR3ZWVuIG1vdXNlZG93biBhbmQgbW91c2UgbGVhdmVcbiAgICAgICAgICAgIHZhciBkaWZmID0gRGF0ZS5ub3coKSAtIE51bWJlcihyaXBwbGUuZ2V0QXR0cmlidXRlKCdkYXRhLWhvbGQnKSk7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSAzNTAgLSBkaWZmO1xuXG4gICAgICAgICAgICBpZiAoZGVsYXkgPCAwKSB7XG4gICAgICAgICAgICAgICAgZGVsYXkgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGYWRlIG91dCByaXBwbGUgYWZ0ZXIgZGVsYXlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAndG9wJzogcmVsYXRpdmVZKydweCcsXG4gICAgICAgICAgICAgICAgICAgICdsZWZ0JzogcmVsYXRpdmVYKydweCcsXG4gICAgICAgICAgICAgICAgICAgICdvcGFjaXR5JzogJzAnLFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIER1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICctd2Via2l0LXRyYW5zaXRpb24tZHVyYXRpb24nOiBFZmZlY3QuZHVyYXRpb24gKyAnbXMnLFxuICAgICAgICAgICAgICAgICAgICAnLW1vei10cmFuc2l0aW9uLWR1cmF0aW9uJzogRWZmZWN0LmR1cmF0aW9uICsgJ21zJyxcbiAgICAgICAgICAgICAgICAgICAgJy1vLXRyYW5zaXRpb24tZHVyYXRpb24nOiBFZmZlY3QuZHVyYXRpb24gKyAnbXMnLFxuICAgICAgICAgICAgICAgICAgICAndHJhbnNpdGlvbi1kdXJhdGlvbic6IEVmZmVjdC5kdXJhdGlvbiArICdtcycsXG4gICAgICAgICAgICAgICAgICAgICctd2Via2l0LXRyYW5zZm9ybSc6IHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAnLW1vei10cmFuc2Zvcm0nOiBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgJy1tcy10cmFuc2Zvcm0nOiBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgJy1vLXRyYW5zZm9ybSc6IHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAndHJhbnNmb3JtJzogc2NhbGUsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgY29udmVydFN0eWxlKHN0eWxlKSk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQocmlwcGxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBFZmZlY3QuZHVyYXRpb24pO1xuICAgICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIExpdHRsZSBoYWNrIHRvIG1ha2UgPGlucHV0PiBjYW4gcGVyZm9ybSB3YXZlcyBlZmZlY3RcbiAgICAgICAgd3JhcElucHV0OiBmdW5jdGlvbihlbGVtZW50cykge1xuICAgICAgICAgICAgZm9yICh2YXIgYSA9IDA7IGEgPCBlbGVtZW50cy5sZW5ndGg7IGErKykge1xuICAgICAgICAgICAgICAgIHZhciBlbCA9IGVsZW1lbnRzW2FdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbnB1dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGVsLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW5wdXQgYWxyZWFkeSBoYXZlIHBhcmVudCBqdXN0IHBhc3MgdGhyb3VnaFxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2knICYmIHBhcmVudC5jbGFzc05hbWUuaW5kZXhPZignd2F2ZXMtZWZmZWN0JykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFB1dCBlbGVtZW50IGNsYXNzIGFuZCBzdHlsZSB0byB0aGUgc3BlY2lmaWVkIHBhcmVudFxuICAgICAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUgKyAnIHdhdmVzLWlucHV0LXdyYXBwZXInO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50U3R5bGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50U3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRTdHlsZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgZWxlbWVudFN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9ICd3YXZlcy1idXR0b24taW5wdXQnO1xuICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUHV0IGVsZW1lbnQgYXMgY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJlcGxhY2VDaGlsZCh3cmFwcGVyLCBlbCk7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIERpc2FibGUgbW91c2Vkb3duIGV2ZW50IGZvciA1MDBtcyBkdXJpbmcgYW5kIGFmdGVyIHRvdWNoXG4gICAgICovXG4gICAgdmFyIFRvdWNoSGFuZGxlciA9IHtcbiAgICAgICAgLyogdXNlcyBhbiBpbnRlZ2VyIHJhdGhlciB0aGFuIGJvb2wgc28gdGhlcmUncyBubyBpc3N1ZXMgd2l0aFxuICAgICAgICAgKiBuZWVkaW5nIHRvIGNsZWFyIHRpbWVvdXRzIGlmIGFub3RoZXIgdG91Y2ggZXZlbnQgb2NjdXJyZWRcbiAgICAgICAgICogd2l0aGluIHRoZSA1MDBtcy4gQ2Fubm90IG1vdXNldXAgYmV0d2VlbiB0b3VjaHN0YXJ0IGFuZFxuICAgICAgICAgKiB0b3VjaGVuZCwgbm9yIGluIHRoZSA1MDBtcyBhZnRlciB0b3VjaGVuZC4gKi9cbiAgICAgICAgdG91Y2hlczogMCxcbiAgICAgICAgYWxsb3dFdmVudDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIGFsbG93ID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICAgICAgICAgICAgVG91Y2hIYW5kbGVyLnRvdWNoZXMgKz0gMTsgLy9wdXNoXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ3RvdWNoZW5kJyB8fCBlLnR5cGUgPT09ICd0b3VjaGNhbmNlbCcpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoVG91Y2hIYW5kbGVyLnRvdWNoZXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb3VjaEhhbmRsZXIudG91Y2hlcyAtPSAxOyAvL3BvcCBhZnRlciA1MDBtc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS50eXBlID09PSAnbW91c2Vkb3duJyAmJiBUb3VjaEhhbmRsZXIudG91Y2hlcyA+IDApIHtcbiAgICAgICAgICAgICAgICBhbGxvdyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYWxsb3c7XG4gICAgICAgIH0sXG4gICAgICAgIHRvdWNodXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFRvdWNoSGFuZGxlci5hbGxvd0V2ZW50KGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogRGVsZWdhdGVkIGNsaWNrIGhhbmRsZXIgZm9yIC53YXZlcy1lZmZlY3QgZWxlbWVudC5cbiAgICAgKiByZXR1cm5zIG51bGwgd2hlbiAud2F2ZXMtZWZmZWN0IGVsZW1lbnQgbm90IGluIFwiY2xpY2sgdHJlZVwiXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0V2F2ZXNFZmZlY3RFbGVtZW50KGUpIHtcbiAgICAgICAgaWYgKFRvdWNoSGFuZGxlci5hbGxvd0V2ZW50KGUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWxlbWVudCA9IG51bGw7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XG5cbiAgICAgICAgd2hpbGUgKHRhcmdldC5wYXJlbnRFbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KSAmJiB0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3dhdmVzLWVmZmVjdCcpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3dhdmVzLWVmZmVjdCcpKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRhcmdldDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnViYmxlIHRoZSBjbGljayBhbmQgc2hvdyBlZmZlY3QgaWYgLndhdmVzLWVmZmVjdCBlbGVtIHdhcyBmb3VuZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNob3dFZmZlY3QoZSkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGdldFdhdmVzRWZmZWN0RWxlbWVudChlKTtcblxuICAgICAgICBpZiAoZWxlbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgRWZmZWN0LnNob3coZSwgZWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgRWZmZWN0LmhpZGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgRWZmZWN0LmhpZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgRWZmZWN0LmhpZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIEVmZmVjdC5oaWRlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBXYXZlcy5kaXNwbGF5RWZmZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBpZiAoJ2R1cmF0aW9uJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBFZmZlY3QuZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL1dyYXAgaW5wdXQgaW5zaWRlIDxpPiB0YWdcbiAgICAgICAgRWZmZWN0LndyYXBJbnB1dCgkJCgnLndhdmVzLWVmZmVjdCcpKTtcbiAgICAgICAgXG4gICAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNob3dFZmZlY3QsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzaG93RWZmZWN0LCBmYWxzZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEF0dGFjaCBXYXZlcyB0byBhbiBpbnB1dCBlbGVtZW50IChvciBhbnkgZWxlbWVudCB3aGljaCBkb2Vzbid0XG4gICAgICogYnViYmxlIG1vdXNldXAvbW91c2Vkb3duIGV2ZW50cykuXG4gICAgICogICBJbnRlbmRlZCB0byBiZSB1c2VkIHdpdGggZHluYW1pY2FsbHkgbG9hZGVkIGZvcm1zL2lucHV0cywgb3JcbiAgICAgKiB3aGVyZSB0aGUgdXNlciBkb2Vzbid0IHdhbnQgYSBkZWxlZ2F0ZWQgY2xpY2sgaGFuZGxlci5cbiAgICAgKi9cbiAgICBXYXZlcy5hdHRhY2ggPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIC8vRlVUVVJFOiBhdXRvbWF0aWNhbGx5IGFkZCB3YXZlcyBjbGFzc2VzIGFuZCBhbGxvdyB1c2Vyc1xuICAgICAgICAvLyB0byBzcGVjaWZ5IHRoZW0gd2l0aCBhbiBvcHRpb25zIHBhcmFtPyBFZy4gbGlnaHQvY2xhc3NpYy9idXR0b25cbiAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICBFZmZlY3Qud3JhcElucHV0KFtlbGVtZW50XSk7XG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgc2hvd0VmZmVjdCwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzaG93RWZmZWN0LCBmYWxzZSk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5XYXZlcyA9IFdhdmVzO1xufSkod2luZG93KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==