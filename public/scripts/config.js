angular.module('myApp').config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/ktypepoprawki")
        
    $stateProvider
            .state('ktypepoprawki',{
                url: "/ktypepoprawki",
                templateUrl: "../views/ktype.html",
                controller: "ktypePCtrl"
            })
            .state('nowosci', {
                url: "/nowosci",
                templateUrl: "../views/nowosci.html",
                controller: "NewsCtrl"
            })
            .state('dopasowania', {
                url: "/dopasowania",
                templateUrl: "../views/dopasowania.html",
                controller: "dopasowaniaCtrl"
            })
            .state('ruskie', {
                url: "/ruskie",
                templateUrl: "../views/ruskie_foto.html",
                controller: "ruskieCtrl"
            })
}]);