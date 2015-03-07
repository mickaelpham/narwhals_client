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
      this.$scope.transactions = [];
      return this.loadTransactions();
    };

    IndexController.prototype.logout = function() {
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

    LoginController.inject('$scope', '$http', '$state', 'User');

    LoginController.prototype.login = function() {
      this.$scope.isLoading = true;
      return this.User.login(this.$scope.username, this.$scope.password).then((function(_this) {
        return function() {
          _this.$scope.isLoading = false;
          return _this.$state.go('index');
        };
      })(this));
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
      this.$scope.transaction = this.currentTransaction;
      return Mi.motion.slideUp({
        selector: '.slide-up'
      });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC5jb2ZmZWUiLCJjb250cm9sbGVyL0Jhc2VDb250cm9sbGVyLmNvZmZlZSIsInNlcnZpY2UvVXNlclNlcnZpY2UuY29mZmVlIiwibG9naW4vTG9naW5Nb2R1bGUuY29mZmVlIiwicmVjdXJyaW5nL1JlY3VycmluZ01vZHVsZS5jb2ZmZWUiLCJyZXBvcnQvUmVwb3J0TW9kdWxlLmNvZmZlZSIsImluZGV4L2NvbnRyb2xsZXIvSW5kZXhDb250cm9sbGVyLmNvZmZlZSIsImxvZ2luL2NvbnRyb2xsZXIvTG9naW5Db250cm9sbGVyLmNvZmZlZSIsImxvZ2luL2RpcmVjdGl2ZS9pb25NZElucHV0LmNvZmZlZSIsInJlY3VycmluZy9jb250cm9sbGVyL1JlY3VycmluZ0NvbnRyb2xsZXIuY29mZmVlIiwicmVwb3J0L2NvbnRyb2xsZXIvUmVwb3J0Q29udHJvbGxlci5jb2ZmZWUiLCJtYXRlcmlhbC1pb25pYy5qcyIsIndhdmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BO0FBQUEsTUFBQSxHQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsU0FBZixFQUEwQixDQUM5QixPQUQ4QixFQUU5QixlQUY4QixFQUc5QixnQkFIOEIsRUFJOUIsbUJBSjhCLEVBSzlCLFdBTDhCLENBQTFCLENBQU4sQ0FBQTs7QUFBQSxFQVFBLEdBQUcsQ0FBQyxHQUFKLENBQVEsU0FBQyxjQUFELEVBQWlCLFVBQWpCLEdBQUE7QUFDTixJQUFBLGNBQWMsQ0FBQyxLQUFmLENBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsSUFBbUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBN0M7QUFDRSxRQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF6QixDQUFrRCxJQUFsRCxDQUFBLENBREY7T0FEQTtBQUdBLE1BQUEsSUFBRyxNQUFNLENBQUMsU0FBVjtlQUVFLFNBQVMsQ0FBQyxZQUFWLENBQUEsRUFGRjtPQUptQjtJQUFBLENBQXJCLENBQUEsQ0FBQTtBQUFBLElBU0EsVUFBVSxDQUFDLEdBQVgsQ0FBZSxtQkFBZixFQUFvQyxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFFBQWpCLEVBQTJCLFNBQTNCLEVBQXNDLFVBQXRDLEdBQUE7QUFDbEMsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLG1CQUFBLEdBQW9CLE9BQU8sQ0FBQyxHQUF4QyxDQUFBLENBQUE7YUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLG1CQUFBLEdBQW9CLE9BQU8sQ0FBQyxJQUF4QyxFQUZrQztJQUFBLENBQXBDLENBVEEsQ0FBQTtBQUFBLElBWUEsVUFBVSxDQUFDLEdBQVgsQ0FBZSxtQkFBZixFQUFvQyxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFFBQWpCLEVBQTJCLFNBQTNCLEVBQXNDLFVBQXRDLEVBQWtELEtBQWxELEdBQUE7QUFDbEMsTUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLHdCQUFkLENBQUEsQ0FBQTthQUNBLE9BQU8sQ0FBQyxLQUFSLENBQWMsS0FBZCxFQUZrQztJQUFBLENBQXBDLENBWkEsQ0FBQTtXQWVBLFVBQVUsQ0FBQyxHQUFYLENBQWUscUJBQWYsRUFBc0MsU0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixRQUFqQixFQUEyQixTQUEzQixFQUFzQyxVQUF0QyxHQUFBO2FBQ3BDLE9BQU8sQ0FBQyxHQUFSLENBQVksMkJBQVosRUFEb0M7SUFBQSxDQUF0QyxFQWhCTTtFQUFBLENBQVIsQ0FSQSxDQUFBOztBQUFBLEVBNkJBLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBQyxjQUFELEVBQWlCLGtCQUFqQixHQUFBO0FBS1QsSUFBQSxjQUFjLENBQUMsS0FBZixDQUFxQixPQUFyQixFQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssR0FBTDtBQUFBLE1BQ0EsVUFBQSxFQUFZLGlCQURaO0FBQUEsTUFFQSxXQUFBLEVBQWEsc0JBRmI7S0FERixDQUFBLENBQUE7QUFBQSxJQUtBLGtCQUFrQixDQUFDLFNBQW5CLENBQTZCLEdBQTdCLENBTEEsQ0FMUztFQUFBLENBQVgsQ0E3QkEsQ0FBQTtBQUFBOzs7QUNjQTtBQUFBLE1BQUEsZ0JBQUE7O0FBQUEsRUFBTSxJQUFDLENBQUE7QUFDTCxJQUFBLGNBQUMsQ0FBQSxRQUFELEdBQVcsU0FBQyxHQUFELEVBQU0sSUFBTixHQUFBO0FBQ1QsVUFBQSxHQUFBOztRQUFBLE9BQVEsSUFBQyxDQUFBLElBQUQsc0VBQWtELENBQUEsQ0FBQTtPQUExRDthQUNBLEdBQUcsQ0FBQyxVQUFKLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUZTO0lBQUEsQ0FBWCxDQUFBOztBQUFBLElBSUEsY0FBQyxDQUFBLE1BQUQsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLElBQUE7QUFBQSxNQURRLDREQUNSLENBQUE7YUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBREo7SUFBQSxDQUpULENBQUE7O0FBUWEsSUFBQSx3QkFBQSxHQUFBO0FBQ1gsVUFBQSx1Q0FBQTtBQUFBLE1BRFksNERBQ1osQ0FBQTtBQUFBO0FBQUEsV0FBQSxxREFBQTt5QkFBQTtBQUNFLFFBQUEsSUFBRSxDQUFBLEdBQUEsQ0FBRixHQUFTLElBQUssQ0FBQSxLQUFBLENBQWQsQ0FERjtBQUFBLE9BQUE7QUFHQTtBQUFBLFdBQUEsV0FBQTt1QkFBQTtBQUNFLFFBQUEsSUFBZ0IsTUFBQSxDQUFBLEVBQUEsS0FBYSxVQUE3QjtBQUFBLG1CQUFBO1NBQUE7QUFDQSxRQUFBLElBQVksQ0FBQSxHQUFBLEtBQVEsYUFBUixJQUFBLEdBQUEsS0FBdUIsWUFBdkIsQ0FBQSxJQUF3QyxHQUFJLENBQUEsQ0FBQSxDQUFKLEtBQVUsR0FBOUQ7QUFBQSxtQkFBQTtTQURBO0FBQUEsUUFFQSxJQUFDLENBQUEsTUFBTyxDQUFBLEdBQUEsQ0FBUixvQ0FBZSxFQUFFLENBQUMsS0FBTSxlQUFULElBQWUsQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLEVBQVcsSUFBWCxDQUY5QixDQURGO0FBQUEsT0FIQTs7UUFRQSxJQUFDLENBQUE7T0FUVTtJQUFBLENBUmI7OzBCQUFBOztNQURGLENBQUE7QUFBQTs7O0FDcEJBO0FBQUEsTUFBQSxHQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsU0FBZixDQUFOLENBQUE7O0FBQUEsRUFFQSxHQUFHLENBQUMsT0FBSixDQUFZLE1BQVosRUFBb0I7SUFBQyxPQUFELEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDNUIsVUFBQSxJQUFBO2FBQUEsR0FBQSxDQUFBLENBQVU7QUFDSyxRQUFBLGNBQUEsR0FBQSxDQUFiOztBQUFBLHVCQUVBLEtBQUEsR0FBTyxTQUFDLFFBQUQsRUFBVyxRQUFYLEdBQUE7QUFDTCxjQUFBLE9BQUE7QUFBQSxVQUFBLE9BQUEsR0FBVSxLQUFLLENBQUMsSUFBTixDQUFXLDJEQUFYLEVBQXdFO0FBQUEsWUFBQyxLQUFBLEVBQU8sUUFBUjtBQUFBLFlBQWtCLFFBQUEsRUFBVSxRQUE1QjtXQUF4RSxDQUFWLENBQUE7QUFDQSxpQkFBTyxPQUFQLENBRks7UUFBQSxDQUZQLENBQUE7O29CQUFBOztZQUYwQjtJQUFBLENBQVY7R0FBcEIsQ0FGQSxDQUFBO0FBQUE7OztBQ0FBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQU8sQ0FBQyxNQUFSLENBQWUsZUFBZixFQUFnQyxFQUFoQyxDQUFkLENBQUE7O0FBQUEsRUFFQSxXQUFXLENBQUMsTUFBWixDQUFtQixTQUFDLGNBQUQsR0FBQTtXQUNqQixjQUNBLENBQUMsS0FERCxDQUNPLE9BRFAsRUFFRTtBQUFBLE1BQUEsR0FBQSxFQUFLLFNBQUw7QUFBQSxNQUNBLFdBQUEsRUFBYSxzQkFEYjtBQUFBLE1BRUEsVUFBQSxFQUFZLGlCQUZaO0tBRkYsRUFEaUI7RUFBQSxDQUFuQixDQUZBLENBQUE7QUFBQTs7O0FDQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQU8sQ0FBQyxNQUFSLENBQWUsbUJBQWYsRUFBb0MsRUFBcEMsQ0FBbEIsQ0FBQTs7QUFBQSxFQUVBLGVBQWUsQ0FBQyxNQUFoQixDQUF1QixTQUFDLGNBQUQsR0FBQTtXQUNyQixjQUNBLENBQUMsS0FERCxDQUNPLFdBRFAsRUFFRTtBQUFBLE1BQUEsR0FBQSxFQUFLLGFBQUw7QUFBQSxNQUNBLFdBQUEsRUFBYSwwQkFEYjtBQUFBLE1BRUEsVUFBQSxFQUFZLHFCQUZaO0FBQUEsTUFHQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLGtCQUFBLEVBQW9CO1VBQUMsWUFBRCxFQUFlLFNBQUMsVUFBRCxHQUFBO0FBQ2pDLG1CQUFPLFVBQVUsQ0FBQyxrQkFBbEIsQ0FEaUM7VUFBQSxDQUFmO1NBQXBCO09BSkY7S0FGRixFQURxQjtFQUFBLENBQXZCLENBRkEsQ0FBQTtBQUFBOzs7QUNBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFPLENBQUMsTUFBUixDQUFlLGdCQUFmLEVBQWlDLEVBQWpDLENBQWYsQ0FBQTs7QUFBQSxFQUVBLFlBQVksQ0FBQyxNQUFiLENBQW9CLFNBQUMsY0FBRCxHQUFBO1dBQ2xCLGNBQ0EsQ0FBQyxLQURELENBQ08sUUFEUCxFQUVFO0FBQUEsTUFBQSxHQUFBLEVBQUssVUFBTDtBQUFBLE1BQ0EsV0FBQSxFQUFhLHVCQURiO0FBQUEsTUFFQSxVQUFBLEVBQVksa0JBRlo7S0FGRixFQURrQjtFQUFBLENBQXBCLENBRkEsQ0FBQTtBQUFBOzs7QUNBQTtBQUFBLE1BQUEsb0JBQUE7SUFBQTs7K0JBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmLENBQU4sQ0FBQTs7QUFBQSxFQUVNO0FBRUosdUNBQUEsQ0FBQTs7Ozs7OztLQUFBOztBQUFBLElBQUEsZUFBQyxDQUFBLFFBQUQsQ0FBVSxHQUFWLENBQUEsQ0FBQTs7QUFBQSxJQUNBLGVBQUMsQ0FBQSxNQUFELENBQVEsUUFBUixFQUFrQixPQUFsQixFQUEyQixRQUEzQixFQUFxQyxZQUFyQyxDQURBLENBQUE7O0FBQUEsOEJBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEdBQXVCLEVBQXZCLENBQUE7YUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQUZVO0lBQUEsQ0FIWixDQUFBOztBQUFBLDhCQU9BLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxPQUFYLEVBRE07SUFBQSxDQVBSLENBQUE7O0FBQUEsOEJBVUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsd0JBQW5CLENBREEsQ0FBQTthQUVBLFVBQUEsQ0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLGdCQUFWLENBQTJCO0FBQUEsUUFDcEMsUUFBQSxFQUFVLGtDQUQwQjtPQUEzQixDQUFYLEVBRUksRUFGSixFQUhPO0lBQUEsQ0FWVCxDQUFBOztBQUFBLDhCQWlCQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7YUFDaEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEdBQXVCO1FBQ3JCO0FBQUEsVUFDRSxJQUFBLEVBQU0sT0FEUjtBQUFBLFVBRUUsTUFBQSxFQUFRLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FGVjtTQURxQixFQUlsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLGFBREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0FKa0IsRUFRbEI7QUFBQSxVQUNELElBQUEsRUFBTSxvQkFETDtBQUFBLFVBRUQsTUFBQSxFQUFRLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FGUDtTQVJrQixFQVlsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLGFBREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0Faa0IsRUFnQmxCO0FBQUEsVUFDRCxJQUFBLEVBQU0sV0FETDtBQUFBLFVBRUQsTUFBQSxFQUFRLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FGUDtTQWhCa0IsRUFvQmxCO0FBQUEsVUFDRCxJQUFBLEVBQU0sYUFETDtBQUFBLFVBRUQsTUFBQSxFQUFRLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FGUDtTQXBCa0IsRUF3QmxCO0FBQUEsVUFDRCxJQUFBLEVBQU0sZUFETDtBQUFBLFVBRUQsTUFBQSxFQUFRLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FGUDtTQXhCa0IsRUE0QmxCO0FBQUEsVUFDRCxJQUFBLEVBQU0sZUFETDtBQUFBLFVBRUQsTUFBQSxFQUFRLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FGUDtTQTVCa0IsRUFnQ2xCO0FBQUEsVUFDRCxJQUFBLEVBQU0sU0FETDtBQUFBLFVBRUQsTUFBQSxFQUFRLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FGUDtTQWhDa0IsRUFvQ2xCO0FBQUEsVUFDRCxJQUFBLEVBQU0sS0FETDtBQUFBLFVBRUQsTUFBQSxFQUFRLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FGUDtTQXBDa0IsRUF3Q2xCO0FBQUEsVUFDRCxJQUFBLEVBQU0sZ0JBREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0F4Q2tCLEVBNENsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLG1CQURMO0FBQUEsVUFFRCxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZQO1NBNUNrQixFQWdEbEI7QUFBQSxVQUNELElBQUEsRUFBTSxRQURMO0FBQUEsVUFFRCxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZQO1NBaERrQixFQW9EbEI7QUFBQSxVQUNELElBQUEsRUFBTSxXQURMO0FBQUEsVUFFRCxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZQO1NBcERrQixFQXdEbEI7QUFBQSxVQUNELElBQUEsRUFBTSxRQURMO0FBQUEsVUFFRCxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZQO1NBeERrQixFQTREbEI7QUFBQSxVQUNELElBQUEsRUFBTSxXQURMO0FBQUEsVUFFRCxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZQO1NBNURrQixFQWdFbEI7QUFBQSxVQUNELElBQUEsRUFBTSxtQkFETDtBQUFBLFVBRUQsTUFBQSxFQUFRLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FGUDtTQWhFa0IsRUFvRWxCO0FBQUEsVUFDRCxJQUFBLEVBQU0sZ0JBREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0FwRWtCLEVBd0VsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLFdBREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0F4RWtCLEVBNEVsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLFFBREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0E1RWtCLEVBZ0ZsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLE1BREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0FoRmtCLEVBb0ZsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLGFBREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0FwRmtCLEVBd0ZsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLFdBREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0F4RmtCLEVBNEZsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLFFBREw7QUFBQSxVQUVELE1BQUEsRUFBUSxJQUFDLENBQUEsZUFBRCxDQUFBLENBRlA7U0E1RmtCLEVBZ0dsQjtBQUFBLFVBQ0QsSUFBQSxFQUFNLHFCQURMO0FBQUEsVUFFRCxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZQO1NBaEdrQixFQW9HbEI7QUFBQSxVQUNELElBQUEsRUFBTSxhQURMO0FBQUEsVUFFRCxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZQO1NBcEdrQixFQXdHbEI7QUFBQSxVQUNELElBQUEsRUFBTSxjQURMO0FBQUEsVUFFRCxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZQO1NBeEdrQixFQTRHbEI7QUFBQSxVQUNELElBQUEsRUFBTSxVQURMO0FBQUEsVUFFRCxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZQO1NBNUdrQixFQWdIckI7QUFBQSxVQUNFLElBQUEsRUFBTSxXQURSO0FBQUEsVUFFRSxNQUFBLEVBQVEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZWO1NBaEhxQjtRQURQO0lBQUEsQ0FqQmxCLENBQUE7O0FBQUEsOEJBd0lBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsYUFBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixJQUEzQixDQUFBLEdBQW1DLEdBQTFDLENBRGU7SUFBQSxDQXhJakIsQ0FBQTs7QUFBQSw4QkEySUEsZUFBQSxHQUFpQixTQUFDLFdBQUQsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxrQkFBWixHQUFpQyxXQUFqQyxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsV0FBWCxFQUZlO0lBQUEsQ0EzSWpCLENBQUE7OzJCQUFBOztLQUY0QixlQUY5QixDQUFBO0FBQUE7OztBQ0FBO0FBQUEsTUFBQSw0QkFBQTtJQUFBOzsrQkFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFPLENBQUMsTUFBUixDQUFlLGVBQWYsQ0FBZCxDQUFBOztBQUFBLEVBRU07QUFFSix1Q0FBQSxDQUFBOzs7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxRQUFELENBQVUsV0FBVixDQUFBLENBQUE7O0FBQUEsSUFDQSxlQUFDLENBQUEsTUFBRCxDQUFRLFFBQVIsRUFBa0IsT0FBbEIsRUFBMkIsUUFBM0IsRUFBcUMsTUFBckMsQ0FEQSxDQUFBOztBQUFBLDhCQUdBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixHQUFvQixJQUFwQixDQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFwQixFQUE4QixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQXRDLENBQStDLENBQUMsSUFBaEQsQ0FBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwRCxVQUFBLEtBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixHQUFvQixLQUFwQixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixDQUFXLE9BQVgsRUFGb0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0RCxFQUZLO0lBQUEsQ0FIUCxDQUFBOztBQUFBLDhCQVVBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixHQUFtQixFQUFuQixDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLEdBQW1CLEdBRlQ7SUFBQSxDQVZaLENBQUE7OzJCQUFBOztLQUY0QixlQUY5QixDQUFBO0FBQUE7OztBQ0FBO0FBQUEsRUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGVBQWYsQ0FBK0IsQ0FBQyxTQUFoQyxDQUEwQyxZQUExQyxFQUF3RCxTQUFBLEdBQUE7V0FDdEQ7QUFBQSxNQUNFLFFBQUEsRUFBVSxHQURaO0FBQUEsTUFFRSxPQUFBLEVBQVMsSUFGWDtBQUFBLE1BR0UsT0FBQSxFQUFTLFVBSFg7QUFBQSxNQUlFLFFBQUEsRUFBVSwrQ0FBQSxHQUFrRCxxQkFBbEQsR0FBMEUsbUNBQTFFLEdBQWdILCtCQUFoSCxHQUFrSixVQUo5SjtBQUFBLE1BS0UsT0FBQSxFQUFTLFNBQUMsT0FBRCxFQUFVLElBQVYsR0FBQTtBQUNQLFlBQUEsZ0RBQUE7QUFBQSxRQUFBLFNBQUEsR0FBWSxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBWCxDQUF5QixZQUF6QixDQUFaLENBQUE7QUFBQSxRQUNBLGNBQUEsR0FBaUIsTUFEakIsQ0FBQTtBQUVBLFFBQUEsSUFBRyxDQUFBLElBQUssQ0FBQyxjQUFUO0FBQ0UsVUFBQSxjQUFBLEdBQWlCLE1BQWpCLENBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxjQUF0QixDQUhGO1NBRkE7QUFBQSxRQU1BLFNBQVMsQ0FBQyxTQUFWLElBQXVCLGFBQUEsR0FBZ0IsY0FOdkMsQ0FBQTtBQUFBLFFBT0EsS0FBQSxHQUFRLE9BQU8sQ0FBQyxJQUFSLENBQWEsTUFBYixDQVBSLENBQUE7QUFBQSxRQVFBLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBSSxDQUFDLFdBQWhCLENBUkEsQ0FBQTtBQUFBLFFBU0EsS0FBQSxHQUFRLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBYixDQVRSLENBQUE7QUFBQSxRQVVBLEtBQUssQ0FBQyxJQUFOLENBQVcsTUFBWCxFQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosQ0FBQSxDQUFBO0FBQ0EsVUFBQSxJQUFHLEtBQUssQ0FBQyxHQUFOLENBQUEsQ0FBSDtBQUNFLFlBQUEsS0FBSyxDQUFDLFFBQU4sQ0FBZSxNQUFmLENBQUEsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLEtBQUssQ0FBQyxXQUFOLENBQWtCLE1BQWxCLENBQUEsQ0FIRjtXQUZpQjtRQUFBLENBQW5CLENBVkEsQ0FBQTtBQUFBLFFBaUJBLE9BQU8sQ0FBQyxPQUFSLENBQWdCO0FBQUEsVUFDZCxNQUFBLEVBQVEsSUFBSSxDQUFDLElBREM7QUFBQSxVQUVkLE1BQUEsRUFBUSxJQUFJLENBQUMsSUFGQztBQUFBLFVBR2QsVUFBQSxFQUFZLElBQUksQ0FBQyxPQUhIO0FBQUEsVUFJZCxVQUFBLEVBQVksSUFBSSxDQUFDLE9BSkg7QUFBQSxVQUtkLFVBQUEsRUFBWSxJQUFJLENBQUMsUUFMSDtBQUFBLFVBTWQsYUFBQSxFQUFlLElBQUksQ0FBQyxVQU5OO0FBQUEsVUFPZCxjQUFBLEVBQWdCLElBQUksQ0FBQyxXQVBQO0FBQUEsVUFRZCxjQUFBLEVBQWdCLElBQUksQ0FBQyxXQVJQO0FBQUEsVUFTZCxZQUFBLEVBQWMsSUFBSSxDQUFDLFNBVEw7QUFBQSxVQVVkLFdBQUEsRUFBYSxJQUFJLENBQUMsUUFWSjtBQUFBLFVBV2QsU0FBQSxFQUFXLElBQUksQ0FBQyxJQVhGO0FBQUEsVUFZZCxTQUFBLEVBQVcsSUFBSSxDQUFDLE1BWkY7QUFBQSxVQWFkLFVBQUEsRUFBWSxJQUFJLENBQUMsT0FiSDtTQUFoQixFQWNHLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNELFVBQUEsSUFBRyxPQUFPLENBQUMsU0FBUixDQUFrQixLQUFsQixDQUFIO0FBQ0UsWUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsRUFBaUIsS0FBakIsQ0FBQSxDQURGO1dBREM7UUFBQSxDQWRILENBakJBLENBQUE7QUFBQSxRQW9DQSxPQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxLQUFLLENBQUMsR0FBTixDQUFVLFVBQVYsRUFBc0IsT0FBdEIsRUFBK0IsT0FBUSxDQUFBLENBQUEsQ0FBdkMsQ0FBQSxDQURRO1FBQUEsQ0FwQ1YsQ0FBQTtBQUFBLFFBd0NBLEtBQUssQ0FBQyxFQUFOLENBQVMsVUFBVCxFQUFxQixPQUFyQixFQUE4QixPQUFRLENBQUEsQ0FBQSxDQUF0QyxDQXhDQSxDQURPO01BQUEsQ0FMWDtNQURzRDtFQUFBLENBQXhELENBQUEsQ0FBQTtBQUFBOzs7QUNBQTtBQUFBLE1BQUEsb0NBQUE7SUFBQTsrQkFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBTyxDQUFDLE1BQVIsQ0FBZSxtQkFBZixDQUFsQixDQUFBOztBQUFBLEVBRU07QUFFSiwyQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxtQkFBQyxDQUFBLFFBQUQsQ0FBVSxlQUFWLENBQUEsQ0FBQTs7QUFBQSxJQUNBLG1CQUFDLENBQUEsTUFBRCxDQUFRLFFBQVIsRUFBa0IsT0FBbEIsRUFBMkIsUUFBM0IsRUFBcUMsY0FBckMsRUFBcUQsb0JBQXJELENBREEsQ0FBQTs7QUFBQSxrQ0FHQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsT0FBaEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLEdBQXNCLElBQUMsQ0FBQSxrQkFEdkIsQ0FBQTthQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBVixDQUFrQjtBQUFBLFFBQ2hCLFFBQUEsRUFBVSxXQURNO09BQWxCLEVBSFU7SUFBQSxDQUhaLENBQUE7OytCQUFBOztLQUZnQyxlQUZsQyxDQUFBO0FBQUE7OztBQ0FBO0FBQUEsTUFBQSw4QkFBQTtJQUFBOytCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQU8sQ0FBQyxNQUFSLENBQWUsZ0JBQWYsQ0FBZixDQUFBOztBQUFBLEVBRU07QUFFSix3Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLFFBQUQsQ0FBVSxZQUFWLENBQUEsQ0FBQTs7QUFBQSxJQUNBLGdCQUFDLENBQUEsTUFBRCxDQUFRLFFBQVIsQ0FEQSxDQUFBOztBQUFBLCtCQUdBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixHQUFrQjtRQUFDO0FBQUEsVUFDakIsSUFBQSxFQUFLLFVBRFk7U0FBRDtPQUFsQixDQUFBO2FBR0EsVUFBQSxDQUFZLFNBQUEsR0FBQTtlQUNWLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVixDQUFxQjtBQUFBLFVBQUUsUUFBQSxFQUFVLE9BQVo7U0FBckIsRUFEVTtNQUFBLENBQVosRUFFRSxHQUZGLEVBSlU7SUFBQSxDQUhaLENBQUE7OzRCQUFBOztLQUY2QixlQUYvQixDQUFBO0FBQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibmFyd2hhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiMgSW9uaWMgU3RhcnRlciBBcHBcbiMgYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbiMgJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4jIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbiMgJ3N0YXJ0ZXIuc2VydmljZXMnIGlzIGZvdW5kIGluIHNlcnZpY2VzLmpzXG4jICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuYXBwID0gYW5ndWxhci5tb2R1bGUoJ25hcndoYWwnLCBbXG4gICdpb25pYydcbiAgJ25hcndoYWwubG9naW4nXG4gICduYXJ3aGFsLnJlcG9ydCdcbiAgJ25hcndoYWwucmVjdXJyaW5nJ1xuICAndWkucm91dGVyJ1xuXSlcblxuYXBwLnJ1bigoJGlvbmljUGxhdGZvcm0sICRyb290U2NvcGUpIC0+XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5IC0+XG4gICAgY29uc29sZS5sb2cgXCJSZWFkeSFcIlxuICAgIGlmIHdpbmRvdy5jb3Jkb3ZhIGFuZCB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkXG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyIHRydWVcbiAgICBpZiB3aW5kb3cuU3RhdHVzQmFyXG4gICAgICAjIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKVxuXG5cbiAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN0YXJ0JywgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiQ2hhbmdlZCByb3V0ZSB0byAje3RvU3RhdGUudXJsfVwiXG4gICAgY29uc29sZS5sb2cgXCJDaGFuZ2VkIHJvdXRlIHRvICN7dG9TdGF0ZS5uYW1lfVwiXG4gICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VFcnJvcicsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpLT5cbiAgICBjb25zb2xlLmVycm9yICdDb3VsZCBub3QgY2hhbmdlIHN0YXRlJ1xuICAgIGNvbnNvbGUuZXJyb3IgZXJyb3JcbiAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpLT5cbiAgICBjb25zb2xlLmxvZyAnU3VjY2Vzc2Z1bHkgY2hhbmdlZCBzdGF0ZSdcblxuKVxuXG5hcHAuY29uZmlnICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSAtPlxuICAjIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAjIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gICMgU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgIyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2luZGV4JyxcbiAgICB1cmw6ICcvJ1xuICAgIGNvbnRyb2xsZXI6ICdJbmRleENvbnRyb2xsZXInXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaW5kZXguaHRtbCcpXG5cbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSAnLydcblxuXG4gIHJldHVybiIsIiMgQmFzZSBjbGFzcyBmb3IgYW5ndWxhciBjb250cm9sbGVycywgd2hpY2ggZWFzZXMgdGhlIHByb2Nlc3Mgb2YgaW5pdGlhbGl6YXRpb24gYW5kIGRlcGVuZGVuY3kgaW5qZWN0aW9uLlxuIyBUaGlzIGFwcHJvYWNoIGlzIGJhc2VkIG9uIGh0dHA6Ly93d3cuZGV2aWduLm1lL2FuZ3VsYXItZG90LWpzLWNvZmZlZXNjcmlwdC1jb250cm9sbGVyLWJhc2UtY2xhc3NcbiNcbiMgVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgaXQ6XG4jXG4jIHNvbWVBcHBNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnc29tZUFwcCdcbiNcbiMgY2xhc3MgTXlBd2Vzb21lQ29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyXG4jICAgIyByZWdpc3RlciB0aGUgY29udHJvbGxlciBhdCBvdXIgbW9kdWxlXG4jICAgQHJlZ2lzdGVyIHNvbWVBcHBNb2R1bGVcbiMgICAjIGRlcGVuZGVuY2llcyB0byBpbmplY3QsIHdpbGwgYmUgYXZhaWxhYmxlIGFzIG1lbWJlciB2YXJpYWJsZSBlLmcuIEAkc2NvcGVcbiMgICBAaW5qZWN0ICckc2NvcGUnLCAnJGh0dHAnLCAnTXlTZXJ2aWNlJ1xuIyAgICMgY2FsbGVkIGFmdGVyIGluc3RhbnRpYXRpb24gaWYgZXhpc3RzXG4jICAgaW5pdGlhbGl6ZTogLT5cbiMgICAgICMgaW5pdCBzb21lIHN0dWZmIC4uLlxuIyAgIHN1Ym1pdDogLT5cbiMgICAgICMgYm91bmQgdG8gJHNjb3BlIGFuZCB1c2FibGUgaW4gdGVtcGxhdGUgYXV0b21hdGljYWxseVxuI1xuIyBUT0RPOiBBZGQgY2hlY2sgdG8gZW5zdXJlICRzY29wZSBhcyBkZXBlbmRlbmN5IHdoZW4gb25lIG9yIG1vcmUgZnVuY3Rpb25zIGFyZSBkZWZpbmVkIGFzIHRoZXkgYXJlIGJvdW5kIGF1dG9tYXRpY2FsbHlcbiNcbmNsYXNzIEBCYXNlQ29udHJvbGxlclxuICBAcmVnaXN0ZXI6IChhcHAsIG5hbWUpIC0+XG4gICAgbmFtZSA/PSBAbmFtZSB8fCBAdG9TdHJpbmcoKS5tYXRjaCgvZnVuY3Rpb25cXHMqKC4qPylcXCgvKT9bMV1cbiAgICBhcHAuY29udHJvbGxlciBuYW1lLCBAXG5cbiAgQGluamVjdDogKGFyZ3MuLi4pIC0+XG4gICAgQCRpbmplY3QgPSBhcmdzXG5cblxuICBjb25zdHJ1Y3RvcjogKGFyZ3MuLi4pIC0+XG4gICAgZm9yIGtleSwgaW5kZXggaW4gQGNvbnN0cnVjdG9yLiRpbmplY3RcbiAgICAgIEBba2V5XSA9IGFyZ3NbaW5kZXhdXG5cbiAgICBmb3Iga2V5LCBmbiBvZiBAY29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgICBjb250aW51ZSB1bmxlc3MgdHlwZW9mIGZuIGlzICdmdW5jdGlvbidcbiAgICAgIGNvbnRpbnVlIGlmIGtleSBpbiBbJ2NvbnN0cnVjdG9yJywgJ2luaXRpYWxpemUnXSBvciBrZXlbMF0gaXMgJ18nXG4gICAgICBAJHNjb3BlW2tleV0gPSBmbi5iaW5kPyhAKSB8fCBfLmJpbmQoZm4sIEApXG5cbiAgICBAaW5pdGlhbGl6ZT8oKSIsImFwcCA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsJ1xuXG5hcHAuZmFjdG9yeSAnVXNlcicsIFsnJGh0dHAnLCAoJGh0dHApIC0+XG4gIG5ldyBjbGFzcyBVc2VyXG4gICAgY29uc3RydWN0b3I6IC0+XG5cbiAgICBsb2dpbjogKHVzZXJuYW1lLCBwYXNzd29yZCkgLT5cbiAgICAgIHJlcXVlc3QgPSAkaHR0cC5wb3N0ICdodHRwczovL25hbWVsZXNzLXNjcnVibGFuZC00Nzg1Lmhlcm9rdWFwcC5jb20vdjEvc2Vzc2lvbi8nLCB7ZW1haWw6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQgfVxuICAgICAgcmV0dXJuIHJlcXVlc3Rcbl0iLCJsb2dpbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCduYXJ3aGFsLmxvZ2luJywgW10pXG5cbmxvZ2luTW9kdWxlLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpLT5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgLnN0YXRlKCdsb2dpbicsXG4gICAgdXJsOiAnL2xvZ2luLydcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xuICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInXG4gICkiLCJyZWN1cnJpbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbC5yZWN1cnJpbmcnLCBbXSlcblxucmVjdXJyaW5nTW9kdWxlLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpLT5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgLnN0YXRlKCdyZWN1cnJpbmcnLFxuICAgIHVybDogJy9yZWN1cnJpbmcvJ1xuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3JlY3VycmluZy5odG1sJ1xuICAgIGNvbnRyb2xsZXI6ICdSZWN1cnJpbmdDb250cm9sbGVyJ1xuICAgIHJlc29sdmU6XG4gICAgICBjdXJyZW50VHJhbnNhY3Rpb246IFsnJHJvb3RTY29wZScsICgkcm9vdFNjb3BlKS0+XG4gICAgICAgIHJldHVybiAkcm9vdFNjb3BlLmN1cnJlbnRUcmFuc2FjdGlvblxuICAgICAgXVxuICApIiwicmVwb3J0TW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25hcndoYWwucmVwb3J0JywgW10pXG5cbnJlcG9ydE1vZHVsZS5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKS0+XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSgncmVwb3J0JyxcbiAgICB1cmw6ICcvcmVwb3J0LydcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZXBvcnQuaHRtbCdcbiAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcidcbiAgKSIsImFwcCA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsJ1xuXG5jbGFzcyBJbmRleENvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuXG4gIEByZWdpc3RlciBhcHBcbiAgQGluamVjdCAnJHNjb3BlJywgJyRodHRwJywgJyRzdGF0ZScsICckcm9vdFNjb3BlJ1xuXG4gIGluaXRpYWxpemU6ICgpPT5cbiAgICBAJHNjb3BlLnRyYW5zYWN0aW9ucyA9IFtdXG4gICAgQGxvYWRUcmFuc2FjdGlvbnMoKVxuXG4gIGxvZ291dDogKCktPlxuICAgIEAkc3RhdGUuZ28gJ2xvZ2luJ1xuXG4gIHJlZnJlc2g6ICgpLT5cbiAgICBAbG9hZFRyYW5zYWN0aW9ucygpXG4gICAgQCRzY29wZS4kYnJvYWRjYXN0KCdzY3JvbGwucmVmcmVzaENvbXBsZXRlJylcbiAgICBzZXRUaW1lb3V0KE1pLm1vdGlvbi5mYWRlU2xpZGVJblJpZ2h0KHtcbiAgICAgIHNlbGVjdG9yOiAnLmFuaW1hdGUtZmFkZS1zbGlkZS1pbi1yaWdodCA+IConXG4gICAgfSksIDEwKVxuXG4gIGxvYWRUcmFuc2FjdGlvbnM6ICgpPT5cbiAgICBAJHNjb3BlLnRyYW5zYWN0aW9ucyA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ0FyYnlzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnQXUgQm9uIFBhaW4nXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0J1ZmZhbG8gV2lsZCBXaW5ncydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnQnVyZ2VyIEtpbmcnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0NhcmxzIEpyLidcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnRGFpcnkgUXVlZW4nXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0RvbWlub3MgUGl6emEnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0R1bmtpbiBEb251dHMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0hhcmRlZXMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0tGQydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnTGl0dGxlIENhZXNhcnMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0xvbmcgSm9obiBTaWx2ZXJzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdNY0NhZsOpJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdNY0RvbmFsZHMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ05hbmRvcydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnUGl6emEgSHV0J1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdSb3VuZCBUYWJsZSBQaXp6YSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnU29uaWMgRHJpdmUtSW4nXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1N0YXJidWNrcydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnU3Vid2F5J1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdUQ0JZJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdUaW0gSG9ydG9ucydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnVGFjbyBCZWxsJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXZW5keXMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1dlbmR5cyBTdXBhIFN1bmRhZXMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1doYXRhYnVyZ2VyJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXaGl0ZSBDYXN0bGUnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1dpbmdzdG9wJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ1dpbmdTdHJlZSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcbiAgICAgIH1cbiAgICBdXG5cbiAgZ2V0UmFuZG9tQW1vdW50OiAoKT0+XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMDApIC8gMTAwXG5cbiAgc2hvd1RyYW5zYWN0aW9uOiAodHJhbnNhY3Rpb24pLT5cbiAgICBAJHJvb3RTY29wZS5jdXJyZW50VHJhbnNhY3Rpb24gPSB0cmFuc2FjdGlvblxuICAgIEAkc3RhdGUuZ28oJ3JlY3VycmluZycpXG5cbiIsImxvZ2luTW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ25hcndoYWwubG9naW4nXG5cbmNsYXNzIExvZ2luQ29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyXG5cbiAgQHJlZ2lzdGVyIGxvZ2luTW9kdWxlXG4gIEBpbmplY3QgJyRzY29wZScsICckaHR0cCcsICckc3RhdGUnLCAnVXNlcidcblxuICBsb2dpbjogKCk9PlxuICAgIEAkc2NvcGUuaXNMb2FkaW5nID0gdHJ1ZVxuICAgIEBVc2VyLmxvZ2luKEAkc2NvcGUudXNlcm5hbWUsIEAkc2NvcGUucGFzc3dvcmQpLnRoZW4oICgpPT5cbiAgICAgIEAkc2NvcGUuaXNMb2FkaW5nID0gZmFsc2VcbiAgICAgIEAkc3RhdGUuZ28gJ2luZGV4J1xuICAgIClcblxuICBpbml0aWFsaXplOiAoKT0+XG4gICAgQCRzY29wZS51c2VybmFtZSA9ICcnXG4gICAgQCRzY29wZS5wYXNzd29yZCA9ICcnXG5cbiIsImFuZ3VsYXIubW9kdWxlKCduYXJ3aGFsLmxvZ2luJykuZGlyZWN0aXZlICdpb25NZElucHV0JywgLT5cbiAge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICByZXBsYWNlOiB0cnVlXG4gICAgcmVxdWlyZTogJz9uZ01vZGVsJ1xuICAgIHRlbXBsYXRlOiAnPGxhYmVsIGNsYXNzPVwiaXRlbSBpdGVtLWlucHV0IGl0ZW0tbWQtbGFiZWxcIj4nICsgJzxpbnB1dCB0eXBlPVwidGV4dFwiPicgKyAnPHNwYW4gY2xhc3M9XCJpbnB1dC1sYWJlbFwiPjwvc3Bhbj4nICsgJzxkaXYgY2xhc3M9XCJoaWdobGlnaHRcIj48L2Rpdj4nICsgJzwvbGFiZWw+J1xuICAgIGNvbXBpbGU6IChlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgaGlnaGxpZ2h0ID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcuaGlnaGxpZ2h0JylcbiAgICAgIGhpZ2hsaWdodENvbG9yID0gdW5kZWZpbmVkXG4gICAgICBpZiAhYXR0ci5oaWdobGlnaHRDb2xvclxuICAgICAgICBoaWdobGlnaHRDb2xvciA9ICdjYWxtJ1xuICAgICAgZWxzZVxuICAgICAgICBoaWdobGlnaHRDb2xvciA9IGF0dHIuaGlnaGxpZ2h0Q29sb3JcbiAgICAgIGhpZ2hsaWdodC5jbGFzc05hbWUgKz0gJyBoaWdobGlnaHQtJyArIGhpZ2hsaWdodENvbG9yXG4gICAgICBsYWJlbCA9IGVsZW1lbnQuZmluZCgnc3BhbicpXG4gICAgICBsYWJlbC5odG1sIGF0dHIucGxhY2Vob2xkZXJcbiAgICAgIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpXG4gICAgICBpbnB1dC5iaW5kICdibHVyJywgLT5cbiAgICAgICAgY29uc29sZS5sb2cgJ2JsdXInXG4gICAgICAgIGlmIGlucHV0LnZhbCgpXG4gICAgICAgICAgaW5wdXQuYWRkQ2xhc3MgJ3VzZWQnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpbnB1dC5yZW1vdmVDbGFzcyAndXNlZCdcbiAgICAgICAgcmV0dXJuXG4gICAgICBhbmd1bGFyLmZvckVhY2gge1xuICAgICAgICAnbmFtZSc6IGF0dHIubmFtZVxuICAgICAgICAndHlwZSc6IGF0dHIudHlwZVxuICAgICAgICAnbmctdmFsdWUnOiBhdHRyLm5nVmFsdWVcbiAgICAgICAgJ25nLW1vZGVsJzogYXR0ci5uZ01vZGVsXG4gICAgICAgICdyZXF1aXJlZCc6IGF0dHIucmVxdWlyZWRcbiAgICAgICAgJ25nLXJlcXVpcmVkJzogYXR0ci5uZ1JlcXVpcmVkXG4gICAgICAgICduZy1taW5sZW5ndGgnOiBhdHRyLm5nTWlubGVuZ3RoXG4gICAgICAgICduZy1tYXhsZW5ndGgnOiBhdHRyLm5nTWF4bGVuZ3RoXG4gICAgICAgICduZy1wYXR0ZXJuJzogYXR0ci5uZ1BhdHRlcm5cbiAgICAgICAgJ25nLWNoYW5nZSc6IGF0dHIubmdDaGFuZ2VcbiAgICAgICAgJ25nLXRyaW0nOiBhdHRyLnRyaW1cbiAgICAgICAgJ25nLWJsdXInOiBhdHRyLm5nQmx1clxuICAgICAgICAnbmctZm9jdXMnOiBhdHRyLm5nRm9jdXNcbiAgICAgIH0sICh2YWx1ZSwgbmFtZSkgLT5cbiAgICAgICAgaWYgYW5ndWxhci5pc0RlZmluZWQodmFsdWUpXG4gICAgICAgICAgaW5wdXQuYXR0ciBuYW1lLCB2YWx1ZVxuICAgICAgICByZXR1cm5cblxuICAgICAgY2xlYW5VcCA9IC0+XG4gICAgICAgIGlvbmljLm9mZiAnJGRlc3Ryb3knLCBjbGVhblVwLCBlbGVtZW50WzBdXG4gICAgICAgIHJldHVyblxuXG4gICAgICBpb25pYy5vbiAnJGRlc3Ryb3knLCBjbGVhblVwLCBlbGVtZW50WzBdXG4gICAgICByZXR1cm5cblxuICB9XG4iLCJyZWN1cnJpbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbC5yZWN1cnJpbmcnXG5cbmNsYXNzIFJlY3VycmluZ0NvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuXG4gIEByZWdpc3RlciByZWN1cnJpbmdNb2R1bGVcbiAgQGluamVjdCAnJHNjb3BlJywgJyRodHRwJywgJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnY3VycmVudFRyYW5zYWN0aW9uJ1xuXG4gIGluaXRpYWxpemU6ICgpLT5cbiAgICBAJHNjb3BlLmhlbGxvID0gXCJXb3JsZFwiXG4gICAgQCRzY29wZS50cmFuc2FjdGlvbiA9IEBjdXJyZW50VHJhbnNhY3Rpb25cbiAgICBNaS5tb3Rpb24uc2xpZGVVcCh7XG4gICAgICBzZWxlY3RvcjogJy5zbGlkZS11cCdcbiAgICB9KVxuXG4iLCJyZXBvcnRNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbC5yZXBvcnQnXG5cbmNsYXNzIFJlcG9ydENvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuXG4gIEByZWdpc3RlciByZXBvcnRNb2R1bGVcbiAgQGluamVjdCAnJHNjb3BlJ1xuXG4gIGluaXRpYWxpemU6ICgpLT5cbiAgICBAJHNjb3BlLnJlcG9ydHMgPSBbe1xuICAgICAgbmFtZTonTXlSZXBvcnQnXG4gICAgfV1cbiAgICBzZXRUaW1lb3V0KCAoKS0+XG4gICAgICBNaS5tb3Rpb24uYmxpbmRzRG93bih7IHNlbGVjdG9yOiAnLmNhcmQnfSlcbiAgICAsIDUwMClcbiIsIi8vIEV4dGVuZCBuYW1lc3BhY2UgaWYgbWkgaXMgYWxyZWFkeSBkZWZpbmVkXG52YXIgTWkgPSBNaSB8fCB7fTtcblxuXG4vLyBNaSBsaWJyYXJ5IHJldHVybmVkIGZyb20gY2xvc3VyZVxuTWkgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIC8qIExpYnJhcnkgQ29uc3RhbnRzIChFWFBPUlQpXG4gICAgLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgdmFyIHZlcnNpb24gPSAnMC4wLjEnO1xuXG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIC8qIEhFTFBFUlMgKG5vbi1leHBvcnRzKVxuICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSpcbiAgICAvICAgQWJzdHJhY3QgY29tbW9uIGxvb2t1cHMgYW5kIG1hbmlwdWxhdGlvbnMgaW4gY2FzZSBiZXR0ZXIgYWx0ZXJuYXRpdmVzXG4gICAgLyAgIGFyaXNlIG9yIGZ1dHVyZSBjcm9zcy1wbGF0Zm9ybSBkaWZmZXJlbmNlcyB3YXJyYW50IHNlcGFyYXRlIGhhbmRsaW5nXG4gICAgLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuICAgIGZ1bmN0aW9uIGdldFZpZXdwb3J0SGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChkb21Ob2RlKSB7XG4gICAgICAgIHJldHVybiBkb21Ob2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdDtcbiAgICB9XG5cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgLyogTU9USU9OIChFWFBPUlQpXG4gICAgLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09KlxuICAgIC8gICBBbmltYXRpb24gbWV0aG9kcyBmb3IgdGhlIGxpYnJhcnlcbiAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgLy8gSG9pc3RpbmcgdGhlIGFuaW1hdGlvbiBmdW5jdGlvbnMgaW50byBvdXIgbW90aW9uIG9iamVjdFxuICAgIHZhciBtb3Rpb24gPSB7XG4gICAgICAgIGJsaW5kc0Rvd246IGJsaW5kc0Rvd24sXG4gICAgICAgIGZhZGVTbGlkZUluOiBmYWRlU2xpZGVJbixcbiAgICAgICAgZmFkZVNsaWRlSW5SaWdodDogZmFkZVNsaWRlSW5SaWdodCxcbiAgICAgICAgcGFuSW5MZWZ0OiBwYW5JbkxlZnQsXG4gICAgICAgIHB1c2hEb3duOiBwdXNoRG93bixcbiAgICAgICAgc2xpZGVVcDogc2xpZGVVcFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBibGluZHNEb3duKG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBEZWNsYXJlIG91ciBkZWZhdWx0c1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBmaW5pc2hEZWxheVRocm90dGxlOiAyLFxuICAgICAgICAgICAgZmluaXNoU3BlZWRQZXJjZW50OiAwLjUsXG4gICAgICAgICAgICBsZWZ0T2Zmc2V0UGVyY2VudGFnZTogMC44LFxuICAgICAgICAgICAgc3RhcnRWZWxvY2l0eTogMTEwMFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFwcGx5IGRlZmF1bHRzIGlmIHByb3BlcnRpZXMgYXJlIG5vdCBwYXNzZWRcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlID0gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlIHx8IGRlZmF1bHRzLmZpbmlzaERlbGF5VGhyb3R0bGU7XG4gICAgICAgIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50ID0gb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgfHwgZGVmYXVsdHMuZmluaXNoU3BlZWRQZXJjZW50O1xuICAgICAgICBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlID0gb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSB8fCBkZWZhdWx0cy5sZWZ0T2Zmc2V0UGVyY2VudGFnZTtcbiAgICAgICAgb3B0aW9ucy5zdGFydFZlbG9jaXR5ID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5IHx8IGRlZmF1bHRzLnN0YXJ0VmVsb2NpdHk7XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBibGluZHNEb3duIHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZUJsaW5kc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBlbGVtZW50QW5pbWF0aW9uQ291bnQgPSAwO1xuXG4gICAgICAgIC8vIENvdW50IHRoZSBlbGVtZW50cyB3aXRoaW4gdGhlIHN0YXJ0aW5nIHZpZXdwb3J0IHNvIHdlJ3JlIG5vdCBleGFjdGluZ1xuICAgICAgICAvLyBtb3JlIGVmZm9ydCB0aGFuIHJlcXVpcmVkLi4uXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIHVzZSBjc3MgdmlzaWJsaXR5OiBoaWRkZW4gaW5zdGVhZCBvZiBkaXNwbGF5OiBub25lIHNvIHRoZSBlbGVtZW50c1xuICAgICAgICAvLyBtYWludGFpbiB0aGVpciBET00gZmxvd1xuXG4gICAgICAgIHZhciB2aWV3cG9ydEhlaWdodCA9IGdldFZpZXdwb3J0SGVpZ2h0KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5pbWF0ZUJsaW5kc0RvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuaW1hdGVCbGluZHNEb21baV0ub2Zmc2V0VG9wIDwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50QW5pbWF0aW9uQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VxdWVudGlhbGx5IGFuaW1hdGUgd2l0aCBhIGRlbGF5IGJhc2VkIG9uIHByb3hpbWl0eVxuICAgICAgICB2YXIgc3BlZWQgPSBvcHRpb25zLnN0YXJ0VmVsb2NpdHk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGFuaW1hdGVCbGluZHNEb21baV07XG4gICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQob2Zmc2V0IC8gc3BlZWQpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS53ZWJraXRUcmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTmFtZSArPSAnIGluJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdoZW4gd2UncmUgZG9uZSBhbmltYXRpbmcsIHN3aXRjaCB0aGUgY2xhc3MgdG8gJ2RvbmUnXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZUJsaW5kc0RvbVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChvZmZzZXQgLyBzcGVlZCAvIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICBjaGlsZC5xdWVyeVNlbGVjdG9yKCdpbWcnKS5zdHlsZS53ZWJraXRUcmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgICAgIGNoaWxkLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICAgICAgLy9jaGlsZC5xdWVyeVNlbGVjdG9yKCdpbWcnKS5jbGFzc05hbWUgKz0gJyBpbic7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZUJsaW5kc0RvbVtpXS5wYXJlbnROb2RlLmNsYXNzTmFtZSArPSAnIGRvbmUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIHNwZWVkICogb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZhZGVTbGlkZUluKG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBEZWNsYXJlIG91ciBkZWZhdWx0c1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBmaW5pc2hEZWxheVRocm90dGxlOiAyLFxuICAgICAgICAgICAgZmluaXNoU3BlZWRQZXJjZW50OiAwLjcyLFxuICAgICAgICAgICAgbGVmdE9mZnNldFBlcmNlbnRhZ2U6IDAuOCxcbiAgICAgICAgICAgIHN0YXJ0VmVsb2NpdHk6IDExMDBcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBcHBseSBkZWZhdWx0cyBpZiBwcm9wZXJ0aWVzIGFyZSBub3QgcGFzc2VkXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSA9IG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSB8fCBkZWZhdWx0cy5maW5pc2hEZWxheVRocm90dGxlO1xuICAgICAgICBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCA9IG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50IHx8IGRlZmF1bHRzLmZpbmlzaFNwZWVkUGVyY2VudDtcbiAgICAgICAgb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSA9IG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgfHwgZGVmYXVsdHMubGVmdE9mZnNldFBlcmNlbnRhZ2U7XG4gICAgICAgIG9wdGlvbnMuc3RhcnRWZWxvY2l0eSA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eSB8fCBkZWZhdWx0cy5zdGFydFZlbG9jaXR5O1xuXG4gICAgICAgIC8vIEZhaWwgZWFybHkgJiBzaWxlbnRseSBsb2dcbiAgICAgICAgdmFyIGlzSW52YWxpZFNlbGVjdG9yID0gdHlwZW9mIG9wdGlvbnMuc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuc2VsZWN0b3IgPT09ICcnO1xuXG4gICAgICAgIGlmIChpc0ludmFsaWRTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgZmFkZVNsaWRlSW4gc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlRmFkZVNsaWRlSW5Eb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gMDtcblxuICAgICAgICAvLyBDb3VudCB0aGUgZWxlbWVudHMgd2l0aGluIHRoZSBzdGFydGluZyB2aWV3cG9ydCBzbyB3ZSdyZSBub3QgZXhhY3RpbmdcbiAgICAgICAgLy8gbW9yZSBlZmZvcnQgdGhhbiByZXF1aXJlZC4uLlxuICAgICAgICAvL1xuICAgICAgICAvLyBXZSB1c2UgY3NzIHZpc2libGl0eTogaGlkZGVuIGluc3RlYWQgb2YgZGlzcGxheTogbm9uZSBzbyB0aGUgZWxlbWVudHNcbiAgICAgICAgLy8gbWFpbnRhaW4gdGhlaXIgRE9NIGZsb3dcblxuICAgICAgICB2YXIgdmlld3BvcnRIZWlnaHQgPSBnZXRWaWV3cG9ydEhlaWdodCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuaW1hdGVGYWRlU2xpZGVJbkRvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuaW1hdGVGYWRlU2xpZGVJbkRvbVtpXS5vZmZzZXRUb3AgPCB2aWV3cG9ydEhlaWdodCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRBbmltYXRpb25Db3VudCArPSAxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXF1ZW50aWFsbHkgYW5pbWF0ZSB3aXRoIGEgZGVsYXkgYmFzZWQgb24gcHJveGltaXR5XG4gICAgICAgIHZhciBzcGVlZCA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZUZhZGVTbGlkZUluRG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNoaWxkT2Zmc2V0ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KG9mZnNldCAvIHNwZWVkKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUud2Via2l0VHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5jbGFzc05hbWUgKz0gJyBpbic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXaGVuIHdlJ3JlIGRvbmUgYW5pbWF0aW5nLCBzd2l0Y2ggdGhlIGNsYXNzIHRvICdkb25lJ1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGFuaW1hdGVGYWRlU2xpZGVJbkRvbVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGF5VmFsdWUgPSBvZmZzZXQgLyBzcGVlZCAvIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZTtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KGRlbGF5VmFsdWUpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgLy9hbmltYXRlRmFkZVNsaWRlSW5Eb21bMF0uY2xhc3NOYW1lICs9ICcgZG9uZSc7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZUZhZGVTbGlkZUluRG9tW2ldLmNsYXNzTmFtZSArPSAnIGRvbmUnO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgc3BlZWQgKiBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmFkZVNsaWRlSW5SaWdodChvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gRGVjbGFyZSBvdXIgZGVmYXVsdHNcbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgZmluaXNoRGVsYXlUaHJvdHRsZTogMixcbiAgICAgICAgICAgIGZpbmlzaFNwZWVkUGVyY2VudDogMC43MixcbiAgICAgICAgICAgIGxlZnRPZmZzZXRQZXJjZW50YWdlOiAwLjgsXG4gICAgICAgICAgICBzdGFydFZlbG9jaXR5OiAxMTAwXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQXBwbHkgZGVmYXVsdHMgaWYgcHJvcGVydGllcyBhcmUgbm90IHBhc3NlZFxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgPSBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgfHwgZGVmYXVsdHMuZmluaXNoRGVsYXlUaHJvdHRsZTtcbiAgICAgICAgb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgPSBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCB8fCBkZWZhdWx0cy5maW5pc2hTcGVlZFBlcmNlbnQ7XG4gICAgICAgIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgPSBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlIHx8IGRlZmF1bHRzLmxlZnRPZmZzZXRQZXJjZW50YWdlO1xuICAgICAgICBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgPSBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgfHwgZGVmYXVsdHMuc3RhcnRWZWxvY2l0eTtcblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGZhZGVTbGlkZUluUmlnaHQgc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlU2xpZGVJblJpZ2h0RG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IDA7XG5cbiAgICAgICAgLy8gQ291bnQgdGhlIGVsZW1lbnRzIHdpdGhpbiB0aGUgc3RhcnRpbmcgdmlld3BvcnQgc28gd2UncmUgbm90XG4gICAgICAgIC8vIGV4YWN0aW5nIG1vcmUgZWZmb3J0IHRoYW4gcmVxdWlyZWQuLi5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgdXNlIGNzcyB2aXNpYmxpdHk6IGhpZGRlbiBpbnN0ZWFkIG9mIGRpc3BsYXk6IG5vbmUgc28gdGhlXG4gICAgICAgIC8vIGVsZW1lbnRzIG1haW50YWluIHRoZWlyIERPTSBmbG93XG5cbiAgICAgICAgdmFyIHZpZXdwb3J0SGVpZ2h0ID0gZ2V0Vmlld3BvcnRIZWlnaHQoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbmltYXRlU2xpZGVJblJpZ2h0RG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5pbWF0ZVNsaWRlSW5SaWdodERvbVtpXS5vZmZzZXRUb3AgPCB2aWV3cG9ydEhlaWdodCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRBbmltYXRpb25Db3VudCArPSAxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXF1ZW50aWFsbHkgYW5pbWF0ZSB3aXRoIGEgZGVsYXkgYmFzZWQgb24gcHJveGltaXR5XG4gICAgICAgIHZhciBzcGVlZCA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZVNsaWRlSW5SaWdodERvbVtpXTtcbiAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNoaWxkT2Zmc2V0LmxlZnQgKiBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlICsgY2hpbGRPZmZzZXQudG9wO1xuICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChvZmZzZXQgLyBzcGVlZCkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLndlYmtpdFRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuY2xhc3NOYW1lICs9ICcgaW4nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2hlbiB3ZSdyZSBkb25lIGFuaW1hdGluZywgc3dpdGNoIHRoZSBjbGFzcyB0byAnZG9uZSdcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlU2xpZGVJblJpZ2h0RG9tW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXlWYWx1ZSA9IG9mZnNldCAvIHNwZWVkIC8gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlO1xuICAgICAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQoZGVsYXlWYWx1ZSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuaW1hdGVTbGlkZUluUmlnaHREb20uaXRlbSgwKS5wYXJlbnROb2RlLmNsYXNzTmFtZSArPSAnIGRvbmUnO1xuXG4gICAgICAgIH0sIHNwZWVkICogb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhbkluTGVmdChvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSBhIHNpbmdsZSBvcHRpb24sIHNvIGl0IG1heSBiZSBwYXNzZWQgYXMgYSBzdHJpbmcgb3IgcHJvcGVydHlcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcjogb3B0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZhaWwgZWFybHkgJiBzaWxlbnRseSBsb2dcbiAgICAgICAgdmFyIGlzSW52YWxpZFNlbGVjdG9yID0gdHlwZW9mIG9wdGlvbnMuc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuc2VsZWN0b3IgPT09ICcnO1xuXG4gICAgICAgIGlmIChpc0ludmFsaWRTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgcHVzaERvd24gc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlUGFuSW5MZWZ0RG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IGFuaW1hdGVQYW5JbkxlZnREb20ubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGFuaW1hdGVQYW5JbkxlZnREb21baV07XG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lVG9SZW1vdmUgPSAnYW5pbWF0ZS1wYW4taW4tbGVmdCc7XG4gICAgICAgICAgICB2YXIgaW5kZXhPZkNsYXNzTmFtZVRvUmVtb3ZlID0gZWxlbWVudC5jbGFzc05hbWUubGFzdEluZGV4T2YoY2xhc3NOYW1lVG9SZW1vdmUpO1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5zdWJzdHIoMCwgaW5kZXhPZkNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHB1c2hEb3duKG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBXZSBoYXZlIGEgc2luZ2xlIG9wdGlvbiwgc28gaXQgbWF5IGJlIHBhc3NlZCBhcyBhIHN0cmluZyBvciBwcm9wZXJ0eVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBvcHRpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBwdXNoRG93biBzZWxlY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1hdGVQdXNoRG93bkRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBlbGVtZW50QW5pbWF0aW9uQ291bnQgPSBhbmltYXRlUHVzaERvd25Eb20ubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGFuaW1hdGVQdXNoRG93bkRvbVtpXTtcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWVUb1JlbW92ZSA9IG9wdGlvbnMuc2VsZWN0b3Iuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIHZhciBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUgPSBlbGVtZW50LmNsYXNzTmFtZS5sYXN0SW5kZXhPZihjbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnN1YnN0cigwLCBpbmRleE9mQ2xhc3NOYW1lVG9SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2xpZGVVcChvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSBhIHNpbmdsZSBvcHRpb24sIHNvIGl0IG1heSBiZSBwYXNzZWQgYXMgYSBzdHJpbmcgb3IgcHJvcGVydHlcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcjogb3B0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZhaWwgZWFybHkgJiBzaWxlbnRseSBsb2dcbiAgICAgICAgdmFyIGlzSW52YWxpZFNlbGVjdG9yID0gdHlwZW9mIG9wdGlvbnMuc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuc2VsZWN0b3IgPT09ICcnO1xuXG4gICAgICAgIGlmIChpc0ludmFsaWRTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgcHVzaERvd24gc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlU2xpZGVVcERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBlbGVtZW50QW5pbWF0aW9uQ291bnQgPSBhbmltYXRlU2xpZGVVcERvbS5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gYW5pbWF0ZVNsaWRlVXBEb21baV07XG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lVG9SZW1vdmUgPSBvcHRpb25zLnNlbGVjdG9yLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICB2YXIgaW5kZXhPZkNsYXNzTmFtZVRvUmVtb3ZlID0gZWxlbWVudC5jbGFzc05hbWUubGFzdEluZGV4T2YoY2xhc3NOYW1lVG9SZW1vdmUpO1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5zdWJzdHIoMCwgaW5kZXhPZkNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qIEV4cG9ydCBvYmplY3RcbiAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbW90aW9uOiBtb3Rpb24sXG4gICAgICAgIHZlcnNpb246IHZlcnNpb25cbiAgICB9XG5cbn0pKCk7XG4iLCIvKiFcbiAqIFdhdmVzIHYwLjYuM1xuICogaHR0cDovL2ZpYW4ubXkuaWQvV2F2ZXMgXG4gKiBcbiAqIENvcHlyaWdodCAyMDE0IEFsZmlhbmEgRS4gU2lidWVhIGFuZCBvdGhlciBjb250cmlidXRvcnMgXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmlhbnMvV2F2ZXMvYmxvYi9tYXN0ZXIvTElDRU5TRSBcbiAqL1xuXG47KGZ1bmN0aW9uKHdpbmRvdykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBXYXZlcyA9IFdhdmVzIHx8IHt9O1xuICAgIHZhciAkJCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwuYmluZChkb2N1bWVudCk7XG5cbiAgICAvLyBGaW5kIGV4YWN0IHBvc2l0aW9uIG9mIGVsZW1lbnRcbiAgICBmdW5jdGlvbiBpc1dpbmRvdyhvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiBvYmogPT09IG9iai53aW5kb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0V2luZG93KGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGlzV2luZG93KGVsZW0pID8gZWxlbSA6IGVsZW0ubm9kZVR5cGUgPT09IDkgJiYgZWxlbS5kZWZhdWx0VmlldztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvZmZzZXQoZWxlbSkge1xuICAgICAgICB2YXIgZG9jRWxlbSwgd2luLFxuICAgICAgICAgICAgYm94ID0ge3RvcDogMCwgbGVmdDogMH0sXG4gICAgICAgICAgICBkb2MgPSBlbGVtICYmIGVsZW0ub3duZXJEb2N1bWVudDtcblxuICAgICAgICBkb2NFbGVtID0gZG9jLmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICBpZiAodHlwZW9mIGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICE9PSB0eXBlb2YgdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBib3ggPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIHdpbiA9IGdldFdpbmRvdyhkb2MpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBib3gudG9wICsgd2luLnBhZ2VZT2Zmc2V0IC0gZG9jRWxlbS5jbGllbnRUb3AsXG4gICAgICAgICAgICBsZWZ0OiBib3gubGVmdCArIHdpbi5wYWdlWE9mZnNldCAtIGRvY0VsZW0uY2xpZW50TGVmdFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnZlcnRTdHlsZShvYmopIHtcbiAgICAgICAgdmFyIHN0eWxlID0gJyc7XG5cbiAgICAgICAgZm9yICh2YXIgYSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoYSkpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSAoYSArICc6JyArIG9ialthXSArICc7Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgfVxuXG4gICAgdmFyIEVmZmVjdCA9IHtcblxuICAgICAgICAvLyBFZmZlY3QgZGVsYXlcbiAgICAgICAgZHVyYXRpb246IDc1MCxcblxuICAgICAgICBzaG93OiBmdW5jdGlvbihlLCBlbGVtZW50KSB7XG5cbiAgICAgICAgICAgIC8vIERpc2FibGUgcmlnaHQgY2xpY2tcbiAgICAgICAgICAgIGlmIChlLmJ1dHRvbiA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVsID0gZWxlbWVudCB8fCB0aGlzO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgcmlwcGxlXG4gICAgICAgICAgICB2YXIgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByaXBwbGUuY2xhc3NOYW1lID0gJ3dhdmVzLXJpcHBsZSc7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChyaXBwbGUpO1xuXG4gICAgICAgICAgICAvLyBHZXQgY2xpY2sgY29vcmRpbmF0ZSBhbmQgZWxlbWVudCB3aXRkaFxuICAgICAgICAgICAgdmFyIHBvcyAgICAgICAgID0gb2Zmc2V0KGVsKTtcbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVkgICA9IChlLnBhZ2VZIC0gcG9zLnRvcCk7XG4gICAgICAgICAgICB2YXIgcmVsYXRpdmVYICAgPSAoZS5wYWdlWCAtIHBvcy5sZWZ0KTtcbiAgICAgICAgICAgIHZhciBzY2FsZSAgICAgICA9ICdzY2FsZSgnKygoZWwuY2xpZW50V2lkdGggLyAxMDApICogMykrJyknO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBTdXBwb3J0IGZvciB0b3VjaCBkZXZpY2VzXG4gICAgICAgICAgICBpZiAoJ3RvdWNoZXMnIGluIGUpIHtcbiAgICAgICAgICAgICAgcmVsYXRpdmVZICAgPSAoZS50b3VjaGVzWzBdLnBhZ2VZIC0gcG9zLnRvcCk7XG4gICAgICAgICAgICAgIHJlbGF0aXZlWCAgID0gKGUudG91Y2hlc1swXS5wYWdlWCAtIHBvcy5sZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQXR0YWNoIGRhdGEgdG8gZWxlbWVudFxuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJywgRGF0ZS5ub3coKSk7XG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdkYXRhLXNjYWxlJywgc2NhbGUpO1xuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnZGF0YS14JywgcmVsYXRpdmVYKTtcbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEteScsIHJlbGF0aXZlWSk7XG5cbiAgICAgICAgICAgIC8vIFNldCByaXBwbGUgcG9zaXRpb25cbiAgICAgICAgICAgIHZhciByaXBwbGVTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAndG9wJzogcmVsYXRpdmVZKydweCcsXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiByZWxhdGl2ZVgrJ3B4J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmlwcGxlLmNsYXNzTmFtZSA9IHJpcHBsZS5jbGFzc05hbWUgKyAnIHdhdmVzLW5vdHJhbnNpdGlvbic7XG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGNvbnZlcnRTdHlsZShyaXBwbGVTdHlsZSkpO1xuICAgICAgICAgICAgcmlwcGxlLmNsYXNzTmFtZSA9IHJpcHBsZS5jbGFzc05hbWUucmVwbGFjZSgnd2F2ZXMtbm90cmFuc2l0aW9uJywgJycpO1xuXG4gICAgICAgICAgICAvLyBTY2FsZSB0aGUgcmlwcGxlXG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0nXSA9IHNjYWxlO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy1tb3otdHJhbnNmb3JtJ10gPSBzY2FsZTtcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctbXMtdHJhbnNmb3JtJ10gPSBzY2FsZTtcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctby10cmFuc2Zvcm0nXSA9IHNjYWxlO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGUudHJhbnNmb3JtID0gc2NhbGU7XG4gICAgICAgICAgICByaXBwbGVTdHlsZS5vcGFjaXR5ICAgPSAnMSc7XG5cbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctd2Via2l0LXRyYW5zaXRpb24tZHVyYXRpb24nXSA9IEVmZmVjdC5kdXJhdGlvbiArICdtcyc7XG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLW1vei10cmFuc2l0aW9uLWR1cmF0aW9uJ10gICAgPSBFZmZlY3QuZHVyYXRpb24gKyAnbXMnO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy1vLXRyYW5zaXRpb24tZHVyYXRpb24nXSAgICAgID0gRWZmZWN0LmR1cmF0aW9uICsgJ21zJztcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyd0cmFuc2l0aW9uLWR1cmF0aW9uJ10gICAgICAgICA9IEVmZmVjdC5kdXJhdGlvbiArICdtcyc7XG5cbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgY29udmVydFN0eWxlKHJpcHBsZVN0eWxlKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGlkZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgVG91Y2hIYW5kbGVyLnRvdWNodXAoZSk7XG5cbiAgICAgICAgICAgIHZhciBlbCA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSBlbC5jbGllbnRXaWR0aCAqIDEuNDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR2V0IGZpcnN0IHJpcHBsZVxuICAgICAgICAgICAgdmFyIHJpcHBsZSA9IG51bGw7XG4gICAgICAgICAgICB2YXIgcmlwcGxlcyA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dhdmVzLXJpcHBsZScpO1xuICAgICAgICAgICAgaWYgKHJpcHBsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJpcHBsZSA9IHJpcHBsZXNbcmlwcGxlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVsYXRpdmVYICAgPSByaXBwbGUuZ2V0QXR0cmlidXRlKCdkYXRhLXgnKTtcbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVkgICA9IHJpcHBsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpO1xuICAgICAgICAgICAgdmFyIHNjYWxlICAgICAgID0gcmlwcGxlLmdldEF0dHJpYnV0ZSgnZGF0YS1zY2FsZScpO1xuXG4gICAgICAgICAgICAvLyBHZXQgZGVsYXkgYmVldHdlZW4gbW91c2Vkb3duIGFuZCBtb3VzZSBsZWF2ZVxuICAgICAgICAgICAgdmFyIGRpZmYgPSBEYXRlLm5vdygpIC0gTnVtYmVyKHJpcHBsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcpKTtcbiAgICAgICAgICAgIHZhciBkZWxheSA9IDM1MCAtIGRpZmY7XG5cbiAgICAgICAgICAgIGlmIChkZWxheSA8IDApIHtcbiAgICAgICAgICAgICAgICBkZWxheSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZhZGUgb3V0IHJpcHBsZSBhZnRlciBkZWxheVxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICd0b3AnOiByZWxhdGl2ZVkrJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiByZWxhdGl2ZVgrJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgJ29wYWNpdHknOiAnMCcsXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNpdGlvbi1kdXJhdGlvbic6IEVmZmVjdC5kdXJhdGlvbiArICdtcycsXG4gICAgICAgICAgICAgICAgICAgICctbW96LXRyYW5zaXRpb24tZHVyYXRpb24nOiBFZmZlY3QuZHVyYXRpb24gKyAnbXMnLFxuICAgICAgICAgICAgICAgICAgICAnLW8tdHJhbnNpdGlvbi1kdXJhdGlvbic6IEVmZmVjdC5kdXJhdGlvbiArICdtcycsXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uLWR1cmF0aW9uJzogRWZmZWN0LmR1cmF0aW9uICsgJ21zJyxcbiAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICctbW96LXRyYW5zZm9ybSc6IHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAnLW1zLXRyYW5zZm9ybSc6IHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAnLW8tdHJhbnNmb3JtJzogc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nOiBzY2FsZSxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBjb252ZXJ0U3R5bGUoc3R5bGUpKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChyaXBwbGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIEVmZmVjdC5kdXJhdGlvbik7XG4gICAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gTGl0dGxlIGhhY2sgdG8gbWFrZSA8aW5wdXQ+IGNhbiBwZXJmb3JtIHdhdmVzIGVmZmVjdFxuICAgICAgICB3cmFwSW5wdXQ6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGVsZW1lbnRzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsID0gZWxlbWVudHNbYV07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnB1dCBhbHJlYWR5IGhhdmUgcGFyZW50IGp1c3QgcGFzcyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaScgJiYgcGFyZW50LmNsYXNzTmFtZS5pbmRleE9mKCd3YXZlcy1lZmZlY3QnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUHV0IGVsZW1lbnQgY2xhc3MgYW5kIHN0eWxlIHRvIHRoZSBzcGVjaWZpZWQgcGFyZW50XG4gICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZSArICcgd2F2ZXMtaW5wdXQtd3JhcHBlcic7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRTdHlsZSA9IGVsLmdldEF0dHJpYnV0ZSgnc3R5bGUnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnRTdHlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFN0eWxlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBlbGVtZW50U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gJ3dhdmVzLWJ1dHRvbi1pbnB1dCc7XG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBQdXQgZWxlbWVudCBhcyBjaGlsZFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKHdyYXBwZXIsIGVsKTtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogRGlzYWJsZSBtb3VzZWRvd24gZXZlbnQgZm9yIDUwMG1zIGR1cmluZyBhbmQgYWZ0ZXIgdG91Y2hcbiAgICAgKi9cbiAgICB2YXIgVG91Y2hIYW5kbGVyID0ge1xuICAgICAgICAvKiB1c2VzIGFuIGludGVnZXIgcmF0aGVyIHRoYW4gYm9vbCBzbyB0aGVyZSdzIG5vIGlzc3VlcyB3aXRoXG4gICAgICAgICAqIG5lZWRpbmcgdG8gY2xlYXIgdGltZW91dHMgaWYgYW5vdGhlciB0b3VjaCBldmVudCBvY2N1cnJlZFxuICAgICAgICAgKiB3aXRoaW4gdGhlIDUwMG1zLiBDYW5ub3QgbW91c2V1cCBiZXR3ZWVuIHRvdWNoc3RhcnQgYW5kXG4gICAgICAgICAqIHRvdWNoZW5kLCBub3IgaW4gdGhlIDUwMG1zIGFmdGVyIHRvdWNoZW5kLiAqL1xuICAgICAgICB0b3VjaGVzOiAwLFxuICAgICAgICBhbGxvd0V2ZW50OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgYWxsb3cgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoZS50eXBlID09PSAndG91Y2hzdGFydCcpIHtcbiAgICAgICAgICAgICAgICBUb3VjaEhhbmRsZXIudG91Y2hlcyArPSAxOyAvL3B1c2hcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS50eXBlID09PSAndG91Y2hlbmQnIHx8IGUudHlwZSA9PT0gJ3RvdWNoY2FuY2VsJykge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChUb3VjaEhhbmRsZXIudG91Y2hlcyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvdWNoSGFuZGxlci50b3VjaGVzIC09IDE7IC8vcG9wIGFmdGVyIDUwMG1zXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICdtb3VzZWRvd24nICYmIFRvdWNoSGFuZGxlci50b3VjaGVzID4gMCkge1xuICAgICAgICAgICAgICAgIGFsbG93ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhbGxvdztcbiAgICAgICAgfSxcbiAgICAgICAgdG91Y2h1cDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgVG91Y2hIYW5kbGVyLmFsbG93RXZlbnQoZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBEZWxlZ2F0ZWQgY2xpY2sgaGFuZGxlciBmb3IgLndhdmVzLWVmZmVjdCBlbGVtZW50LlxuICAgICAqIHJldHVybnMgbnVsbCB3aGVuIC53YXZlcy1lZmZlY3QgZWxlbWVudCBub3QgaW4gXCJjbGljayB0cmVlXCJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRXYXZlc0VmZmVjdEVsZW1lbnQoZSkge1xuICAgICAgICBpZiAoVG91Y2hIYW5kbGVyLmFsbG93RXZlbnQoZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcblxuICAgICAgICB3aGlsZSAodGFyZ2V0LnBhcmVudEVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpICYmIHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZignd2F2ZXMtZWZmZWN0JykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRhcmdldDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnd2F2ZXMtZWZmZWN0JykpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWJibGUgdGhlIGNsaWNrIGFuZCBzaG93IGVmZmVjdCBpZiAud2F2ZXMtZWZmZWN0IGVsZW0gd2FzIGZvdW5kXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2hvd0VmZmVjdChlKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZ2V0V2F2ZXNFZmZlY3RFbGVtZW50KGUpO1xuXG4gICAgICAgIGlmIChlbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBFZmZlY3Quc2hvdyhlLCBlbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBFZmZlY3QuaGlkZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBFZmZlY3QuaGlkZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBFZmZlY3QuaGlkZSwgZmFsc2UpO1xuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgRWZmZWN0LmhpZGUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFdhdmVzLmRpc3BsYXlFZmZlY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIGlmICgnZHVyYXRpb24nIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIEVmZmVjdC5kdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vV3JhcCBpbnB1dCBpbnNpZGUgPGk+IHRhZ1xuICAgICAgICBFZmZlY3Qud3JhcElucHV0KCQkKCcud2F2ZXMtZWZmZWN0JykpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgc2hvd0VmZmVjdCwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNob3dFZmZlY3QsIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIFdhdmVzIHRvIGFuIGlucHV0IGVsZW1lbnQgKG9yIGFueSBlbGVtZW50IHdoaWNoIGRvZXNuJ3RcbiAgICAgKiBidWJibGUgbW91c2V1cC9tb3VzZWRvd24gZXZlbnRzKS5cbiAgICAgKiAgIEludGVuZGVkIHRvIGJlIHVzZWQgd2l0aCBkeW5hbWljYWxseSBsb2FkZWQgZm9ybXMvaW5wdXRzLCBvclxuICAgICAqIHdoZXJlIHRoZSB1c2VyIGRvZXNuJ3Qgd2FudCBhIGRlbGVnYXRlZCBjbGljayBoYW5kbGVyLlxuICAgICAqL1xuICAgIFdhdmVzLmF0dGFjaCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgLy9GVVRVUkU6IGF1dG9tYXRpY2FsbHkgYWRkIHdhdmVzIGNsYXNzZXMgYW5kIGFsbG93IHVzZXJzXG4gICAgICAgIC8vIHRvIHNwZWNpZnkgdGhlbSB3aXRoIGFuIG9wdGlvbnMgcGFyYW0/IEVnLiBsaWdodC9jbGFzc2ljL2J1dHRvblxuICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbnB1dCcpIHtcbiAgICAgICAgICAgIEVmZmVjdC53cmFwSW5wdXQoW2VsZW1lbnRdKTtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzaG93RWZmZWN0LCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNob3dFZmZlY3QsIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgd2luZG93LldhdmVzID0gV2F2ZXM7XG59KSh3aW5kb3cpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9