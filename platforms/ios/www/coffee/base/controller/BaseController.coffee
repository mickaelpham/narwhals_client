# Base class for angular controllers, which eases the process of initialization and dependency injection.
# This approach is based on http://www.devign.me/angular-dot-js-coffeescript-controller-base-class
#
# The following example shows how to use it:
#
# someAppModule = angular.module 'someApp'
#
# class MyAwesomeController extends BaseController
#   # register the controller at our module
#   @register someAppModule
#   # dependencies to inject, will be available as member variable e.g. @$scope
#   @inject '$scope', '$http', 'MyService'
#   # called after instantiation if exists
#   initialize: ->
#     # init some stuff ...
#   submit: ->
#     # bound to $scope and usable in template automatically
#
# TODO: Add check to ensure $scope as dependency when one or more functions are defined as they are bound automatically
#
class @BaseController
  @register: (app, name) ->
    name ?= @name || @toString().match(/function\s*(.*?)\(/)?[1]
    app.controller name, @

  @inject: (args...) ->
    @$inject = args

  constructor: (args...) ->
    for key, index in @constructor.$inject
      @[key] = args[index]

    for key, fn of @constructor.prototype
      continue unless typeof fn is 'function'
      continue if key in ['constructor', 'initialize'] or key[0] is '_'
      @$scope[key] = fn.bind?(@) || _.bind(fn, @)

    @initialize?()