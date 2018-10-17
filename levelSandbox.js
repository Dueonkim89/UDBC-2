/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
}

// Get data from levelDB with key
function getLevelDBData(key){
  db.get(key, function(err, value) {
    if (err) return console.log('Not found!', err);
    console.log('Value = ' + value);
  })
}

// Function rewritten as a promise.
// Use this method when we need to bring a specific block!
/*
function getLevelDBData(key){
	return new Promise((resolve, reject) => {
		db.get(key, function(err, value) {
			if (err) {
				reject('Not found!', err);
			} else {
				resolve(value);
			}		
		});
	})
} */

/*
//Get all data within LevelDB
function getLevelDB() {
	let array = [];
	db.createReadStream()
	  .on('data', function (data) {
		array.push(data);
	}).on('end', () => {
	// To sort the array in valid order.
	array.sort( (a,b) => {
		return parseInt(a.key) - parseInt(b.key);
	});		
	console.log(array);
	});
}*/

//Get data in a promise!
function getLevelDB() {
	return new Promise((resolve, reject) => {
		let array = [];
		db.createReadStream()
		  .on('data', function (data) {
			array.push(data);
		}).on('error', function (err) {
			reject(err);
		})	
		.on('end', () => {
		array.sort((a,b) => {
			return parseInt(a.key) - parseInt(b.key);
		})			
		resolve(array);
		});				
	});
}



// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
}

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

/*
(function theLoop (i) {
  setTimeout(function () {
    addDataToLevelDB('Testing data');
    if (--i) theLoop(i);
  }, 100);
})(10);

Testing to see how i is incremented...
function curiousTest() {
	let i = 0;
	db.createReadStream().on('data', function(data) {
		console.log(data);
		i++;
		console.log(i);
	}).on('close', function() {
          console.log(i);
    });
}
*/

module.exports = {
	getLevelDB,
	addDataToLevelDB
}