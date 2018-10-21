const { getLevelDBData, addLevelDBData } = require('./levelSandbox');


//update data for future testing purposes
function modifyData(key, value) {
	getLevelDBData(key).then(block => {
		let parsedBlock = JSON.parse(block);
		parsedBlock.body = value;
		addLevelDBData(key, JSON.stringify(parsedBlock));
	}).catch(error => {
		console.log(`Unable to change data for block #${key}`);
	});	
}