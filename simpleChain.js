/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const { getLevelDB, addDataToLevelDB, getLevelDBData } = require('./levelSandbox');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
	//use arrow func so we dont have to worry about 'this' binding to the callback func!
    this.chain = getLevelDB().then(dataSet => {
		//map the array to remove the key before we add as the chain.
		// Parse each index within array.
		this.chain = dataSet.map(block => JSON.parse(block.value));
		if (!dataSet.length) {
			this.createGenesisBlock();
		}		
	}).catch(error => {
	  console.log('Unable to load levelDB. Make sure you installed the level module');
	});	
  }
  
  //create genesis block
  createGenesisBlock() {
	this.addBlock(new Block("First block in the chain - Genesis block"));  
  }
  
  // Add new block
  addBlock(newBlock){
    // Block height
    newBlock.height = this.chain.length;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(this.chain.length>0){
      newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
  	this.chain.push(newBlock);
	//persist the data to levelDB. NOTE: MUST BE STRINGIFIED FIRST SO WE CAN PARSE LATER!
	addDataToLevelDB(JSON.stringify(newBlock));
  }
  
	// Get block height
    getBlockHeight(){
		getLevelDB().then(dataSet => {
			console.log(dataSet.length - 1);
		}).catch(error => {
			console.log('Unable to obtain block height');
		});
    }

    // get block
    getBlock(blockHeight){
		getLevelDBData(blockHeight).then(block => {
			console.log(JSON.parse(block));	
		}).catch(error => {
			console.log('Unable to obtain block');
		});			
    }
/*
    // validate block
    validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain(){
      let errorLog = [];
      for (var i = 0; i < this.chain.length-1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = this.chain[i].hash;
        let previousHash = this.chain[i+1].previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }*/
}
