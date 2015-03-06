reportModule = angular.module 'narwhale.report'

class ReportController extends BaseController

  @register reportModule
  @inject '$scope', '$http', '$scope'

  initialize: ()->
    @$scope.reports = [{
      name:'MyReport'
    }]