angular.module('myApp', ['ui.codemirror','ui.router','angular.filter']);

angular.module('myApp').filter('toTrusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);