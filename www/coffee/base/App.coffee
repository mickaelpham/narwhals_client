# Ionic Starter App
# angular.module is a global place for creating, registering and retrieving Angular modules
# 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
# the 2nd parameter is an array of 'requires'
# 'starter.services' is found in services.js
# 'starter.controllers' is found in controllers.js
app = angular.module('narwhal', [
  'ionic'
  'narwhal.login'
  'narwhal.report'
  'narwhal.recurring'
  'ui.router'
])

app.run(($ionicPlatform, $rootScope) ->
  $ionicPlatform.ready ->
    console.log "Ready!"
    if window.cordova and window.cordova.plugins.Keyboard
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
    if window.StatusBar
      # org.apache.cordova.statusbar required
      StatusBar.styleDefault()


  $rootScope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
    console.log "Changed route to #{toState.url}"
    console.log "Changed route to #{toState.name}"
  $rootScope.$on '$stateChangeError', (event, toState, toParams, fromState, fromParams, error)->
    console.error 'Could not change state'
    console.error error
  $rootScope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams)->
    console.log 'Successfuly changed state'

)

app.config ($stateProvider, $urlRouterProvider) ->
  # Ionic uses AngularUI Router which uses the concept of states
  # Learn more here: https://github.com/angular-ui/ui-router
  # Set up the various states which the app can be in.
  # Each state's controller can be found in controllers.js
  $stateProvider.state('index',
    url: '/'
    controller: 'IndexController'
    templateUrl: 'templates/index.html')

  $urlRouterProvider.otherwise '/'


  return