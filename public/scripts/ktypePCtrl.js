angular.module('myApp').controller('ktypePCtrl', [
'$scope','$http','$timeout','$document',
function($scope,$http,$timeout,$document){

	var waitingmodal = document.getElementById("waiting-modal")
	$scope.xmltemplate='';
	$scope.sqltemplate=''
	$scope.currentUser
	$scope.currentUserToSend=''
	$scope.message=''
	$scope.corrects;
	$scope.users=[
		{dbtitle:"owiewkiH",title:"Owiewki HEKO"},
		{dbtitle:"dywanyS",title:"Dywany S"},
		{dbtitle:"dywanyR",title:"Dywany R"},
		{dbtitle:"dywanyG",title:"Dywany G"},
		{dbtitle:"dywanyW",title:"Dywany W"},
		{dbtitle:"dywanyGR",title:"Dywany komplety GR"},
		{dbtitle:"ruryP",title:"Rury Polmo"},
		{dbtitle:"ruryPF",title:"Rura Polmo+Zawieszka"},
		{dbtitle:"ruryPP",title:"Rura Komplety"}
	]
	$http.get('/api/templates').then(success=>{
		$scope.xmltemplate=success.data[0].xml_template;
		$scope.sqltemplate=success.data[0].sql_template;
	},error=>{

	})

	$scope.chooseUser = function(user){
		$scope.currentUser=user;
	}
	$scope.previewOpen=false;
	$scope.openPreview = function(){
		$scope.previewOpen=true;
	}
	$scope.closePreview = function(){
		$scope.previewOpen=false;
	}
	$document.on("keydown", function(e) {
		if(e.originalEvent.keyCode===27){
			console.log(e.originalEvent.keyCode)
			$scope.closePreview()
		}
	});
	$scope.generateCorrects = function(){
		$scope.currentUserToSend=$scope.currentUser;
		$scope.choosedCorrect = '';
		$scope.selected= undefined;
		if(!$scope.currentUser){
			showMessage("Wybierz produkt")
			return;
		}
		waitingmodal.style.display = "block";
		$scope.message="Trwa generowanie"
		$http.post(`/api/corrects/${$scope.currentUser.dbtitle}`).then(function (success){
			waitingmodal.style.display = "none";
			$scope.corrects=success.data
		},function (error){
			waitingmodal.style.display = "none";
			showMessage(error.data,10000)
		});
	}
	$scope.chooseCorrect = function(correct,index){
		$scope.selected = index; 
		$http.get(`/api/xml_preview/${$scope.getLink(correct)}`).then(success=>{
			$scope.xml_preview=success.data
		},error=>{

		})
		$scope.choosedCorrect = correct;
		
	}
	$scope.getLink = function(correct){
		let link = correct.item_id.replace('<ItemID>','').replace('</ItemID>','')
		return link
	}
	$scope.sendToDziobak = function(){
		$scope.message = "Wysyłanie..."
		waitingmodal.style.display = "block";
		$http.post(`/api/makejobs/${$scope.currentUserToSend.title}`).then(function (success){
			showMessage("Sprawdź dziobaka")
		},function (error){

		});
	}

	function showMessage(message,delay = 3000){
		$scope.message=message
		waitingmodal.style.display = "block";
		$timeout( function(){
			waitingmodal.style.display = "none";
        }, delay );
	}
}]);