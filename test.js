const { getLevelDBData, addLevelDBData } = require('./levelSandbox');
const { Blockchain } = require('./simpleChain');
const { Block } = require('./simpleBlock');

//update data for future testing purposes
function modifyData(key, value) {
	getLevelDBData(key).then(block => {
		let parsedBlock = JSON.parse(block);
		parsedBlock.body = value;
		addLevelDBData(key, JSON.stringify(parsedBlock));
		console.log('Block body has been changed');
	}).catch(error => {
		console.log(`Unable to change data for block #${key}`);
	});	
}

//create new instance of blockchain
const myBlockChain = new Blockchain();

(function theLoop (i) {
    setTimeout(function () {
        let blockTest = new Block("Test Block - " + (i + 1));
        myBlockChain.addBlock(blockTest);
        i++;
        if (i < 10) theLoop(i);
    }, 1000);
  })(0);
