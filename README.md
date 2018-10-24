# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Setup

Clone or download the repository

Install dependencies
- npm install

## Testing

To test code:

1: Open a shell terminal and enter REPL. (Read-Evaluate-Print-Loop)
```
node
```
2: Load the test.js file inside the terminal.
```
.load test.js
```
3: Test file will instantiate a blockchain by the variable myBlockChain and 10 Test blocks will automatically be generated.

#### BlockChain Methods

1: To add a block: addBlock(newBlock)
```
This method MUST take a new instance of Block as the argument. 

Example: myBlockChain.addBlock(new Block('this is the block body'));
```
2: Get block height: getBlockHeight()
```
This method will return a promise. 

Example: myBlockChain.getBlockHeight().then(height => // whatever you want to do with the height );
```
3: Get a block: getBlock(blockHeight)
```
This method will take the height of a specific block as the argument and return a promise.

Example:  myBlockChain.getBlock(5).then(block => {
            // whatever you want to do with the block
          }).catch(error => console.log(error));
```
4: Validate a block: validateBlock(blockHeight)
```
This method will take the height of a specific block as the argument.

Example: myBlockChain.validateBlock(7);
```
5: Validate the entire blockchain: validateChain()
```
Example: myBlockChain.validateChain();
```

#### Mutate Block

1: In addition to blockchain methods. This file comes with a function to mutate the body of the block.
```
This method will take the height of the block as the first argument and new value for the body of the block as the second argument.

modifyData(blockHeight, value)

Example: modifyData(4, 'changing the body of the fourth block'))
```



