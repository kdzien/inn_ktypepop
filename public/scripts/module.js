angular.module('myApp', ['ui.codemirror','ui.router']);

angular.module('myApp').filter('toTrusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);