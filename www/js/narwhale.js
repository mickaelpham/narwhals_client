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
      return this.$scope.$broadcast('scroll.refreshComplete');
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
      return this.$scope.reports = [
        {
          name: 'MyReport'
        }
      ];
    };

    return ReportController;

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC5jb2ZmZWUiLCJjb250cm9sbGVyL0Jhc2VDb250cm9sbGVyLmNvZmZlZSIsInJlcG9ydC9SZXBvcnRNb2R1bGUuY29mZmVlIiwicmVjdXJyaW5nL1JlY3VycmluZ01vZHVsZS5jb2ZmZWUiLCJpbmRleC9jb250cm9sbGVyL0luZGV4Q29udHJvbGxlci5jb2ZmZWUiLCJyZXBvcnQvY29udHJvbGxlci9SZXBvcnRDb250cm9sbGVyLmNvZmZlZSIsInJlY3VycmluZy9jb250cm9sbGVyL1JlY3VycmluZ0NvbnRyb2xsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BO0FBQUEsTUFBQSxHQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsVUFBZixFQUEyQixDQUMvQixPQUQrQixFQUUvQixpQkFGK0IsRUFHL0Isb0JBSCtCLENBQTNCLENBQU4sQ0FBQTs7QUFBQSxFQU1BLEdBQUcsQ0FBQyxHQUFKLENBQVEsU0FBQyxjQUFELEVBQWlCLFVBQWpCLEdBQUE7QUFDTixJQUFBLGNBQWMsQ0FBQyxLQUFmLENBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixDQUFBLENBQUE7QUFHQSxNQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsSUFBbUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBN0M7QUFDRSxRQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF6QixDQUFrRCxJQUFsRCxDQUFBLENBREY7T0FIQTtBQUtBLE1BQUEsSUFBRyxNQUFNLENBQUMsU0FBVjtlQUVFLFNBQVMsQ0FBQyxZQUFWLENBQUEsRUFGRjtPQU5tQjtJQUFBLENBQXJCLENBQUEsQ0FBQTtBQUFBLElBVUEsVUFBVSxDQUFDLEdBQVgsQ0FBZSxtQkFBZixFQUFvQyxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFFBQWpCLEVBQTJCLFNBQTNCLEVBQXNDLFVBQXRDLEdB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QUZiO0lBQUEsQ0FIWixDQUFBOzsrQkFBQTs7S0FGZ0MsZUFGbEMsQ0FBQTtBQUFBIiwiZmlsZSI6Im5hcndoYWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIyBJb25pYyBTdGFydGVyIEFwcFxuIyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuIyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbiMgdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuIyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbiMgJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG5hcHAgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbGUnLCBbXG4gICdpb25pYydcbiAgJ25hcndoYWxlLnJlcG9ydCdcbiAgJ25hcndoYWxlLnJlY3VycmluZydcbl0pXG5cbmFwcC5ydW4oKCRpb25pY1BsYXRmb3JtLCAkcm9vdFNjb3BlKSAtPlxuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeSAtPlxuICAgIGNvbnNvbGUubG9nIFwiUmVhZHkhXCJcbiAgICAjIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAjIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiB3aW5kb3cuY29yZG92YSBhbmQgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZFxuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhciB0cnVlXG4gICAgaWYgd2luZG93LlN0YXR1c0JhclxuICAgICAgIyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KClcblxuICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlU3RhcnQnLCAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIC0+XG4gICAgY29uc29sZS5sb2cgXCJDaGFuZ2VkIHJvdXRlIHRvICN7dG9TdGF0ZS51cmx9XCJcbiAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZUVycm9yJywgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvciktPlxuICAgIGNvbnNvbGUuZXJyb3IgJ0NvdWxkIG5vdCBjaGFuZ2Ugc3RhdGUnXG4gICAgY29uc29sZS5lcnJvciBlcnJvclxuXG4pXG5cbmFwcC5jb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIC0+XG4gICMgSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gICMgTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgIyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAjIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaW5kZXgnLFxuICAgIHVybDogJy8nXG4gICAgY29udHJvbGxlcjogJ0luZGV4Q29udHJvbGxlcidcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9pbmRleC5odG1sJylcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlICcvJ1xuICByZXR1cm4iLCIjIEJhc2UgY2xhc3MgZm9yIGFuZ3VsYXIgY29udHJvbGxlcnMsIHdoaWNoIGVhc2VzIHRoZSBwcm9jZXNzIG9mIGluaXRpYWxpemF0aW9uIGFuZCBkZXBlbmRlbmN5IGluamVjdGlvbi5cbiMgVGhpcyBhcHByb2FjaCBpcyBiYXNlZCBvbiBodHRwOi8vd3d3LmRldmlnbi5tZS9hbmd1bGFyLWRvdC1qcy1jb2ZmZWVzY3JpcHQtY29udHJvbGxlci1iYXNlLWNsYXNzXG4jXG4jIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gdXNlIGl0OlxuI1xuIyBzb21lQXBwTW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ3NvbWVBcHAnXG4jXG4jIGNsYXNzIE15QXdlc29tZUNvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuIyAgICMgcmVnaXN0ZXIgdGhlIGNvbnRyb2xsZXIgYXQgb3VyIG1vZHVsZVxuIyAgIEByZWdpc3RlciBzb21lQXBwTW9kdWxlXG4jICAgIyBkZXBlbmRlbmNpZXMgdG8gaW5qZWN0LCB3aWxsIGJlIGF2YWlsYWJsZSBhcyBtZW1iZXIgdmFyaWFibGUgZS5nLiBAJHNjb3BlXG4jICAgQGluamVjdCAnJHNjb3BlJywgJyRodHRwJywgJ015U2VydmljZSdcbiMgICAjIGNhbGxlZCBhZnRlciBpbnN0YW50aWF0aW9uIGlmIGV4aXN0c1xuIyAgIGluaXRpYWxpemU6IC0+XG4jICAgICAjIGluaXQgc29tZSBzdHVmZiAuLi5cbiMgICBzdWJtaXQ6IC0+XG4jICAgICAjIGJvdW5kIHRvICRzY29wZSBhbmQgdXNhYmxlIGluIHRlbXBsYXRlIGF1dG9tYXRpY2FsbHlcbiNcbiMgVE9ETzogQWRkIGNoZWNrIHRvIGVuc3VyZSAkc2NvcGUgYXMgZGVwZW5kZW5jeSB3aGVuIG9uZSBvciBtb3JlIGZ1bmN0aW9ucyBhcmUgZGVmaW5lZCBhcyB0aGV5IGFyZSBib3VuZCBhdXRvbWF0aWNhbGx5XG4jXG5jbGFzcyBAQmFzZUNvbnRyb2xsZXJcbiAgQHJlZ2lzdGVyOiAoYXBwLCBuYW1lKSAtPlxuICAgIG5hbWUgPz0gQG5hbWUgfHwgQHRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uXFxzKiguKj8pXFwoLyk/WzFdXG4gICAgYXBwLmNvbnRyb2xsZXIgbmFtZSwgQFxuXG4gIEBpbmplY3Q6IChhcmdzLi4uKSAtPlxuICAgIEAkaW5qZWN0ID0gYXJnc1xuXG4gIGNvbnN0cnVjdG9yOiAoYXJncy4uLikgLT5cbiAgICBmb3Iga2V5LCBpbmRleCBpbiBAY29uc3RydWN0b3IuJGluamVjdFxuICAgICAgQFtrZXldID0gYXJnc1tpbmRleF1cblxuICAgIGZvciBrZXksIGZuIG9mIEBjb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICAgIGNvbnRpbnVlIHVubGVzcyB0eXBlb2YgZm4gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgY29udGludWUgaWYga2V5IGluIFsnY29uc3RydWN0b3InLCAnaW5pdGlhbGl6ZSddIG9yIGtleVswXSBpcyAnXydcbiAgICAgIEAkc2NvcGVba2V5XSA9IGZuLmJpbmQ/KEApIHx8IF8uYmluZChmbiwgQClcblxuICAgIEBpbml0aWFsaXplPygpIiwicmVwb3J0TW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25hcndoYWxlLnJlcG9ydCcsIFtdKVxuXG5yZXBvcnRNb2R1bGUuY29uZmlnICgkc3RhdGVQcm92aWRlciktPlxuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUoJ3JlcG9ydCcsXG4gICAgdXJsOiAnL3JlcG9ydC8nXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcmVwb3J0Lmh0bWwnXG4gICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInXG4gICkiLCJyZWN1cnJpbmdNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmFyd2hhbGUucmVjdXJyaW5nJywgW10pXG5cbnJlY3VycmluZ01vZHVsZS5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKS0+XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSgncmVjdXJyaW5nJyxcbiAgICB1cmw6ICcvcmVjdXJyaW5nLydcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZWN1cnJpbmcuaHRtbCdcbiAgICBjb250cm9sbGVyOiAnUmVjdXJyaW5nQ29udHJvbGxlcidcbiAgICByZXNvbHZlOlxuICAgICAgY3VycmVudFRyYW5zYWN0aW9uOiBbJyRyb290U2NvcGUnLCAoJHJvb3RTY29wZSktPlxuICAgICAgICByZXR1cm4gJHJvb3RTY29wZS5jdXJyZW50VHJhbnNhY3Rpb25cbiAgICAgIF1cbiAgKSIsImFwcCA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsZSdcblxuY2xhc3MgSW5kZXhDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXJcblxuICBAcmVnaXN0ZXIgYXBwXG4gIEBpbmplY3QgJyRzY29wZScsICckaHR0cCcsICckc3RhdGUnLCAnJHJvb3RTY29wZSdcblxuICBpbml0aWFsaXplOiAoKT0+XG4gICAgY29uc29sZS5sb2cgdGhpc1xuXG4gIHJlZnJlc2g6ICgpLT5cbiAgICBAbG9hZFRyYW5zYWN0aW9ucygpXG4gICAgQCRzY29wZS4kYnJvYWRjYXN0KCdzY3JvbGwucmVmcmVzaENvbXBsZXRlJylcblxuICBsb2FkVHJhbnNhY3Rpb25zOiAoKT0+XG4gICAgQCRzY29wZS50cmFuc2FjdGlvbnMgPSBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdBcmJ5cydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0F1IEJvbiBQYWluJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdCdWZmYWxvIFdpbGQgV2luZ3MnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0J1cmdlciBLaW5nJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdDYXJscyBKci4nXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0RhaXJ5IFF1ZWVuJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdEb21pbm9zIFBpenphJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdEdW5raW4gRG9udXRzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdIYXJkZWVzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdLRkMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ0xpdHRsZSBDYWVzYXJzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdMb25nIEpvaG4gU2lsdmVycydcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnTWNDYWbDqSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnTWNEb25hbGRzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdOYW5kb3MnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1BpenphIEh1dCdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnUm91bmQgVGFibGUgUGl6emEnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1NvbmljIERyaXZlLUluJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdTdGFyYnVja3MnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1N1YndheSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnVENCWSdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnVGltIEhvcnRvbnMnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG5cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1RhY28gQmVsbCdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnV2VuZHlzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXZW5keXMgU3VwYSBTdW5kYWVzJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXaGF0YWJ1cmdlcidcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcblxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnV2hpdGUgQ2FzdGxlJ1xuICAgICAgICBhbW91bnQ6IEBnZXRSYW5kb21BbW91bnQoKVxuXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdXaW5nc3RvcCdcbiAgICAgICAgYW1vdW50OiBAZ2V0UmFuZG9tQW1vdW50KClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdXaW5nU3RyZWUnXG4gICAgICAgIGFtb3VudDogQGdldFJhbmRvbUFtb3VudCgpXG4gICAgICB9XG4gICAgXVxuXG4gIGdldFJhbmRvbUFtb3VudDogKCk9PlxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDAwKSAvIDEwMFxuXG4gIHNob3dUcmFuc2FjdGlvbjogKHRyYW5zYWN0aW9uKS0+XG4gICAgQCRyb290U2NvcGUuY3VycmVudFRyYW5zYWN0aW9uID0gdHJhbnNhY3Rpb25cbiAgICBAJHN0YXRlLmdvKCdyZWN1cnJpbmcnKVxuXG4iLCJyZXBvcnRNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnbmFyd2hhbGUucmVwb3J0J1xuXG5jbGFzcyBSZXBvcnRDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXJcblxuICBAcmVnaXN0ZXIgcmVwb3J0TW9kdWxlXG4gIEBpbmplY3QgJyRzY29wZScsICckaHR0cCcsICckc2NvcGUnXG5cbiAgaW5pdGlhbGl6ZTogKCktPlxuICAgIEAkc2NvcGUucmVwb3J0cyA9IFt7XG4gICAgICBuYW1lOidNeVJlcG9ydCdcbiAgICB9XSIsInJlY3VycmluZ01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICduYXJ3aGFsZS5yZWN1cnJpbmcnXG5cbmNsYXNzIFJlY3VycmluZ0NvbnRyb2xsZXIgZXh0ZW5kcyBCYXNlQ29udHJvbGxlclxuXG4gIEByZWdpc3RlciByZWN1cnJpbmdNb2R1bGVcbiAgQGluamVjdCAnJHNjb3BlJywgJyRodHRwJywgJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnY3VycmVudFRyYW5zYWN0aW9uJ1xuXG4gIGluaXRpYWxpemU6ICgpLT5cbiAgICBAJHNjb3BlLmhlbGxvID0gXCJXb3JsZFwiXG4gICAgQCRzY29wZS50cmFuc2FjdGlvbiA9IEBjdXJyZW50VHJhbnNhY3Rpb25cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==