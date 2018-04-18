angular.module('myApp').controller('NewsCtrl', [
'$scope','$http','$timeout','$document',
function($scope,$http,$timeout,$document){

    $scope.newsMessage=''
    $scope.products = [
        // {
    //     sku:"",marka:"",model:"",drzwi:0,rokod:0,rokdo:0,ot:"tak",wrong:false,messages:[]
    // }
    // ,
    {
        sku:"H9010300",marka:"Fiat",model:"Sorento",drzwi:2,rokod:1901,rokdo:2017,ot:"tak",wrong:false,messages:[]
    }
    // ,
    // {
    //     sku:"Hx1010300",marka:"Fiat",model:"Sorento",drzwi:2,rokod:1901,rokdo:2017,ot:"tak",wrong:false,messages:[]
    // }
]
    $scope.addNext = () =>{
        $scope.products.push({ sku:"",marka:"",model:"",drzwi:0,rokod:0,rokdo:0,ot:"tak",wrong:false,messages:[]})
        console.log($scope.products)
    }
    let badProducts=[];
    $scope.allProductsOK = false;
    $scope.validateproducts = () =>{
        $http.post(`/api/news/validate`,$scope.products).then(function (success){
            badProducts = success.data
            if(badProducts.length==0){
                $scope.allProductsOK=true;$scope.newsMessage="wszysto ok"
            }else{$scope.allProductsOK=false;}
            markWrongElements()
		},function (error){
            console.log(error)
		});
    }
    $scope.addproducts = () =>{
        $http.post(`/api/news/add`,$scope.products).then(function (success){
            $scope.newsMessage=success.data
		},function (error){
            console.log(error)
            badProducts = error.data
            if(badProducts.length==0){
                $scope.allProductsOK=true;
            }else{$scope.allProductsOK=false;}
            markWrongElements()
		});
    }
    function markWrongElements(){
        $scope.products.forEach(elem=>{
            elem.wrong=false;elem.messages=[]
        })
        badProducts.forEach(elem=>{
            $scope.products[elem.id].wrong=true;
            $scope.products[elem.id].messages=elem.messages
        })
    }
}]);