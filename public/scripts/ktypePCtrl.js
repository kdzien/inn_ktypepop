angular.module('myApp').controller('ktypePCtrl', [
'$scope','$http','$timeout','$document',
function($scope,$http,$timeout,$document){

	$scope.randomMeme;
	$http.get(`/api/randomMeme`, ).then(function (success){
		if(!$scope.randomMeme){
			$scope.randomMeme = success.data.toString();
		}
	},function (error){
		console.log(error)
	});
	var waitingmodal = document.getElementById("waiting-modal")
	var waitingbutton = document.getElementById("waiting-button");
	$scope.xmltemplate='';
	$scope.sqltemplate=''
	$scope.ktype_type='';
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
		if($scope.ktype_type.length==0){
				$scope.ktype_type='undefined'
		}
		if(!$scope.correctThings){
			showMessage("Nie wybrałeś rzeczy do poprawy")
		}else{
			waitingbutton.style.display="none";
			$http.get(`/api/corrects/${$scope.ktype_type}/${$scope.currentUser.dbtitle}/'${$scope.correctThings.join(",")}'`, ).then(function (success){
				waitingmodal.style.display = "none";
				$scope.corrects=success.data
				$scope.ktype_type=''
				waitingbutton.style.display="block";
			},function (error){
				waitingmodal.style.display = "none";
				waitingbutton.style.display="block";
				showMessage(error.data,10000)
			});
		}
		
	}
	$scope.chooseCorrect = function(correct,index){
		$scope.selected = index; 
		$http.get(`/api/xml_preview/${correct.ItemID}`).then(success=>{
			$scope.xml_preview=success.data.xml
			$scope.choosedCorrect = success.data.html;
			console.log($scope.choosedCorrect)
		},error=>{
			console.log(error)
		})
	}
	$scope.sendToDziobak = function(){
		$scope.message = "Wysyłanie..."
		waitingbutton.style.display = "none";
		waitingmodal.style.display = "block";
		$http.post(`/api/makejobs/${$scope.currentUserToSend.title}`).then(function (success){
			showMessage("Sprawdź dziobaka")
			waitingbutton.style.display = "block";
		},function (error){

		});
	}

	function showMessage(message,delay = 3000){
		$scope.message=message
		waitingmodal.style.display = "block";
	}
	$scope.hideMessage = function(){
		waitingmodal.style.display = "none";
		$scope.message="";
	}
}]);