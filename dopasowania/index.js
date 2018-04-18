var exec = require('child_process').exec;

function solve(callback_error){

		exec('java -jar ./dopasowania/ktypeUpdater.jar ',
		function (error, stdout, stderr){
			if(error){
				console.log(error)
				callback_error(error);
			}
		});
}
module.exports.solve = solve;