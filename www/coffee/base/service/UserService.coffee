app = angular.module 'narwhal'

app.factory 'User', ['$http', ($http) ->
  new class User
    constructor: ->

    login: (username, password) =>
      error = () =>
      request = $http.post 'https://nameless-scrubland-4785.herokuapp.com/v1/session/', {email: username, password: password }
      request

    getTransactions: (sessionToken) ->
      request = $http.get 'https://nameless-scrubland-4785.herokuapp.com/v1/transactions', { params: { session_token: sessionToken }}
      return request

    getSavings: (sessionToken, transactionId, frequency, timePeriod) ->
      url = 'https://nameless-scrubland-4785.herokuapp.com/v1/savings?session_token=' + sessionToken
      params =
        co_transaction_id: transactionId,
        frequency: 4
        time_period: timePeriod

      request = $http.post url, params
      return request
]