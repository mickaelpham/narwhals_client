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
  var app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = angular.module('narwhal');

  app.factory('User', [
    '$http', function($http) {
      var User;
      return new (User = (function() {
        function User() {
          this.login = bind(this.login, this);
        }

        User.prototype.login = function(username, password) {
          var error, request;
          error = (function(_this) {
            return function() {};
          })(this);
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

        User.prototype.getSavings = function(sessionToken, transactionId, frequency, timePeriod) {
          var params, request, url;
          url = 'https://nameless-scrubland-4785.herokuapp.com/v1/savings?session_token=' + sessionToken;
          params = {
            co_transaction_id: transactionId,
            frequency: 4,
            time_period: timePeriod
          };
          request = $http.post(url, params);
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
      return this.$scope.$broadcast('scroll.refreshComplete');
    };

    IndexController.prototype.loadTransactions = function() {
      if (!this.$rootScope.session_token) {
        this.$state.go('login');
        return;
      }
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
      console.log('Trying to login');
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
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  recurringModule = angular.module('narwhal.recurring');

  RecurringController = (function(superClass) {
    extend(RecurringController, superClass);

    function RecurringController() {
      this.showSavings = bind(this.showSavings, this);
      return RecurringController.__super__.constructor.apply(this, arguments);
    }

    RecurringController.register(recurringModule);

    RecurringController.inject('$scope', '$http', '$scope', '$rootScope', '$stateParams', '$state', 'locker', 'currentTransaction', 'User', '$ionicViewSwitcher');

    RecurringController.prototype.initialize = function() {
      if (!this.$rootScope.currentTransaction) {
        this.$ionicViewSwitcher.nextDirection('back');
        this.$state.go('index');
        this.$scope.defaultFrequency = 5;
        this.$scope.defaultInterval = "Year";
        return this.$scope.frequencyList = [
          {
            text: "Year",
            value: "Year"
          }, {
            text: "Month",
            value: "Month"
          }
        ];
      }
    };

    RecurringController.prototype.showSavings = function() {
      var frequency, ref, ref1, ref2, timePeriod, transactionId;
      transactionId = (ref = this.$rootScope.currentTransaction.id) != null ? ref : '1';
      frequency = (ref1 = this.$scope.frequency) != null ? ref1 : 4;
      timePeriod = (ref2 = this.$scope.timePeriod) != null ? ref2 : 'week';
      console.log('ShowSavings');
      return this.User.getSavings(this.$rootScope.session_token, transactionId, frequency, timePeriod).then((function(_this) {
        return function(result) {
          console.log(result);
          _this.$rootScope.projections = result.data.savings_projection;
          _this.locker.put('projections', result.data.savings_projection);
          return _this.$state.go('report');
        };
      })(this));
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

    ReportController.inject('$scope', '$rootScope', 'locker');

    ReportController.prototype.initialize = function() {
      if (this.$rootScope.projections == null) {
        if (this.locker.has('projections')) {
          this.$rootScope.projections = this.locker.get('projections');
        }
      }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC5jb2ZmZWUiLCJjb250cm9sbGVyL0Jhc2VDb250cm9sbGVyLmNvZmZlZSIsInNlcnZpY2UvVXNlclNlcnZpY2UuY29mZmVlIiwibG9naW4vTG9naW5Nb2R1bGUuY29mZmVlIiwicmVjdXJyaW5nL1JlY3VycmluZ01vZHVsZS5jb2ZmZWUiLCJyZXBvcnQvUmVwb3J0TW9kdWxlLmNvZmZlZSIsImluZGV4L2NvbnRyb2xsZXIvSW5kZXhDb250cm9sbGVyLmNvZmZlZSIsImxvZ2luL2NvbnRyb2xsZXIvTG9naW5Db250cm9sbGVyLmNvZmZlZSIsImxvZ2luL2RpcmVjdGl2ZS9pb25NZElucHV0LmNvZmZlZSIsInJlY3VycmluZy9jb250cm9sbGVyL1JlY3VycmluZ0NvbnRyb2xsZXIuY29mZmVlIiwicmVwb3J0L2NvbnRyb2xsZXIvUmVwb3J0Q29udHJvbGxlci5jb2ZmZWUiLCJtYXRlcmlhbC1pb25pYy5qcyIsIndhdmVzLmpzIiwiYW5ndWxhci1sb2NrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUE7QUFBQSxNQUFBLEdBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmLEVBQTBCLENBQzlCLE9BRDhCLEVBRTlCLGVBRjhCLEVBRzlCLGdCQUg4QixFQUk5QixtQkFKOEIsRUFLOUIsV0FMOEIsRUFNOUIsZ0JBTjhCLENBQTFCLENBQU4sQ0FBQTs7QUFBQSxFQVNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsU0FBQyxjQUFELEVBQWlCLFVBQWpCLEdBQUE7QUFDTixJQUFBLGNBQWMsQ0FBQyxLQUFmLENBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsSUFBbUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBN0M7QUFDRSxRQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJuYXJ3aGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIyBJb25pYyBTdGFydGVyIEFwcFxuIyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuIyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbiMgdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuIyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbiMgJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG5hcHAgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbCcsIFtcbiAgJ2lvbmljJ1xuICAnbmFyd2hhbC5sb2dpbidcbiAgJ25hcndoYWwucmVwb3J0J1xuICAnbmFyd2hhbC5yZWN1cnJpbmcnXG4gICd1aS5yb3V0ZXInXG4gICdhbmd1bGFyLWxvY2tlcidcbl0pXG5cbmFwcC5ydW4oKCRpb25pY1BsYXRmb3JtLCAkcm9vdFNjb3BlKSAtPlxuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeSAtPlxuICAgIGNvbnNvbGUubG9nIFwiUmVhZHkhXCJcbiAgICBpZiB3aW5kb3cuY29yZG92YSBhbmQgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZFxuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhciB0cnVlXG4gICAgaWYgd2luZG93LlN0YXR1c0JhclxuICAgICAgIyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KClcblxuXG4gICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VTdGFydCcsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykgLT5cbiAgICBjb25zb2xlLmxvZyBcIkNoYW5nZWQgcm91dGUgdG8gI3t0b1N0YXRlLnVybH1cIlxuICAgIGNvbnNvbGUubG9nIFwiQ2hhbmdlZCByb3V0ZSB0byAje3RvU3RhdGUubmFtZX1cIlxuICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlRXJyb3InLCAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIGVycm9yKS0+XG4gICAgY29uc29sZS5lcnJvciAnQ291bGQgbm90IGNoYW5nZSBzdGF0ZSdcbiAgICBjb25zb2xlLmVycm9yIGVycm9yXG4gICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VTdWNjZXNzJywgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKS0+XG4gICAgY29uc29sZS5sb2cgJ1N1Y2Nlc3NmdWx5IGNoYW5nZWQgc3RhdGUnXG5cbilcblxuYXBwLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgLT5cbiAgIyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgIyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAjIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gICMgRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpbmRleCcsXG4gICAgdXJsOiAnLydcbiAgICBjb250cm9sbGVyOiAnSW5kZXhDb250cm9sbGVyJ1xuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2luZGV4Lmh0bWwnKVxuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UgJy8nXG5cblxuICByZXR1cm4iLCIjIEJhc2UgY2xhc3MgZm9yIGFuZ3VsYXIgY29udHJvbGxlcnMsIHdoaWNoIGVhc2VzIHRoZSBwcm9jZXNzIG9mIGluaXRpYWxpemF0aW9uIGFuZCBkZXBlbmRlbmN5IGluamVjdGlvbi5cbiMgVGhpcyBhcHByb2FjaCBpcyBiYXNlZCBvbiBodHRwOi8vd3d3LmRldmlnbi5tZS9hbmd1bGFyLWRvdC1qcy1jb2ZmZWVzY3JpcHQtY29udHJvbGxlci1iYXNlLWNsYXNzXG4jXG4jIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gdXNlIGl0OlxuI1xuIyBzb21lQXBwTW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ3NvbWVBcHAnXG4jXG4jIGNsYXNzIE15QXdlc29tZUNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuIyAgICMgcmVnaXN0ZXIgdGhlIGNvbnRyb2xsZXIgYXQgb3VyIG1vZHVsZVxuIyAgIEByZWdpc3RlciBzb21lQXBwTW9kdWxlXG4jICAgIyBkZXBlbmRlbmNpZXMgdG8gaW5qZWN0LCB3aWxsIGJlIGF2YWlsYWJsZSBhcyBtZW1iZXIgdmFyaWFibGUgZS5nLiBAJHNjb3BlXG4jICAgQGluamVjdCAnJHNjb3BlJywgJyRodHRwJywgJ015U2VydmljZSdcbiMgICAjIGNhbGxlZCBhZnRlciBpbnN0YW50aWF0aW9uIGlmIGV4aXN0c1xuIyAgIGluaXRpYWxpemU6IC0+XG4jICAgICAjIGluaXQgc29tZSBzdHVmZiAuLi5cbiMgICBzdWJtaXQ6IC0+XG4jICAgICAjIGJvdW5kIHRvICRzY29wZSBhbmQgdXNhYmxlIGluIHRlbXBsYXRlIGF1dG9tYXRpY2FsbHlcbiNcbiMgVE9ETzogQWRkIGNoZWNrIHRvIGVuc3VyZSAkc2NvcGUgYXMgZGVwZW5kZW5jeSB3aGVuIG9uZSBvciBtb3JlIGZ1bmN0aW9ucyBhcmUgZGVmaW5lZCBhcyB0aGV5IGFyZSBib3VuZCBhdXRvbWF0aWNhbGx5XG4jXG5jbGFzcyBAQmFzZUNvbnRyb2xsZXJcbiAgQHJlZ2lzdGVyOiAoYXBwLCBuYW1lKSAtPlxuICAgIG5hbWUgPz0gQG5hbWUgfHwgQHRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uXFxzKiguKj8pXFwoLyk/WzFdXG4gICAgYXBwLmNvbnRyb2xsZXIgbmFtZSwgQFxuXG4gIEBpbmplY3Q6IChhcmdzLi4uKSAtPlxuICAgIEAkaW5qZWN0ID0gYXJnc1xuXG5cbiAgY29uc3RydWN0b3I6IChhcmdzLi4uKSAtPlxuICAgIGZvciBrZXksIGluZGV4IGluIEBjb25zdHJ1Y3Rvci4kaW5qZWN0XG4gICAgICBAW2tleV0gPSBhcmdzW2luZGV4XVxuXG4gICAgZm9yIGtleSwgZm4gb2YgQGNvbnN0cnVjdG9yLnByb3RvdHlwZVxuICAgICAgY29udGludWUgdW5sZXNzIHR5cGVvZiBmbiBpcyAnZnVuY3Rpb24nXG4gICAgICBjb250aW51ZSBpZiBrZXkgaW4gWydjb25zdHJ1Y3RvcicsICdpbml0aWFsaXplJ10gb3Iga2V5WzBdIGlzICdfJ1xuICAgICAgQCRzY29wZVtrZXldID0gZm4uYmluZD8oQCkgfHwgXy5iaW5kKGZuLCBAKVxuXG4gICAgQGluaXRpYWxpemU/KCkiLCJhcHAgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbCdcblxuYXBwLmZhY3RvcnkgJ1VzZXInLCBbJyRodHRwJywgKCRodHRwKSAtPlxuICBuZXcgY2xhc3MgVXNlclxuICAgIGNvbnN0cnVjdG9yOiAtPlxuXG4gICAgbG9naW46ICh1c2VybmFtZSwgcGFzc3dvcmQpID0+XG4gICAgICBlcnJvciA9ICgpID0+XG4gICAgICByZXF1ZXN0ID0gJGh0dHAucG9zdCAnaHR0cHM6Ly9uYW1lbGVzcy1zY3J1YmxhbmQtNDc4NS5oZXJva3VhcHAuY29tL3YxL3Nlc3Npb24vJywge2VtYWlsOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkIH1cbiAgICAgIHJlcXVlc3RcblxuICAgIGdldFRyYW5zYWN0aW9uczogKHNlc3Npb25Ub2tlbikgLT5cbiAgICAgIHJlcXVlc3QgPSAkaHR0cC5nZXQgJ2h0dHBzOi8vbmFtZWxlc3Mtc2NydWJsYW5kLTQ3ODUuaGVyb2t1YXBwLmNvbS92MS90cmFuc2FjdGlvbnMnLCB7IHBhcmFtczogeyBzZXNzaW9uX3Rva2VuOiBzZXNzaW9uVG9rZW4gfX1cbiAgICAgIHJldHVybiByZXF1ZXN0XG5cbiAgICBnZXRTYXZpbmdzOiAoc2Vzc2lvblRva2VuLCB0cmFuc2FjdGlvbklkLCBmcmVxdWVuY3ksIHRpbWVQZXJpb2QpIC0+XG4gICAgICB1cmwgPSAnaHR0cHM6Ly9uYW1lbGVzcy1zY3J1YmxhbmQtNDc4NS5oZXJva3VhcHAuY29tL3YxL3NhdmluZ3M/c2Vzc2lvbl90b2tlbj0nICsgc2Vzc2lvblRva2VuXG4gICAgICBwYXJhbXMgPVxuICAgICAgICBjb190cmFuc2FjdGlvbl9pZDogdHJhbnNhY3Rpb25JZCxcbiAgICAgICAgZnJlcXVlbmN5OiA0XG4gICAgICAgIHRpbWVfcGVyaW9kOiB0aW1lUGVyaW9kXG5cbiAgICAgIHJlcXVlc3QgPSAkaHR0cC5wb3N0IHVybCwgcGFyYW1zXG4gICAgICByZXR1cm4gcmVxdWVzdFxuXSIsImxvZ2luTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25hcndoYWwubG9naW4nLCBbXSlcblxubG9naW5Nb2R1bGUuY29uZmlnICgkc3RhdGVQcm92aWRlciktPlxuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUoJ2xvZ2luJyxcbiAgICB1cmw6ICcvbG9naW4vJ1xuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xvZ2luLmh0bWwnXG4gICAgY29udHJvbGxlcjogJ0xvZ2luQ29udHJvbGxlcidcbiAgKSIsInJlY3VycmluZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCduYXJ3aGFsLnJlY3VycmluZycsIFtdKVxuXG5yZWN1cnJpbmdNb2R1bGUuY29uZmlnICgkc3RhdGVQcm92aWRlciktPlxuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUoJ3JlY3VycmluZycsXG4gICAgdXJsOiAnL3JlY3VycmluZy8nXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcmVjdXJyaW5nLmh0bWwnXG4gICAgY29udHJvbGxlcjogJ1JlY3VycmluZ0NvbnRyb2xsZXInXG4gICAgcmVzb2x2ZTpcbiAgICAgIGN1cnJlbnRUcmFuc2FjdGlvbjogWyckcm9vdFNjb3BlJywgKCRyb290U2NvcGUpLT5cbiAgICAgICAgcmV0dXJuICRyb290U2NvcGUuY3VycmVudFRyYW5zYWN0aW9uXG4gICAgICBdXG4gICkiLCJyZXBvcnRNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbC5yZXBvcnQnLCBbXSlcblxucmVwb3J0TW9kdWxlLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpLT5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgLnN0YXRlKCdyZXBvcnQnLFxuICAgIHVybDogJy9yZXBvcnQvJ1xuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3JlcG9ydC5odG1sJ1xuICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJ1xuICApIiwiYXBwID0gYW5ndWxhci5tb2R1bGUgJ25hcndoYWwnXG5cbmNsYXNzIEluZGV4Q29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyXG5cbiAgQHJlZ2lzdGVyIGFwcFxuICBAaW5qZWN0ICckc2NvcGUnLCAnJGh0dHAnLCAnJHN0YXRlJywgJyRyb290U2NvcGUnLCAgJ1VzZXInLCAnbG9ja2VyJ1xuXG4gIGluaXRpYWxpemU6ICgpPT5cbiAgICBAJHNjb3BlLnRyYW5zYWN0aW9ucyA9IFtdXG4gICAgQGxvYWRUcmFuc2FjdGlvbnMoKVxuICAgIGlmIEBsb2NrZXIuaGFzICdzZXNzaW9uX3Rva2VuJ1xuICAgICAgQCRyb290U2NvcGUuc2Vzc2lvbl90b2tlbiA9IEBsb2NrZXIuZ2V0ICdzZXNzaW9uX3Rva2VuJ1xuXG4gICAgaWYgQGxvY2tlci5oYXMgJ3RyYW5zYWN0aW9ucydcbiAgICAgIEAkc2NvcGUudHJhbnNhY3Rpb25zID0gQGxvY2tlci5nZXQgJ3RyYW5zYWN0aW9ucydcbiAgICAgIGlvbmljLkRvbVV0aWwucmVhZHkoICgpLT5cbiAgICAgICAgTWkubW90aW9uLmZhZGVTbGlkZUluUmlnaHQoe3NlbGVjdG9yOiAnLmFuaW1hdGUtZmFkZS1zbGlkZS1pbi1yaWdodCA+IConfSlcbiAgICAgIClcblxuICBsb2dvdXQ6ICgpLT5cbiAgICBAbG9ja2VyLmZvcmdldCgnc2Vzc2lvbl90b2tlbicpXG4gICAgQCRzdGF0ZS5nbyAnbG9naW4nXG5cbiAgcmVmcmVzaDogKCktPlxuICAgIEBsb2FkVHJhbnNhY3Rpb25zKClcbiAgICBAJHNjb3BlLiRicm9hZGNhc3QoJ3Njcm9sbC5yZWZyZXNoQ29tcGxldGUnKVxuXG4gIGxvYWRUcmFuc2FjdGlvbnM6ICgpPT5cbiAgICBpZighQCRyb290U2NvcGUuc2Vzc2lvbl90b2tlbilcbiAgICAgIEAkc3RhdGUuZ28gJ2xvZ2luJ1xuICAgICAgcmV0dXJuO1xuICAgIEBVc2VyLmdldFRyYW5zYWN0aW9ucyhAJHJvb3RTY29wZS5zZXNzaW9uX3Rva2VuKS50aGVuIChyZXN1bHQpPT5cbiAgICAgIEAkc2NvcGUudHJhbnNhY3Rpb25zID0gcmVzdWx0LmRhdGFcbiAgICAgIEBsb2NrZXIucHV0ICd0cmFuc2FjdGlvbnMnLCBAJHNjb3BlLnRyYW5zYWN0aW9uc1xuXG4gIGdldFJhbmRvbUFtb3VudDogKCk9PlxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDAwKSAvIDEwMFxuXG4gIHNob3dUcmFuc2FjdGlvbjogKHRyYW5zYWN0aW9uKS0+XG4gICAgY29uc29sZS5sb2cgXCJDdXJyZW50IFRyYW5zYWN0aW9uXCJcbiAgICBjb25zb2xlLmxvZyB0cmFuc2FjdGlvblxuICAgIEAkcm9vdFNjb3BlLmN1cnJlbnRUcmFuc2FjdGlvbiA9IHRyYW5zYWN0aW9uXG4gICAgQCRzdGF0ZS5nbygncmVjdXJyaW5nJylcblxuIiwibG9naW5Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbC5sb2dpbidcblxuY2xhc3MgTG9naW5Db250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXJcblxuICBAcmVnaXN0ZXIgbG9naW5Nb2R1bGVcbiAgQGluamVjdCAnJHNjb3BlJywgJyRodHRwJywgJyRzdGF0ZScsICdVc2VyJywgJyRyb290U2NvcGUnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJ2xvY2tlcidcblxuICBsb2dpbjogKCk9PlxuICAgIEAkc2NvcGUuaXNMb2FkaW5nID0gdHJ1ZVxuICAgIGNvbnNvbGUubG9nICdUcnlpbmcgdG8gbG9naW4nXG4gICAgQFVzZXIubG9naW4oQCRzY29wZS51c2VybmFtZSwgQCRzY29wZS5wYXNzd29yZCkudGhlbiggKHJlc3VsdCk9PlxuICAgICAgQCRzY29wZS5pc0xvYWRpbmcgPSBmYWxzZVxuXG4gICAgICBAJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24gJ3N3YXAnXG4gICAgICBAJHJvb3RTY29wZS5zZXNzaW9uX3Rva2VuID0gcmVzdWx0LmRhdGEuc2Vzc2lvbl90b2tlblxuXG4gICAgICBAbG9ja2VyLnB1dCAnc2Vzc2lvbl90b2tlbicsIEAkcm9vdFNjb3BlLnNlc3Npb25fdG9rZW5cblxuICAgICAgQCRzdGF0ZS5nbyAnaW5kZXgnXG4gICAgKVxuXG4gIGluaXRpYWxpemU6ICgpPT5cbiAgICBAJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24gJ3N3YXAnXG4gICAgY29uc29sZS5sb2cgXCJpbml0aWFsaXplZCBsb2dpbiBtb2R1bGVcIlxuXG4gICAgaWYgQGxvY2tlci5nZXQoJ3Nlc3Npb25fdG9rZW4nKVxuICAgICAgQCRyb290U2NvcGUuc2Vzc2lvbl90b2tlbiA9IEBsb2NrZXIuZ2V0KCdzZXNzaW9uX3Rva2VuJylcblxuIiwiYW5ndWxhci5tb2R1bGUoJ25hcndoYWwubG9naW4nKS5kaXJlY3RpdmUgJ2lvbk1kSW5wdXQnLCAtPlxuICB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgIHJlcGxhY2U6IHRydWVcbiAgICByZXF1aXJlOiAnP25nTW9kZWwnXG4gICAgdGVtcGxhdGU6ICc8bGFiZWwgY2xhc3M9XCJpdGVtIGl0ZW0taW5wdXQgaXRlbS1tZC1sYWJlbFwiPicgKyAnPGlucHV0IHR5cGU9XCJ0ZXh0XCI+JyArICc8c3BhbiBjbGFzcz1cImlucHV0LWxhYmVsXCI+PC9zcGFuPicgKyAnPGRpdiBjbGFzcz1cImhpZ2hsaWdodFwiPjwvZGl2PicgKyAnPC9sYWJlbD4nXG4gICAgY29tcGlsZTogKGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBoaWdobGlnaHQgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5oaWdobGlnaHQnKVxuICAgICAgaGlnaGxpZ2h0Q29sb3IgPSB1bmRlZmluZWRcbiAgICAgIGlmICFhdHRyLmhpZ2hsaWdodENvbG9yXG4gICAgICAgIGhpZ2hsaWdodENvbG9yID0gJ2NhbG0nXG4gICAgICBlbHNlXG4gICAgICAgIGhpZ2hsaWdodENvbG9yID0gYXR0ci5oaWdobGlnaHRDb2xvclxuICAgICAgaGlnaGxpZ2h0LmNsYXNzTmFtZSArPSAnIGhpZ2hsaWdodC0nICsgaGlnaGxpZ2h0Q29sb3JcbiAgICAgIGxhYmVsID0gZWxlbWVudC5maW5kKCdzcGFuJylcbiAgICAgIGxhYmVsLmh0bWwgYXR0ci5wbGFjZWhvbGRlclxuICAgICAgaW5wdXQgPSBlbGVtZW50LmZpbmQoJ2lucHV0JylcbiAgICAgIGlucHV0LmJpbmQgJ2JsdXInLCAtPlxuICAgICAgICBjb25zb2xlLmxvZyAnYmx1cidcbiAgICAgICAgaWYgaW5wdXQudmFsKClcbiAgICAgICAgICBpbnB1dC5hZGRDbGFzcyAndXNlZCdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlucHV0LnJlbW92ZUNsYXNzICd1c2VkJ1xuICAgICAgICByZXR1cm5cbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCB7XG4gICAgICAgICduYW1lJzogYXR0ci5uYW1lXG4gICAgICAgICd0eXBlJzogYXR0ci50eXBlXG4gICAgICAgICduZy12YWx1ZSc6IGF0dHIubmdWYWx1ZVxuICAgICAgICAnbmctbW9kZWwnOiBhdHRyLm5nTW9kZWxcbiAgICAgICAgJ3JlcXVpcmVkJzogYXR0ci5yZXF1aXJlZFxuICAgICAgICAnbmctcmVxdWlyZWQnOiBhdHRyLm5nUmVxdWlyZWRcbiAgICAgICAgJ25nLW1pbmxlbmd0aCc6IGF0dHIubmdNaW5sZW5ndGhcbiAgICAgICAgJ25nLW1heGxlbmd0aCc6IGF0dHIubmdNYXhsZW5ndGhcbiAgICAgICAgJ25nLXBhdHRlcm4nOiBhdHRyLm5nUGF0dGVyblxuICAgICAgICAnbmctY2hhbmdlJzogYXR0ci5uZ0NoYW5nZVxuICAgICAgICAnbmctdHJpbSc6IGF0dHIudHJpbVxuICAgICAgICAnbmctYmx1cic6IGF0dHIubmdCbHVyXG4gICAgICAgICduZy1mb2N1cyc6IGF0dHIubmdGb2N1c1xuICAgICAgfSwgKHZhbHVlLCBuYW1lKSAtPlxuICAgICAgICBpZiBhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSlcbiAgICAgICAgICBpbnB1dC5hdHRyIG5hbWUsIHZhbHVlXG4gICAgICAgIHJldHVyblxuXG4gICAgICBjbGVhblVwID0gLT5cbiAgICAgICAgaW9uaWMub2ZmICckZGVzdHJveScsIGNsZWFuVXAsIGVsZW1lbnRbMF1cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlvbmljLm9uICckZGVzdHJveScsIGNsZWFuVXAsIGVsZW1lbnRbMF1cbiAgICAgIHJldHVyblxuXG4gIH1cbiIsInJlY3VycmluZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsLnJlY3VycmluZydcblxuY2xhc3MgUmVjdXJyaW5nQ29udHJvbGxlciBleHRlbmRzIEJhc2VDb250cm9sbGVyXG5cbiAgQHJlZ2lzdGVyIHJlY3VycmluZ01vZHVsZVxuICBAaW5qZWN0ICckc2NvcGUnLCAnJGh0dHAnLCAnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgICckc3RhdGUnLCAgJ2xvY2tlcicsICdjdXJyZW50VHJhbnNhY3Rpb24nLCAnVXNlcicsICckaW9uaWNWaWV3U3dpdGNoZXInXG5cbiAgaW5pdGlhbGl6ZTogKCktPlxuICAgIGlmICFAJHJvb3RTY29wZS5jdXJyZW50VHJhbnNhY3Rpb25cbiAgICAgIEAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbiAnYmFjaydcbiAgICAgIEAkc3RhdGUuZ28gJ2luZGV4J1xuXG4gICAgICBAJHNjb3BlLmRlZmF1bHRGcmVxdWVuY3kgPSA1XG4gICAgICBAJHNjb3BlLmRlZmF1bHRJbnRlcnZhbCA9IFwiWWVhclwiXG5cbiAgICAgIEAkc2NvcGUuZnJlcXVlbmN5TGlzdCA9IFtcbiAgICAgICAgICB7dGV4dDogXCJZZWFyXCIsIHZhbHVlOiBcIlllYXJcIn0sXG4gICAgICAgICAge3RleHQ6IFwiTW9udGhcIiwgdmFsdWU6IFwiTW9udGhcIn1cbiAgICAgIF1cblxuICBzaG93U2F2aW5nczogKCk9PlxuICAgIHRyYW5zYWN0aW9uSWQgPSBAJHJvb3RTY29wZS5jdXJyZW50VHJhbnNhY3Rpb24uaWQgPyAnMSdcbiAgICBmcmVxdWVuY3kgPSBAJHNjb3BlLmZyZXF1ZW5jeSA/IDRcbiAgICB0aW1lUGVyaW9kID0gQCRzY29wZS50aW1lUGVyaW9kID8gJ3dlZWsnXG4gICAgY29uc29sZS5sb2cgJ1Nob3dTYXZpbmdzJ1xuICAgIEBVc2VyLmdldFNhdmluZ3MoQCRyb290U2NvcGUuc2Vzc2lvbl90b2tlbiwgdHJhbnNhY3Rpb25JZCwgZnJlcXVlbmN5LCB0aW1lUGVyaW9kKS50aGVuKCAocmVzdWx0KT0+XG4gICAgICBjb25zb2xlLmxvZyByZXN1bHRcbiAgICAgIEAkcm9vdFNjb3BlLnByb2plY3Rpb25zID0gcmVzdWx0LmRhdGEuc2F2aW5nc19wcm9qZWN0aW9uXG4gICAgICBAbG9ja2VyLnB1dCAncHJvamVjdGlvbnMnLCByZXN1bHQuZGF0YS5zYXZpbmdzX3Byb2plY3Rpb25cbiAgICAgIEAkc3RhdGUuZ28gJ3JlcG9ydCdcbiAgICApXG4iLCJyZXBvcnRNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbC5yZXBvcnQnXG5cbmNsYXNzIFJlcG9ydENvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuXG4gIEByZWdpc3RlciByZXBvcnRNb2R1bGVcbiAgQGluamVjdCAnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnbG9ja2VyJ1xuXG4gIGluaXRpYWxpemU6ICgpLT5cbiAgICBpZiAhQCRyb290U2NvcGUucHJvamVjdGlvbnM/XG4gICAgICBpZiBAbG9ja2VyLmhhcyAncHJvamVjdGlvbnMnXG4gICAgICAgIEAkcm9vdFNjb3BlLnByb2plY3Rpb25zID0gQGxvY2tlci5nZXQgJ3Byb2plY3Rpb25zJ1xuXG4gICAgc2V0VGltZW91dCggKCktPlxuICAgICAgTWkubW90aW9uLmJsaW5kc0Rvd24oeyBzZWxlY3RvcjogJy5jYXJkJ30pXG4gICAgLCA1MDApXG4iLCIvLyBFeHRlbmQgbmFtZXNwYWNlIGlmIG1pIGlzIGFscmVhZHkgZGVmaW5lZFxudmFyIE1pID0gTWkgfHwge307XG5cblxuLy8gTWkgbGlicmFyeSByZXR1cm5lZCBmcm9tIGNsb3N1cmVcbk1pID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICAvKiBMaWJyYXJ5IENvbnN0YW50cyAoRVhQT1JUKVxuICAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICB2YXIgdmVyc2lvbiA9ICcwLjAuMSc7XG5cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgLyogSEVMUEVSUyAobm9uLWV4cG9ydHMpXG4gICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSpcbiAgICAgLyAgIEFic3RyYWN0IGNvbW1vbiBsb29rdXBzIGFuZCBtYW5pcHVsYXRpb25zIGluIGNhc2UgYmV0dGVyIGFsdGVybmF0aXZlc1xuICAgICAvICAgYXJpc2Ugb3IgZnV0dXJlIGNyb3NzLXBsYXRmb3JtIGRpZmZlcmVuY2VzIHdhcnJhbnQgc2VwYXJhdGUgaGFuZGxpbmdcbiAgICAgLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuICAgIGZ1bmN0aW9uIGdldFZpZXdwb3J0SGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChkb21Ob2RlKSB7XG4gICAgICAgIHJldHVybiBkb21Ob2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdDtcbiAgICB9XG5cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgLyogTU9USU9OIChFWFBPUlQpXG4gICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSpcbiAgICAgLyAgIEFuaW1hdGlvbiBtZXRob2RzIGZvciB0aGUgbGlicmFyeVxuICAgICAvPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4gICAgLy8gSG9pc3RpbmcgdGhlIGFuaW1hdGlvbiBmdW5jdGlvbnMgaW50byBvdXIgbW90aW9uIG9iamVjdFxuICAgIHZhciBtb3Rpb24gPSB7XG4gICAgICAgIGJsaW5kc0Rvd246IGJsaW5kc0Rvd24sXG4gICAgICAgIGZhZGVTbGlkZUluOiBmYWRlU2xpZGVJbixcbiAgICAgICAgZmFkZVNsaWRlSW5SaWdodDogZmFkZVNsaWRlSW5SaWdodCxcbiAgICAgICAgcGFuSW5MZWZ0OiBwYW5JbkxlZnQsXG4gICAgICAgIHB1c2hEb3duOiBwdXNoRG93bixcbiAgICAgICAgc2xpZGVVcDogc2xpZGVVcFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBibGluZHNEb3duKG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBEZWNsYXJlIG91ciBkZWZhdWx0c1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBmaW5pc2hEZWxheVRocm90dGxlOiAyLFxuICAgICAgICAgICAgZmluaXNoU3BlZWRQZXJjZW50OiAwLjUsXG4gICAgICAgICAgICBsZWZ0T2Zmc2V0UGVyY2VudGFnZTogMC44LFxuICAgICAgICAgICAgc3RhcnRWZWxvY2l0eTogMTEwMFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFwcGx5IGRlZmF1bHRzIGlmIHByb3BlcnRpZXMgYXJlIG5vdCBwYXNzZWRcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlID0gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlIHx8IGRlZmF1bHRzLmZpbmlzaERlbGF5VGhyb3R0bGU7XG4gICAgICAgIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50ID0gb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgfHwgZGVmYXVsdHMuZmluaXNoU3BlZWRQZXJjZW50O1xuICAgICAgICBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlID0gb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSB8fCBkZWZhdWx0cy5sZWZ0T2Zmc2V0UGVyY2VudGFnZTtcbiAgICAgICAgb3B0aW9ucy5zdGFydFZlbG9jaXR5ID0gb3B0aW9ucy5zdGFydFZlbG9jaXR5IHx8IGRlZmF1bHRzLnN0YXJ0VmVsb2NpdHk7XG5cbiAgICAgICAgLy8gRmFpbCBlYXJseSAmIHNpbGVudGx5IGxvZ1xuICAgICAgICB2YXIgaXNJbnZhbGlkU2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9ucy5zZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5zZWxlY3RvciA9PT0gJyc7XG5cbiAgICAgICAgaWYgKGlzSW52YWxpZFNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBibGluZHNEb3duIHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZUJsaW5kc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBlbGVtZW50QW5pbWF0aW9uQ291bnQgPSAwO1xuXG4gICAgICAgIC8vIENvdW50IHRoZSBlbGVtZW50cyB3aXRoaW4gdGhlIHN0YXJ0aW5nIHZpZXdwb3J0IHNvIHdlJ3JlIG5vdCBleGFjdGluZ1xuICAgICAgICAvLyBtb3JlIGVmZm9ydCB0aGFuIHJlcXVpcmVkLi4uXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIHVzZSBjc3MgdmlzaWJsaXR5OiBoaWRkZW4gaW5zdGVhZCBvZiBkaXNwbGF5OiBub25lIHNvIHRoZSBlbGVtZW50c1xuICAgICAgICAvLyBtYWludGFpbiB0aGVpciBET00gZmxvd1xuXG4gICAgICAgIHZhciB2aWV3cG9ydEhlaWdodCA9IGdldFZpZXdwb3J0SGVpZ2h0KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5pbWF0ZUJsaW5kc0RvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuaW1hdGVCbGluZHNEb21baV0ub2Zmc2V0VG9wIDwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50QW5pbWF0aW9uQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VxdWVudGlhbGx5IGFuaW1hdGUgd2l0aCBhIGRlbGF5IGJhc2VkIG9uIHByb3hpbWl0eVxuICAgICAgICB2YXIgc3BlZWQgPSBvcHRpb25zLnN0YXJ0VmVsb2NpdHk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGFuaW1hdGVCbGluZHNEb21baV07XG4gICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQob2Zmc2V0IC8gc3BlZWQpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS53ZWJraXRUcmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTmFtZSArPSAnIGluJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdoZW4gd2UncmUgZG9uZSBhbmltYXRpbmcsIHN3aXRjaCB0aGUgY2xhc3MgdG8gJ2RvbmUnXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZUJsaW5kc0RvbVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChvZmZzZXQgLyBzcGVlZCAvIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICBjaGlsZC5xdWVyeVNlbGVjdG9yKCdpbWcnKS5zdHlsZS53ZWJraXRUcmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgICAgIGNoaWxkLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICAgICAgLy9jaGlsZC5xdWVyeVNlbGVjdG9yKCdpbWcnKS5jbGFzc05hbWUgKz0gJyBpbic7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZUJsaW5kc0RvbVtpXS5wYXJlbnROb2RlLmNsYXNzTmFtZSArPSAnIGRvbmUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIHNwZWVkICogb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZhZGVTbGlkZUluKG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBEZWNsYXJlIG91ciBkZWZhdWx0c1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBmaW5pc2hEZWxheVRocm90dGxlOiAyLFxuICAgICAgICAgICAgZmluaXNoU3BlZWRQZXJjZW50OiAwLjcyLFxuICAgICAgICAgICAgbGVmdE9mZnNldFBlcmNlbnRhZ2U6IDAuOCxcbiAgICAgICAgICAgIHN0YXJ0VmVsb2NpdHk6IDExMDBcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBcHBseSBkZWZhdWx0cyBpZiBwcm9wZXJ0aWVzIGFyZSBub3QgcGFzc2VkXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSA9IG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZSB8fCBkZWZhdWx0cy5maW5pc2hEZWxheVRocm90dGxlO1xuICAgICAgICBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCA9IG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50IHx8IGRlZmF1bHRzLmZpbmlzaFNwZWVkUGVyY2VudDtcbiAgICAgICAgb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSA9IG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgfHwgZGVmYXVsdHMubGVmdE9mZnNldFBlcmNlbnRhZ2U7XG4gICAgICAgIG9wdGlvbnMuc3RhcnRWZWxvY2l0eSA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eSB8fCBkZWZhdWx0cy5zdGFydFZlbG9jaXR5O1xuXG4gICAgICAgIC8vIEZhaWwgZWFybHkgJiBzaWxlbnRseSBsb2dcbiAgICAgICAgdmFyIGlzSW52YWxpZFNlbGVjdG9yID0gdHlwZW9mIG9wdGlvbnMuc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuc2VsZWN0b3IgPT09ICcnO1xuXG4gICAgICAgIGlmIChpc0ludmFsaWRTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgZmFkZVNsaWRlSW4gc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlRmFkZVNsaWRlSW5Eb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gMDtcblxuICAgICAgICAvLyBDb3VudCB0aGUgZWxlbWVudHMgd2l0aGluIHRoZSBzdGFydGluZyB2aWV3cG9ydCBzbyB3ZSdyZSBub3QgZXhhY3RpbmdcbiAgICAgICAgLy8gbW9yZSBlZmZvcnQgdGhhbiByZXF1aXJlZC4uLlxuICAgICAgICAvL1xuICAgICAgICAvLyBXZSB1c2UgY3NzIHZpc2libGl0eTogaGlkZGVuIGluc3RlYWQgb2YgZGlzcGxheTogbm9uZSBzbyB0aGUgZWxlbWVudHNcbiAgICAgICAgLy8gbWFpbnRhaW4gdGhlaXIgRE9NIGZsb3dcblxuICAgICAgICB2YXIgdmlld3BvcnRIZWlnaHQgPSBnZXRWaWV3cG9ydEhlaWdodCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuaW1hdGVGYWRlU2xpZGVJbkRvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuaW1hdGVGYWRlU2xpZGVJbkRvbVtpXS5vZmZzZXRUb3AgPCB2aWV3cG9ydEhlaWdodCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRBbmltYXRpb25Db3VudCArPSAxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXF1ZW50aWFsbHkgYW5pbWF0ZSB3aXRoIGEgZGVsYXkgYmFzZWQgb24gcHJveGltaXR5XG4gICAgICAgIHZhciBzcGVlZCA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZUZhZGVTbGlkZUluRG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNoaWxkT2Zmc2V0ID0gY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KG9mZnNldCAvIHNwZWVkKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgY2hpbGQuc3R5bGUud2Via2l0VHJhbnNpdGlvbkRlbGF5ID0gZGVsYXkgKyBcInNcIjtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5jbGFzc05hbWUgKz0gJyBpbic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXaGVuIHdlJ3JlIGRvbmUgYW5pbWF0aW5nLCBzd2l0Y2ggdGhlIGNsYXNzIHRvICdkb25lJ1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGFuaW1hdGVGYWRlU2xpZGVJbkRvbVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRPZmZzZXQgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gY2hpbGRPZmZzZXQubGVmdCAqIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgKyBjaGlsZE9mZnNldC50b3A7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGF5VmFsdWUgPSBvZmZzZXQgLyBzcGVlZCAvIG9wdGlvbnMuZmluaXNoRGVsYXlUaHJvdHRsZTtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUZsb2F0KGRlbGF5VmFsdWUpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbmltYXRlRmFkZVNsaWRlSW5Eb21bMF0uY2xhc3NOYW1lICs9ICcgZG9uZSc7XG5cbiAgICAgICAgfSwgc3BlZWQgKiBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmFkZVNsaWRlSW5SaWdodChvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gRGVjbGFyZSBvdXIgZGVmYXVsdHNcbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgZmluaXNoRGVsYXlUaHJvdHRsZTogMixcbiAgICAgICAgICAgIGZpbmlzaFNwZWVkUGVyY2VudDogMC43MixcbiAgICAgICAgICAgIGxlZnRPZmZzZXRQZXJjZW50YWdlOiAwLjgsXG4gICAgICAgICAgICBzdGFydFZlbG9jaXR5OiAxMTAwXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQXBwbHkgZGVmYXVsdHMgaWYgcHJvcGVydGllcyBhcmUgbm90IHBhc3NlZFxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgPSBvcHRpb25zLmZpbmlzaERlbGF5VGhyb3R0bGUgfHwgZGVmYXVsdHMuZmluaXNoRGVsYXlUaHJvdHRsZTtcbiAgICAgICAgb3B0aW9ucy5maW5pc2hTcGVlZFBlcmNlbnQgPSBvcHRpb25zLmZpbmlzaFNwZWVkUGVyY2VudCB8fCBkZWZhdWx0cy5maW5pc2hTcGVlZFBlcmNlbnQ7XG4gICAgICAgIG9wdGlvbnMubGVmdE9mZnNldFBlcmNlbnRhZ2UgPSBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlIHx8IGRlZmF1bHRzLmxlZnRPZmZzZXRQZXJjZW50YWdlO1xuICAgICAgICBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgPSBvcHRpb25zLnN0YXJ0VmVsb2NpdHkgfHwgZGVmYXVsdHMuc3RhcnRWZWxvY2l0eTtcblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGZhZGVTbGlkZUluUmlnaHQgc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlU2xpZGVJblJpZ2h0RG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIGVsZW1lbnRBbmltYXRpb25Db3VudCA9IDA7XG5cbiAgICAgICAgLy8gQ291bnQgdGhlIGVsZW1lbnRzIHdpdGhpbiB0aGUgc3RhcnRpbmcgdmlld3BvcnQgc28gd2UncmUgbm90XG4gICAgICAgIC8vIGV4YWN0aW5nIG1vcmUgZWZmb3J0IHRoYW4gcmVxdWlyZWQuLi5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgdXNlIGNzcyB2aXNpYmxpdHk6IGhpZGRlbiBpbnN0ZWFkIG9mIGRpc3BsYXk6IG5vbmUgc28gdGhlXG4gICAgICAgIC8vIGVsZW1lbnRzIG1haW50YWluIHRoZWlyIERPTSBmbG93XG5cbiAgICAgICAgdmFyIHZpZXdwb3J0SGVpZ2h0ID0gZ2V0Vmlld3BvcnRIZWlnaHQoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbmltYXRlU2xpZGVJblJpZ2h0RG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYW5pbWF0ZVNsaWRlSW5SaWdodERvbVtpXS5vZmZzZXRUb3AgPCB2aWV3cG9ydEhlaWdodCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRBbmltYXRpb25Db3VudCArPSAxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXF1ZW50aWFsbHkgYW5pbWF0ZSB3aXRoIGEgZGVsYXkgYmFzZWQgb24gcHJveGltaXR5XG4gICAgICAgIHZhciBzcGVlZCA9IG9wdGlvbnMuc3RhcnRWZWxvY2l0eTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gYW5pbWF0ZVNsaWRlSW5SaWdodERvbVtpXTtcbiAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGNoaWxkT2Zmc2V0LmxlZnQgKiBvcHRpb25zLmxlZnRPZmZzZXRQZXJjZW50YWdlICsgY2hpbGRPZmZzZXQudG9wO1xuICAgICAgICAgICAgdmFyIGRlbGF5ID0gcGFyc2VGbG9hdChvZmZzZXQgLyBzcGVlZCkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIGNoaWxkLnN0eWxlLndlYmtpdFRyYW5zaXRpb25EZWxheSA9IGRlbGF5ICsgXCJzXCI7XG4gICAgICAgICAgICBjaGlsZC5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheSArIFwic1wiO1xuICAgICAgICAgICAgY2hpbGQuY2xhc3NOYW1lICs9ICcgaW4nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2hlbiB3ZSdyZSBkb25lIGFuaW1hdGluZywgc3dpdGNoIHRoZSBjbGFzcyB0byAnZG9uZSdcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudEFuaW1hdGlvbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBhbmltYXRlU2xpZGVJblJpZ2h0RG9tW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZE9mZnNldCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSBjaGlsZE9mZnNldC5sZWZ0ICogb3B0aW9ucy5sZWZ0T2Zmc2V0UGVyY2VudGFnZSArIGNoaWxkT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXlWYWx1ZSA9IG9mZnNldCAvIHNwZWVkIC8gb3B0aW9ucy5maW5pc2hEZWxheVRocm90dGxlO1xuICAgICAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlRmxvYXQoZGVsYXlWYWx1ZSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICggYW5pbWF0ZVNsaWRlSW5SaWdodERvbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZVNsaWRlSW5SaWdodERvbVswXS5jbGFzc05hbWUgKz0gJyBkb25lJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCBzcGVlZCAqIG9wdGlvbnMuZmluaXNoU3BlZWRQZXJjZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYW5JbkxlZnQob3B0aW9ucykge1xuXG4gICAgICAgIC8vIFdlIGhhdmUgYSBzaW5nbGUgb3B0aW9uLCBzbyBpdCBtYXkgYmUgcGFzc2VkIGFzIGEgc3RyaW5nIG9yIHByb3BlcnR5XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IG9wdGlvbnNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIHB1c2hEb3duIHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZVBhbkluTGVmdERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBlbGVtZW50QW5pbWF0aW9uQ291bnQgPSBhbmltYXRlUGFuSW5MZWZ0RG9tLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBhbmltYXRlUGFuSW5MZWZ0RG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZVRvUmVtb3ZlID0gJ2FuaW1hdGUtcGFuLWluLWxlZnQnO1xuICAgICAgICAgICAgdmFyIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSA9IGVsZW1lbnQuY2xhc3NOYW1lLmxhc3RJbmRleE9mKGNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUuc3Vic3RyKDAsIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwdXNoRG93bihvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSBhIHNpbmdsZSBvcHRpb24sIHNvIGl0IG1heSBiZSBwYXNzZWQgYXMgYSBzdHJpbmcgb3IgcHJvcGVydHlcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcjogb3B0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZhaWwgZWFybHkgJiBzaWxlbnRseSBsb2dcbiAgICAgICAgdmFyIGlzSW52YWxpZFNlbGVjdG9yID0gdHlwZW9mIG9wdGlvbnMuc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuc2VsZWN0b3IgPT09ICcnO1xuXG4gICAgICAgIGlmIChpc0ludmFsaWRTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgcHVzaERvd24gc2VsZWN0b3InKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRlUHVzaERvd25Eb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gYW5pbWF0ZVB1c2hEb3duRG9tLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50QW5pbWF0aW9uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBhbmltYXRlUHVzaERvd25Eb21baV07XG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lVG9SZW1vdmUgPSBvcHRpb25zLnNlbGVjdG9yLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICB2YXIgaW5kZXhPZkNsYXNzTmFtZVRvUmVtb3ZlID0gZWxlbWVudC5jbGFzc05hbWUubGFzdEluZGV4T2YoY2xhc3NOYW1lVG9SZW1vdmUpO1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5zdWJzdHIoMCwgaW5kZXhPZkNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNsaWRlVXAob3B0aW9ucykge1xuXG4gICAgICAgIC8vIFdlIGhhdmUgYSBzaW5nbGUgb3B0aW9uLCBzbyBpdCBtYXkgYmUgcGFzc2VkIGFzIGEgc3RyaW5nIG9yIHByb3BlcnR5XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IG9wdGlvbnNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWlsIGVhcmx5ICYgc2lsZW50bHkgbG9nXG4gICAgICAgIHZhciBpc0ludmFsaWRTZWxlY3RvciA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBvcHRpb25zLnNlbGVjdG9yID09PSAnJztcblxuICAgICAgICBpZiAoaXNJbnZhbGlkU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIHB1c2hEb3duIHNlbGVjdG9yJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0ZVNsaWRlVXBEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgZWxlbWVudEFuaW1hdGlvbkNvdW50ID0gYW5pbWF0ZVNsaWRlVXBEb20ubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBbmltYXRpb25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGFuaW1hdGVTbGlkZVVwRG9tW2ldO1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZVRvUmVtb3ZlID0gb3B0aW9ucy5zZWxlY3Rvci5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgdmFyIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSA9IGVsZW1lbnQuY2xhc3NOYW1lLmxhc3RJbmRleE9mKGNsYXNzTmFtZVRvUmVtb3ZlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUuc3Vic3RyKDAsIGluZGV4T2ZDbGFzc05hbWVUb1JlbW92ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBFeHBvcnQgb2JqZWN0XG4gICAgIC89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXR1cm4ge1xuICAgICAgICBtb3Rpb246IG1vdGlvbixcbiAgICAgICAgdmVyc2lvbjogdmVyc2lvblxuICAgIH1cblxufSkoKTtcbiIsIi8qIVxuICogV2F2ZXMgdjAuNi4zXG4gKiBodHRwOi8vZmlhbi5teS5pZC9XYXZlcyBcbiAqIFxuICogQ29weXJpZ2h0IDIwMTQgQWxmaWFuYSBFLiBTaWJ1ZWEgYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9maWFucy9XYXZlcy9ibG9iL21hc3Rlci9MSUNFTlNFIFxuICovXG5cbjsoZnVuY3Rpb24od2luZG93KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIFdhdmVzID0gV2F2ZXMgfHwge307XG4gICAgdmFyICQkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbC5iaW5kKGRvY3VtZW50KTtcblxuICAgIC8vIEZpbmQgZXhhY3QgcG9zaXRpb24gb2YgZWxlbWVudFxuICAgIGZ1bmN0aW9uIGlzV2luZG93KG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICE9PSBudWxsICYmIG9iaiA9PT0gb2JqLndpbmRvdztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRXaW5kb3coZWxlbSkge1xuICAgICAgICByZXR1cm4gaXNXaW5kb3coZWxlbSkgPyBlbGVtIDogZWxlbS5ub2RlVHlwZSA9PT0gOSAmJiBlbGVtLmRlZmF1bHRWaWV3O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9mZnNldChlbGVtKSB7XG4gICAgICAgIHZhciBkb2NFbGVtLCB3aW4sXG4gICAgICAgICAgICBib3ggPSB7dG9wOiAwLCBsZWZ0OiAwfSxcbiAgICAgICAgICAgIGRvYyA9IGVsZW0gJiYgZWxlbS5vd25lckRvY3VtZW50O1xuXG4gICAgICAgIGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgIT09IHR5cGVvZiB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgd2luID0gZ2V0V2luZG93KGRvYyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IGJveC50b3AgKyB3aW4ucGFnZVlPZmZzZXQgLSBkb2NFbGVtLmNsaWVudFRvcCxcbiAgICAgICAgICAgIGxlZnQ6IGJveC5sZWZ0ICsgd2luLnBhZ2VYT2Zmc2V0IC0gZG9jRWxlbS5jbGllbnRMZWZ0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29udmVydFN0eWxlKG9iaikge1xuICAgICAgICB2YXIgc3R5bGUgPSAnJztcblxuICAgICAgICBmb3IgKHZhciBhIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShhKSkge1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IChhICsgJzonICsgb2JqW2FdICsgJzsnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICB9XG5cbiAgICB2YXIgRWZmZWN0ID0ge1xuXG4gICAgICAgIC8vIEVmZmVjdCBkZWxheVxuICAgICAgICBkdXJhdGlvbjogNzUwLFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKGUsIGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgLy8gRGlzYWJsZSByaWdodCBjbGlja1xuICAgICAgICAgICAgaWYgKGUuYnV0dG9uID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50IHx8IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSByaXBwbGVcbiAgICAgICAgICAgIHZhciByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJpcHBsZS5jbGFzc05hbWUgPSAnd2F2ZXMtcmlwcGxlJztcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHJpcHBsZSk7XG5cbiAgICAgICAgICAgIC8vIEdldCBjbGljayBjb29yZGluYXRlIGFuZCBlbGVtZW50IHdpdGRoXG4gICAgICAgICAgICB2YXIgcG9zICAgICAgICAgPSBvZmZzZXQoZWwpO1xuICAgICAgICAgICAgdmFyIHJlbGF0aXZlWSAgID0gKGUucGFnZVkgLSBwb3MudG9wKTtcbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVggICA9IChlLnBhZ2VYIC0gcG9zLmxlZnQpO1xuICAgICAgICAgICAgdmFyIHNjYWxlICAgICAgID0gJ3NjYWxlKCcrKChlbC5jbGllbnRXaWR0aCAvIDEwMCkgKiAzKSsnKSc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFN1cHBvcnQgZm9yIHRvdWNoIGRldmljZXNcbiAgICAgICAgICAgIGlmICgndG91Y2hlcycgaW4gZSkge1xuICAgICAgICAgICAgICByZWxhdGl2ZVkgICA9IChlLnRvdWNoZXNbMF0ucGFnZVkgLSBwb3MudG9wKTtcbiAgICAgICAgICAgICAgcmVsYXRpdmVYICAgPSAoZS50b3VjaGVzWzBdLnBhZ2VYIC0gcG9zLmxlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBdHRhY2ggZGF0YSB0byBlbGVtZW50XG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdkYXRhLWhvbGQnLCBEYXRlLm5vdygpKTtcbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2NhbGUnLCBzY2FsZSk7XG4gICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdkYXRhLXgnLCByZWxhdGl2ZVgpO1xuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgcmVsYXRpdmVZKTtcblxuICAgICAgICAgICAgLy8gU2V0IHJpcHBsZSBwb3NpdGlvblxuICAgICAgICAgICAgdmFyIHJpcHBsZVN0eWxlID0ge1xuICAgICAgICAgICAgICAgICd0b3AnOiByZWxhdGl2ZVkrJ3B4JyxcbiAgICAgICAgICAgICAgICAnbGVmdCc6IHJlbGF0aXZlWCsncHgnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByaXBwbGUuY2xhc3NOYW1lID0gcmlwcGxlLmNsYXNzTmFtZSArICcgd2F2ZXMtbm90cmFuc2l0aW9uJztcbiAgICAgICAgICAgIHJpcHBsZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgY29udmVydFN0eWxlKHJpcHBsZVN0eWxlKSk7XG4gICAgICAgICAgICByaXBwbGUuY2xhc3NOYW1lID0gcmlwcGxlLmNsYXNzTmFtZS5yZXBsYWNlKCd3YXZlcy1ub3RyYW5zaXRpb24nLCAnJyk7XG5cbiAgICAgICAgICAgIC8vIFNjYWxlIHRoZSByaXBwbGVcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctd2Via2l0LXRyYW5zZm9ybSddID0gc2NhbGU7XG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLW1vei10cmFuc2Zvcm0nXSA9IHNjYWxlO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy1tcy10cmFuc2Zvcm0nXSA9IHNjYWxlO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy1vLXRyYW5zZm9ybSddID0gc2NhbGU7XG4gICAgICAgICAgICByaXBwbGVTdHlsZS50cmFuc2Zvcm0gPSBzY2FsZTtcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlLm9wYWNpdHkgICA9ICcxJztcblxuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJy13ZWJraXQtdHJhbnNpdGlvbi1kdXJhdGlvbiddID0gRWZmZWN0LmR1cmF0aW9uICsgJ21zJztcbiAgICAgICAgICAgIHJpcHBsZVN0eWxlWyctbW96LXRyYW5zaXRpb24tZHVyYXRpb24nXSAgICA9IEVmZmVjdC5kdXJhdGlvbiArICdtcyc7XG4gICAgICAgICAgICByaXBwbGVTdHlsZVsnLW8tdHJhbnNpdGlvbi1kdXJhdGlvbiddICAgICAgPSBFZmZlY3QuZHVyYXRpb24gKyAnbXMnO1xuICAgICAgICAgICAgcmlwcGxlU3R5bGVbJ3RyYW5zaXRpb24tZHVyYXRpb24nXSAgICAgICAgID0gRWZmZWN0LmR1cmF0aW9uICsgJ21zJztcblxuICAgICAgICAgICAgcmlwcGxlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBjb252ZXJ0U3R5bGUocmlwcGxlU3R5bGUpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoaWRlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBUb3VjaEhhbmRsZXIudG91Y2h1cChlKTtcblxuICAgICAgICAgICAgdmFyIGVsID0gdGhpcztcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsLmNsaWVudFdpZHRoICogMS40O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHZXQgZmlyc3QgcmlwcGxlXG4gICAgICAgICAgICB2YXIgcmlwcGxlID0gbnVsbDtcbiAgICAgICAgICAgIHZhciByaXBwbGVzID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2F2ZXMtcmlwcGxlJyk7XG4gICAgICAgICAgICBpZiAocmlwcGxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmlwcGxlID0gcmlwcGxlc1tyaXBwbGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVggICA9IHJpcHBsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpO1xuICAgICAgICAgICAgdmFyIHJlbGF0aXZlWSAgID0gcmlwcGxlLmdldEF0dHJpYnV0ZSgnZGF0YS15Jyk7XG4gICAgICAgICAgICB2YXIgc2NhbGUgICAgICAgPSByaXBwbGUuZ2V0QXR0cmlidXRlKCdkYXRhLXNjYWxlJyk7XG5cbiAgICAgICAgICAgIC8vIEdldCBkZWxheSBiZWV0d2VlbiBtb3VzZWRvd24gYW5kIG1vdXNlIGxlYXZlXG4gICAgICAgICAgICB2YXIgZGlmZiA9IERhdGUubm93KCkgLSBOdW1iZXIocmlwcGxlLmdldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJykpO1xuICAgICAgICAgICAgdmFyIGRlbGF5ID0gMzUwIC0gZGlmZjtcblxuICAgICAgICAgICAgaWYgKGRlbGF5IDwgMCkge1xuICAgICAgICAgICAgICAgIGRlbGF5ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRmFkZSBvdXQgcmlwcGxlIGFmdGVyIGRlbGF5XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RvcCc6IHJlbGF0aXZlWSsncHgnLFxuICAgICAgICAgICAgICAgICAgICAnbGVmdCc6IHJlbGF0aXZlWCsncHgnLFxuICAgICAgICAgICAgICAgICAgICAnb3BhY2l0eSc6ICcwJyxcblxuICAgICAgICAgICAgICAgICAgICAvLyBEdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2l0aW9uLWR1cmF0aW9uJzogRWZmZWN0LmR1cmF0aW9uICsgJ21zJyxcbiAgICAgICAgICAgICAgICAgICAgJy1tb3otdHJhbnNpdGlvbi1kdXJhdGlvbic6IEVmZmVjdC5kdXJhdGlvbiArICdtcycsXG4gICAgICAgICAgICAgICAgICAgICctby10cmFuc2l0aW9uLWR1cmF0aW9uJzogRWZmZWN0LmR1cmF0aW9uICsgJ21zJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24tZHVyYXRpb24nOiBFZmZlY3QuZHVyYXRpb24gKyAnbXMnLFxuICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgJy1tb3otdHJhbnNmb3JtJzogc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICctbXMtdHJhbnNmb3JtJzogc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICctby10cmFuc2Zvcm0nOiBzY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6IHNjYWxlLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByaXBwbGUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGNvbnZlcnRTdHlsZShzdHlsZSkpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKHJpcHBsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgRWZmZWN0LmR1cmF0aW9uKTtcbiAgICAgICAgICAgIH0sIGRlbGF5KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBMaXR0bGUgaGFjayB0byBtYWtlIDxpbnB1dD4gY2FuIHBlcmZvcm0gd2F2ZXMgZWZmZWN0XG4gICAgICAgIHdyYXBJbnB1dDogZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGEgPSAwOyBhIDwgZWxlbWVudHMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50c1thXTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGlucHV0IGFscmVhZHkgaGF2ZSBwYXJlbnQganVzdCBwYXNzIHRocm91Z2hcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpJyAmJiBwYXJlbnQuY2xhc3NOYW1lLmluZGV4T2YoJ3dhdmVzLWVmZmVjdCcpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBQdXQgZWxlbWVudCBjbGFzcyBhbmQgc3R5bGUgdG8gdGhlIHNwZWNpZmllZCBwYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lICsgJyB3YXZlcy1pbnB1dC13cmFwcGVyJztcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudFN0eWxlID0gZWwuZ2V0QXR0cmlidXRlKCdzdHlsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50U3R5bGUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsIGVsZW1lbnRTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBlbC5jbGFzc05hbWUgPSAnd2F2ZXMtYnV0dG9uLWlucHV0JztcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFB1dCBlbGVtZW50IGFzIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQod3JhcHBlciwgZWwpO1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBEaXNhYmxlIG1vdXNlZG93biBldmVudCBmb3IgNTAwbXMgZHVyaW5nIGFuZCBhZnRlciB0b3VjaFxuICAgICAqL1xuICAgIHZhciBUb3VjaEhhbmRsZXIgPSB7XG4gICAgICAgIC8qIHVzZXMgYW4gaW50ZWdlciByYXRoZXIgdGhhbiBib29sIHNvIHRoZXJlJ3Mgbm8gaXNzdWVzIHdpdGhcbiAgICAgICAgICogbmVlZGluZyB0byBjbGVhciB0aW1lb3V0cyBpZiBhbm90aGVyIHRvdWNoIGV2ZW50IG9jY3VycmVkXG4gICAgICAgICAqIHdpdGhpbiB0aGUgNTAwbXMuIENhbm5vdCBtb3VzZXVwIGJldHdlZW4gdG91Y2hzdGFydCBhbmRcbiAgICAgICAgICogdG91Y2hlbmQsIG5vciBpbiB0aGUgNTAwbXMgYWZ0ZXIgdG91Y2hlbmQuICovXG4gICAgICAgIHRvdWNoZXM6IDAsXG4gICAgICAgIGFsbG93RXZlbnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBhbGxvdyA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xuICAgICAgICAgICAgICAgIFRvdWNoSGFuZGxlci50b3VjaGVzICs9IDE7IC8vcHVzaFxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICd0b3VjaGVuZCcgfHwgZS50eXBlID09PSAndG91Y2hjYW5jZWwnKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFRvdWNoSGFuZGxlci50b3VjaGVzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG91Y2hIYW5kbGVyLnRvdWNoZXMgLT0gMTsgLy9wb3AgYWZ0ZXIgNTAwbXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgVG91Y2hIYW5kbGVyLnRvdWNoZXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgYWxsb3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFsbG93O1xuICAgICAgICB9LFxuICAgICAgICB0b3VjaHVwOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBUb3VjaEhhbmRsZXIuYWxsb3dFdmVudChlKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIERlbGVnYXRlZCBjbGljayBoYW5kbGVyIGZvciAud2F2ZXMtZWZmZWN0IGVsZW1lbnQuXG4gICAgICogcmV0dXJucyBudWxsIHdoZW4gLndhdmVzLWVmZmVjdCBlbGVtZW50IG5vdCBpbiBcImNsaWNrIHRyZWVcIlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFdhdmVzRWZmZWN0RWxlbWVudChlKSB7XG4gICAgICAgIGlmIChUb3VjaEhhbmRsZXIuYWxsb3dFdmVudChlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuXG4gICAgICAgIHdoaWxlICh0YXJnZXQucGFyZW50RWxlbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkgJiYgdGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCd3YXZlcy1lZmZlY3QnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3YXZlcy1lZmZlY3QnKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1YmJsZSB0aGUgY2xpY2sgYW5kIHNob3cgZWZmZWN0IGlmIC53YXZlcy1lZmZlY3QgZWxlbSB3YXMgZm91bmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaG93RWZmZWN0KGUpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBnZXRXYXZlc0VmZmVjdEVsZW1lbnQoZSk7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIEVmZmVjdC5zaG93KGUsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIEVmZmVjdC5oaWRlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIEVmZmVjdC5oaWRlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIEVmZmVjdC5oaWRlLCBmYWxzZSk7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBFZmZlY3QuaGlkZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgV2F2ZXMuZGlzcGxheUVmZmVjdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgaWYgKCdkdXJhdGlvbicgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgRWZmZWN0LmR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9XcmFwIGlucHV0IGluc2lkZSA8aT4gdGFnXG4gICAgICAgIEVmZmVjdC53cmFwSW5wdXQoJCQoJy53YXZlcy1lZmZlY3QnKSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzaG93RWZmZWN0LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2hvd0VmZmVjdCwgZmFsc2UpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggV2F2ZXMgdG8gYW4gaW5wdXQgZWxlbWVudCAob3IgYW55IGVsZW1lbnQgd2hpY2ggZG9lc24ndFxuICAgICAqIGJ1YmJsZSBtb3VzZXVwL21vdXNlZG93biBldmVudHMpLlxuICAgICAqICAgSW50ZW5kZWQgdG8gYmUgdXNlZCB3aXRoIGR5bmFtaWNhbGx5IGxvYWRlZCBmb3Jtcy9pbnB1dHMsIG9yXG4gICAgICogd2hlcmUgdGhlIHVzZXIgZG9lc24ndCB3YW50IGEgZGVsZWdhdGVkIGNsaWNrIGhhbmRsZXIuXG4gICAgICovXG4gICAgV2F2ZXMuYXR0YWNoID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvL0ZVVFVSRTogYXV0b21hdGljYWxseSBhZGQgd2F2ZXMgY2xhc3NlcyBhbmQgYWxsb3cgdXNlcnNcbiAgICAgICAgLy8gdG8gc3BlY2lmeSB0aGVtIHdpdGggYW4gb3B0aW9ucyBwYXJhbT8gRWcuIGxpZ2h0L2NsYXNzaWMvYnV0dG9uXG4gICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgRWZmZWN0LndyYXBJbnB1dChbZWxlbWVudF0pO1xuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNob3dFZmZlY3QsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2hvd0VmZmVjdCwgZmFsc2UpO1xuICAgIH07XG5cbiAgICB3aW5kb3cuV2F2ZXMgPSBXYXZlcztcbn0pKHdpbmRvdyk7XG4iLCIvKipcbiAqIGFuZ3VsYXItbG9ja2VyXG4gKlxuICogQSBzaW1wbGUgJiBjb25maWd1cmFibGUgYWJzdHJhY3Rpb24gZm9yIGxvY2FsL3Nlc3Npb24gc3RvcmFnZSBpbiBhbmd1bGFyIHByb2plY3RzLlxuICpcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS90eW1vbmRlc2lnbnMvYW5ndWxhci1sb2NrZXJcbiAqIEBhdXRob3IgU2VhbiBUeW1vbiBAdHltb25kZXNpZ25zXG4gKiBAbGljZW5zZSBNSVQgTGljZW5zZSwgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqL1xuXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeShyb290LmFuZ3VsYXIpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdC5hbmd1bGFyIHx8ICh3aW5kb3cgJiYgd2luZG93LmFuZ3VsYXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KHJvb3QuYW5ndWxhcik7XG4gICAgfVxufSkodGhpcywgZnVuY3Rpb24gKGFuZ3VsYXIpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyLWxvY2tlcicsIFtdKVxuXG4gICAgLnByb3ZpZGVyKCdsb2NrZXInLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHZhbHVlIGlzIGEgZnVuY3Rpb24gdGhlbiBleGVjdXRlLCBvdGhlcndpc2UgcmV0dXJuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge01peGVkfSAgdmFsdWVcbiAgICAgICAgICogQHBhcmFtICB7TWl4ZWR9ICBwYXJhbWV0ZXJcbiAgICAgICAgICogQHJldHVybiB7TWl4ZWR9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlLCBwYXJhbSkge1xuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZShwYXJhbSkgOiB2YWx1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBrZXkgb2YgYW4gb2JqZWN0IGJ5IHRoZSB2YWx1ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICBvYmplY3RcbiAgICAgICAgICogQHBhcmFtICB7TWl4ZWR9ICAgdmFsdWVcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9rZXlCeVZhbCA9IGZ1bmN0aW9uIChvYmplY3QsIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gb2JqZWN0W2tleV0gPT09IHZhbHVlOyB9KVswXTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVHJpZ2dlciBhbiBlcnJvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBtc2dcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfZXJyb3IgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1thbmd1bGFyLWxvY2tlcl0gJyArIG1zZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgZGVmYXVsdHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGRyaXZlcjogJ2xvY2FsJyxcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ2xvY2tlcicsXG4gICAgICAgICAgICBldmVudHNFbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgc2VwYXJhdG9yOiAnLidcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEFsbG93IHNldHRpbmcgb2YgZGVmYXVsdCBzdG9yYWdlIGRyaXZlciB2aWEgYGxvY2tlclByb3ZpZGVyYFxuICAgICAgICAgICAgICogZS5nLiBsb2NrZXJQcm92aWRlci5zZXREZWZhdWx0RHJpdmVyKCdzZXNzaW9uJyk7XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfEZ1bmN0aW9ufSAgZHJpdmVyXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtzZWxmfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZXREZWZhdWx0RHJpdmVyOiBmdW5jdGlvbiAoZHJpdmVyKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMuZHJpdmVyID0gX3ZhbHVlKGRyaXZlcik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogR2V0IHRoZSBkZWZhdWx0IGRyaXZlclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RGVmYXVsdERyaXZlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0cy5kcml2ZXI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEFsbG93IHNldHRpbmcgb2YgZGVmYXVsdCBuYW1lc3BhY2UgdmlhIGBsb2NrZXJQcm92aWRlcmBcbiAgICAgICAgICAgICAqIGUuZy4gbG9ja2VyUHJvdmlkZXIuc2V0RGVmYXVsdE5hbWVzcGFjZSgnbXlBcHBOYW1lJyk7XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfEZ1bmN0aW9ufSAgbmFtZXNwYWNlXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtzZWxmfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZXREZWZhdWx0TmFtZXNwYWNlOiBmdW5jdGlvbiAobmFtZXNwYWNlKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMubmFtZXNwYWNlID0gX3ZhbHVlKG5hbWVzcGFjZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogR2V0IHRoZSBkZWZhdWx0IG5hbWVzcGFjZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RGVmYXVsdE5hbWVzcGFjZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0cy5uYW1lc3BhY2U7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFNldCB3aGV0aGVyIHRoZSBldmVudHMgYXJlIGVuYWJsZWRcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcGFyYW0gIHtCb29sZWFufEZ1bmN0aW9ufSAgZW5hYmxlZFxuICAgICAgICAgICAgICogQHJldHVybiB7c2VsZn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2V0RXZlbnRzRW5hYmxlZDogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0cy5ldmVudHNFbmFibGVkID0gX3ZhbHVlKGVuYWJsZWQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldCB3aGV0aGVyIHRoZSBldmVudHMgYXJlIGVuYWJsZWRcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRFdmVudHNFbmFibGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRzLmV2ZW50c0VuYWJsZWQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFNldCB0aGUgc2VwYXJhdG9yIHRvIHVzZSB3aXRoIG5hbWVzcGFjZSBpbiBrZXlzXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfEZ1bmN0aW9ufSBzZXBhcmF0b3JcbiAgICAgICAgICAgICAqIEByZXR1cm4ge3NlbGZ9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHNldFNlcGFyYXRvcjogZnVuY3Rpb24gKHNlcGFyYXRvcikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzLnNlcGFyYXRvciA9IF92YWx1ZShzZXBhcmF0b3IpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldCB0aGUgc2VwYXJhdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRTZXBhcmF0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdHMuc2VwYXJhdG9yO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgbG9ja2VyIHNlcnZpY2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJGdldDogWyckd2luZG93JywgJyRyb290U2NvcGUnLCAnJHBhcnNlJywgZnVuY3Rpb24gKCR3aW5kb3csICRyb290U2NvcGUsICRwYXJzZSkge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogRGVmaW5lIHRoZSBMb2NrZXIgY2xhc3NcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RvcmFnZX0gIGRyaXZlclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIExvY2tlciAoZHJpdmVyLCBuYW1lc3BhY2UpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogT3V0IG9mIHRoZSBib3ggZHJpdmVyc1xuICAgICAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyZWREcml2ZXJzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWw6ICR3aW5kb3cubG9jYWxTdG9yYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbjogJHdpbmRvdy5zZXNzaW9uU3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIFN0b3JhZ2UgaW5zdGFuY2UgZnJvbSB0aGUga2V5XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIGRyaXZlclxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdG9yYWdlfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZURyaXZlciA9IGZ1bmN0aW9uIChkcml2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIHRoaXMuX3JlZ2lzdGVyZWREcml2ZXJzLmhhc093blByb3BlcnR5KGRyaXZlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZXJyb3IoJ1RoZSBkcml2ZXIgXCInICsgZHJpdmVyICsgJ1wiIHdhcyBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RlcmVkRHJpdmVyc1tkcml2ZXJdO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGRyaXZlciBrZXkgKGxvY2FsL3Nlc3Npb24pIGJ5IHRoZSBTdG9yYWdlIGluc3RhbmNlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0b3JhZ2V9ICBkcml2ZXJcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVyaXZlRHJpdmVyID0gZnVuY3Rpb24gKGRyaXZlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9rZXlCeVZhbCh0aGlzLl9yZWdpc3RlcmVkRHJpdmVycywgZHJpdmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge1N0b3JhZ2V9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcml2ZXIgPSB0aGlzLl9yZXNvbHZlRHJpdmVyKGRyaXZlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzRW5hYmxlZCA9IGRlZmF1bHRzLmV2ZW50c0VuYWJsZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXBhcmF0b3IgPSBkZWZhdWx0cy5zZXBhcmF0b3I7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl93YXRjaGVycyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDaGVjayBicm93c2VyIHN1cHBvcnRcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9ibG9iL21hc3Rlci9mZWF0dXJlLWRldGVjdHMvc3RvcmFnZS9sb2NhbHN0b3JhZ2UuanMjTDM4LUw0N1xuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBkcml2ZXJcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNrU3VwcG9ydCA9IGZ1bmN0aW9uIChkcml2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHRoaXMuX3N1cHBvcnRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9ICdsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlRHJpdmVyKGRyaXZlciB8fCAnbG9jYWwnKS5zZXRJdGVtKGwsIGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlRHJpdmVyKGRyaXZlciB8fCAnbG9jYWwnKS5yZW1vdmVJdGVtKGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBwb3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwcG9ydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3VwcG9ydGVkO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBCdWlsZCB0aGUgc3RvcmFnZSBrZXkgZnJvbSB0aGUgbmFtc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldFByZWZpeCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIHRoaXMuX25hbWVzcGFjZSkgcmV0dXJuIGtleTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZSArIHRoaXMuX3NlcGFyYXRvciArIGtleTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVHJ5IHRvIGVuY29kZSB2YWx1ZSBhcyBqc29uLCBvciBqdXN0IHJldHVybiB0aGUgdmFsdWUgdXBvbiBmYWlsdXJlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge01peGVkfSAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7TWl4ZWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXJpYWxpemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIudG9Kc29uKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFRyeSB0byBwYXJzZSB2YWx1ZSBhcyBqc29uLCBpZiBpdCBmYWlscyB0aGVuIGl0IHByb2JhYmx5IGlzbid0IGpzb24gc28ganVzdCByZXR1cm4gaXRcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fFN0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Vuc2VyaWFsaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFRyaWdnZXIgYW4gZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAgbmFtZVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICBwYXlsb2FkXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudCA9IGZ1bmN0aW9uIChuYW1lLCBwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLl9ldmVudHNFbmFibGVkKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQobmFtZSwgYW5ndWxhci5leHRlbmQocGF5bG9hZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZlcjogdGhpcy5fZGVyaXZlRHJpdmVyKHRoaXMuX2RyaXZlciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB0aGlzLl9uYW1lc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEFkZCB0byBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TWl4ZWR9ICB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0SXRlbSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLl9jaGVja1N1cHBvcnQoKSkgX2Vycm9yKCdUaGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGxvY2FsU3RvcmFnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbGRWYWwgPSB0aGlzLl9nZXRJdGVtKGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJpdmVyLnNldEl0ZW0odGhpcy5fZ2V0UHJlZml4KGtleSksIHRoaXMuX3NlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9leGlzdHMoa2V5KSAmJiAhIGFuZ3VsYXIuZXF1YWxzKG9sZFZhbCwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50KCdsb2NrZXIuaXRlbS51cGRhdGVkJywgeyBrZXk6IGtleSwgb2xkVmFsdWU6IG9sZFZhbCwgbmV3VmFsdWU6IHZhbHVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50KCdsb2NrZXIuaXRlbS5hZGRlZCcsIHsga2V5OiBrZXksIHZhbHVlOiB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFsnUVVPVEFfRVhDRUVERURfRVJSJywgJ05TX0VSUk9SX0RPTV9RVU9UQV9SRUFDSEVEJywgJ1F1b3RhRXhjZWVkZWRFcnJvciddLmluZGV4T2YoZS5uYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2Vycm9yKCdUaGUgYnJvd3NlciBzdG9yYWdlIHF1b3RhIGhhcyBiZWVuIGV4Y2VlZGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2Vycm9yKCdDb3VsZCBub3QgYWRkIGl0ZW0gd2l0aCBrZXkgXCInICsga2V5ICsgJ1wiJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgZnJvbSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIGtleVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtNaXhlZH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldEl0ZW0gPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLl9jaGVja1N1cHBvcnQoKSkgX2Vycm9yKCdUaGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGxvY2FsU3RvcmFnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5zZXJpYWxpemUodGhpcy5fZHJpdmVyLmdldEl0ZW0odGhpcy5fZ2V0UHJlZml4KGtleSkpKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogRXhpc3RzIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9leGlzdHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLl9jaGVja1N1cHBvcnQoKSkgX2Vycm9yKCdUaGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGxvY2FsU3RvcmFnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZHJpdmVyLmhhc093blByb3BlcnR5KHRoaXMuX2dldFByZWZpeChfdmFsdWUoa2V5KSkpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBSZW1vdmUgZnJvbSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIGtleVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlSXRlbSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIHRoaXMuX2NoZWNrU3VwcG9ydCgpKSBfZXJyb3IoJ1RoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgbG9jYWxTdG9yYWdlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIHRoaXMuX2V4aXN0cyhrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcml2ZXIucmVtb3ZlSXRlbSh0aGlzLl9nZXRQcmVmaXgoa2V5KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50KCdsb2NrZXIuaXRlbS5mb3Jnb3R0ZW4nLCB7IGtleToga2V5IH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBEZWZpbmUgdGhlIHB1YmxpYyBhcGlcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgTG9ja2VyLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQWRkIGEgbmV3IGl0ZW0gdG8gc3RvcmFnZSAoZXZlbiBpZiBpdCBhbHJlYWR5IGV4aXN0cylcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7TWl4ZWR9ICBrZXlcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7TWl4ZWR9ICB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzZWxmfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcHV0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEga2V5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBfdmFsdWUoa2V5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChrZXksIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldEl0ZW0oa2V5LCBfdmFsdWUodmFsdWUsIHRoaXMuX2dldEl0ZW0oa2V5KSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQWRkIGFuIGl0ZW0gdG8gc3RvcmFnZSBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3RcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7TWl4ZWR9ICBrZXlcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7TWl4ZWR9ICB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgYWRkOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEgdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHV0KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFJldHJpZXZlIHRoZSBzcGVjaWZpZWQgaXRlbSBmcm9tIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfEFycmF5fSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge01peGVkfSAgZGVmXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge01peGVkfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoa2V5LCBkZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChrZXksIGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhcyhrKSkgaXRlbXNba10gPSB0aGlzLl9nZXRJdGVtKGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISB0aGlzLmhhcyhrZXkpKSByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMiA/IGRlZiA6IHZvaWQgMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldEl0ZW0oa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGl0ZW0gZXhpc3RzIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfEZ1bmN0aW9ufSAga2V5XG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBoYXM6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9leGlzdHMoa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUmVtb3ZlIHNwZWNpZmllZCBpdGVtKHMpIGZyb20gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtNaXhlZH0gIGtleVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmb3JnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IF92YWx1ZShrZXkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkubWFwKHRoaXMuX3JlbW92ZUl0ZW0sIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBSZXRyaWV2ZSB0aGUgc3BlY2lmaWVkIGl0ZW0gZnJvbSBzdG9yYWdlIGFuZCB0aGVuIHJlbW92ZSBpdFxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd8QXJyYXl9ICBrZXlcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7TWl4ZWR9ICBkZWZcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7TWl4ZWR9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBwdWxsOiBmdW5jdGlvbiAoa2V5LCBkZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KGtleSwgZGVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yZ2V0KGtleSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUmV0dXJuIGFsbCBpdGVtcyBpbiBzdG9yYWdlIHdpdGhpbiB0aGUgY3VycmVudCBuYW1lc3BhY2UvZHJpdmVyXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGFsbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGhpcy5fZHJpdmVyLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcGxpdCA9IGtleS5zcGxpdCh0aGlzLl9zZXBhcmF0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGxpdC5sZW5ndGggPiAxICYmIHNwbGl0WzBdID09PSB0aGlzLl9uYW1lc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BsaXQuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBzcGxpdC5qb2luKHRoaXMuX3NlcGFyYXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhcyhrZXkpKSBpdGVtc1trZXldID0gdGhpcy5nZXQoa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFJlbW92ZSBhbGwgaXRlbXMgc2V0IHdpdGhpbiB0aGUgY3VycmVudCBuYW1lc3BhY2UvZHJpdmVyXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3NlbGZ9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBjbGVhbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JnZXQoT2JqZWN0LmtleXModGhpcy5hbGwoKSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogRW1wdHkgdGhlIGN1cnJlbnQgc3RvcmFnZSBkcml2ZXIgY29tcGxldGVseS4gY2FyZWZ1bCBub3cuXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3NlbGZ9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJpdmVyLmNsZWFyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIHRvdGFsIG51bWJlciBvZiBpdGVtcyB3aXRoaW4gdGhlIGN1cnJlbnQgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0ludGVnZXJ9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBjb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuYWxsKCkpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQmluZCBhIHN0b3JhZ2Uga2V5IHRvIGEgJHNjb3BlIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gICRzY29wZVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBrZXlcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7TWl4ZWR9ICAgZGVmXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3NlbGZ9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBiaW5kOiBmdW5jdGlvbiAoJHNjb3BlLCBrZXksIGRlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoICRzY29wZS4kZXZhbChrZXkpICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcGFyc2Uoa2V5KS5hc3NpZ24oJHNjb3BlLCB0aGlzLmdldChrZXksIGRlZikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIHRoaXMuaGFzKGtleSkpIHRoaXMucHV0KGtleSwgZGVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2F0Y2hlcnNba2V5ICsgJHNjb3BlLiRpZF0gPSAkc2NvcGUuJHdhdGNoKGtleSwgZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChuZXdWYWwpKSBzZWxmLnB1dChrZXksIG5ld1ZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBhbmd1bGFyLmlzT2JqZWN0KCRzY29wZVtrZXldKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBVbmJpbmQgYSBzdG9yYWdlIGtleSBmcm9tIGEgJHNjb3BlIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gICRzY29wZVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBrZXlcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7c2VsZn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHVuYmluZDogZnVuY3Rpb24gKCRzY29wZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcGFyc2Uoa2V5KS5hc3NpZ24oJHNjb3BlLCB2b2lkIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JnZXQoa2V5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdhdGNoSWQgPSBrZXkgKyAkc2NvcGUuJGlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fd2F0Y2hlcnNbd2F0Y2hJZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBleGVjdXRlIHRoZSBkZS1yZWdpc3RyYXRpb24gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl93YXRjaGVyc1t3YXRjaElkXSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl93YXRjaGVyc1t3YXRjaElkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFNldCB0aGUgc3RvcmFnZSBkcml2ZXIgb24gYSBuZXcgaW5zdGFuY2UgdG8gZW5hYmxlIG92ZXJyaWRpbmcgZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSAgZHJpdmVyXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3NlbGZ9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBkcml2ZXI6IGZ1bmN0aW9uIChkcml2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlKGRyaXZlciwgdGhpcy5fbmFtZXNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHRoZSBjdXJyZW50bHkgc2V0IGRyaXZlclxuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdG9yYWdlfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZ2V0RHJpdmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZHJpdmVyO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBTZXQgdGhlIG5hbWVzcGFjZSBvbiBhIG5ldyBpbnN0YW5jZSB0byBlbmFibGUgb3ZlcnJpZGluZyBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7c2VsZn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogZnVuY3Rpb24gKG5hbWVzcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UodGhpcy5fZGVyaXZlRHJpdmVyKHRoaXMuX2RyaXZlciksIG5hbWVzcGFjZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEdldCB0aGUgY3VycmVudGx5IHNldCBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZ2V0TmFtZXNwYWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDaGVjayBicm93c2VyIHN1cHBvcnRcbiAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9ibG9iL21hc3Rlci9mZWF0dXJlLWRldGVjdHMvc3RvcmFnZS9sb2NhbHN0b3JhZ2UuanMjTDM4LUw0N1xuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBkcml2ZXJcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHN1cHBvcnRlZDogZnVuY3Rpb24gKGRyaXZlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoZWNrU3VwcG9ydChkcml2ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgYSBuZXcgaW5zdGFuY2Ugb2YgTG9ja2VyXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gIGRyaXZlclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7TG9ja2VyfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IGZ1bmN0aW9uIChkcml2ZXIsIG5hbWVzcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMb2NrZXIoZHJpdmVyLCBuYW1lc3BhY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIHJldHVybiB0aGUgZGVmYXVsdCBpbnN0YW5jZVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTG9ja2VyKGRlZmF1bHRzLmRyaXZlciwgZGVmYXVsdHMubmFtZXNwYWNlKTtcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=