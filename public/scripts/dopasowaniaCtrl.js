angular.module('myApp').controller('dopasowaniaCtrl', [
'$scope','$http','$timeout','$document',
function($scope,$http,$timeout,$document){
    
    $scope.currentLog;
   
    function updateLogs(){
        $http.get('/api/dopasowania/logs').then(success=>{
            $scope.logs = success.data;
        },error=>{
            console.log(error)
        })
    }
    updateLogs();
    
    $scope.logPreview = function(log){
        $http.get(`/api/dopasowania/logs/${log}`).then(success=>{
            $scope.currentlogDate=log;
            $scope.currentLog=success.data;
        },error=>{
            console.log(error)
        })
    }
    $scope.runMatches = function(e){
        $http.post(`/api/dopasowania/new/`).then(success=>{
            $(e.target).parent().before(`<div'>${success.data}</div>`)
            $(e.target).hide()
            $timeout(()=>{
                updateLogs();
                $scope.checkDate()
            },3000)
        },error=>{
            $(e.target).parent().before(`<div'>${error}</div>`)
        }) 
    };

    $scope.checkDate = function(){
        let current_date = new Date();

        let current_date_string = `${current_date.getFullYear()}_${('0' +(current_date.getMonth()+1)).slice(-2)}_${('0' +current_date.getDate()).slice(-2)}`

        return current_date_string;
    }
}]);