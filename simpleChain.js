/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const { getLevelDB, addDataToLevelDB, getLevelDBData } = require('./levelSandbox');
const { Block } = require('./simpleBlock');

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    getLevelDB().then(dataSet => {
		//if levelDB is empty
		if (!dataSet.length) {
			this.createGenesisBlock();
		} 	
	}).catch(error => console.log('Unable to load levelDB. Make sure you installed the level module'));	
  }
  
  //create genesis block
  createGenesisBlock() {
	this.addBlock(new Block("First block in the chain - Genesis block"));  
  }
  
  // Add new block
  addBlock(newBlock){
	getLevelDB().then(dataSet => {  
		// Block height
		newBlock.height = dataSet.length;
		// UTC timestamp
		newBlock.time = new Date().getTime().toString().slice(0,-3);
		// previous block hash
		if(dataSet.length>0){
			//get previousblockHash
			let previousBlock = JSON.parse(dataSet[dataSet.length-1]);
			newBlock.previousBlockHash = previousBlock.hash;
		}
		// Block hash with SHA256 using newBlock and converting to a string
		newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
		//persist the data to levelDB. NOTE: MUST BE STRINGIFIED FIRST SO WE CAN PARSE LATER!
		addDataToLevelDB(JSON.stringify(newBlock));
	}).catch(error => console.log('Unable to load levelDB. Make sure you installed the level module'));			
  }
  
	// Get block height
    getBlockHeight(){
		getLevelDB().then(dataSet => {
			console.log(dataSet.length - 1);
		}).catch(error => console.log('Unable to obtain block height'));
    }

    // get block
    getBlock(blockHeight){
		getLevelDBData(blockHeight).then(block => {
			let parsedBlock = JSON.parse(block);
			console.log(parsedBlock);	
		}).catch(error => console.log(`Unable to obtain block #${blockHeight}`));			
    }

    // validate block
    validateBlock(blockHeight, chain=null){
		//if validating chain, return a promise
		if (chain) {
		  return getLevelDBData(blockHeight).then(block => {
			let parsedBlock = JSON.parse(block);
			// get block hash
			let blockHash = parsedBlock.hash;	  
			// remove block hash to test block integrity
			parsedBlock.hash = '';
			// generate block hash
			let validBlockHash = SHA256(JSON.stringify(parsedBlock)).toString();
			// Compare
			if (blockHash===validBlockHash) {
				return Promise.resolve(true);
			} else {
				return Promise.resolve(false);
			}				
		  }).catch(error => Promise.reject(`Block #${blockHeight} does not exist.`));	
		  //if only validating a block. dont return a promise.
		} else {
			getLevelDBData(blockHeight).then(block => {
				let parsedBlock = JSON.parse(block);
				// get block hash
				let blockHash = parsedBlock.hash;	  
				// remove block hash to test block integrity
				parsedBlock.hash = '';
				// generate block hash
				let validBlockHash = SHA256(JSON.stringify(parsedBlock)).toString();
				// Compare
				if (blockHash===validBlockHash) {
					console.log(`Block #${blockHeight} is valid`);
				} else {
					console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
				}				
			}).catch(error => console.log(`Block #${blockHeight} does not exist.`));				
		}
    }
	
   // Validate blockchain
    validateChain(){				
		let errorLog = [];
		let previousHash = null;
		//getlevelDB
		getLevelDB().then(dataSet => {
			let parsedDataSet = dataSet.map(eachBlock => JSON.parse(eachBlock));
			//iterate thru array, for each index pass validBlock function.
			for (let i = 0; i<parsedDataSet.length; i++) {
				this.validateBlock(i, 'chain').then(valid => {
					if (!valid) {
						errorLog.push(i);
					}
					let blockHash = parsedDataSet[i].hash;	
					if (i < parsedDataSet.length-1) {
						previousHash = parsedDataSet[i+1].previousBlockHash;
					}						
					if (previousHash && blockHash!==previousHash) {
						errorLog.push(i);
					}
					previousHash = null;
					if (i === parsedDataSet.length-1 && errorLog.length>0) {
						console.log(`Blockchain is invalid. These blocks were mutated: ${errorLog}`);
					} else if (i === parsedDataSet.length-1 && !errorLog.length) {
						console.log('Blockchain is valid. No mutations detected');
					}		
				}).catch(error => console.log(error));				
			}
		});	   	  	  	  	  
    }
}

module.exports = {
	Blockchain
}
