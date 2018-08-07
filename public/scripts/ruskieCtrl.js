angular.module('myApp').controller('ruskieCtrl', [
    '$scope','$http','$timeout','$document',
    function($scope,$http,$timeout,$document){
        $scope.zdjecia = [];
        $scope.temparr = [];
        $http.get('/api/photoproducer').then(success=>{
            $scope.zdjecia = success.data;
            console.log($scope.zdjecia)
        },error=>{
            console.log(error)
        })
        $scope.checkh = function(elem){
            $scope.temparr.push(elem.sku)
            console.log($scope.temparr)
        }
    }]);