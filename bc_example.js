/*
 * Author: Vishal
 * Date: 23rd Sept 2018
 * File: bc_example.js
 */


const SHA256 = require("crypto-js/sha256"); // SHA256 is used for creating hashes for each block representing each transaction.

class Block { // Block defines each transaction.
    constructor(index, createdDate, data, previousHash = '') { // intialize Block
            this.index = index; // Index of each block in tha Blockchain.
            this.previousHash = previousHash; // Hash of the prevous block
            this.createdDate = createdDate; // Timestamp to authenticate date of transaction
            this.data = data; // Contains transaction details eg. sender's address, receiver's address, amount etc.
            this.hash = this.calculateHash(); // Hash of current block
        }
        /*
         * Author : Vishal
         * Date: 23rd Sept 2018
         * computes hash of the current block by encrypting current block details.
         * @return: String 
         */
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.createdDate + JSON.stringify(this.data)).toString();
    }
}


class Blockchain { // Blockchain reprents the current blockchain containing array of Blocks
    constructor() {
            this.chain = [this.createGenesisBlock()]; // Initiates the Blockchain with the Genenis Block
        }
        /*
         * Author: Vishal
         * Date: 23rd Sept 2018
         * Method to create ad return first block (Genesus Block) of our blockchain
         * @return Block
         */
    createGenesisBlock() {
        return new Block(0, (new Date).toString(), "Genesis block", "0"); // Parameters: index: 0, createdDate: current timestamp, data: 'Genesis Block', previousHash: 0
    }

    /*
     * Author: Vishal
     * Date: 23rd Sept 2018
     * Method to create first block (Genesus Block) of our blockchain
     * @return: Block
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /*
        * Author: Vishal
        * Date: 23rd Sept 2018
        * Method to add a new Block to our blockchain
        * @params: 
            1. newBlock: Block
    */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    /*
     * Author: Vishal
     * Date: 23rd Sept 2018
     * Method to validate blockchain by verifying current block's hash and verifying previous block's Hash.
     * @return : boolean
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) { // Skipped i=0?            
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) { // verify current stored Hash with re-calculated current Hash
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) { // validate previous Hash link.
                return false;
            }
        }

        return true;
    }

    /*
     * Author: Vishal
     * Date: 23rd Sept 2018
     * Method to print current blockchain.
     */
    printCurrentChain() {
        console.log(JSON.parse(JSON.stringify(blockChain)));
    }
}




let blockChain = new Blockchain();
blockChain.addBlock(new Block(1, (new Date).toString(), {
    sender: "Shukla Ji",
    receiver: "Suraj Sahab",
    amount: 100
}));
blockChain.addBlock(new Block(2, (new Date).toString(), {
    sender: "Suraj Sahab",
    receiver: "Bhabhi Ji",
    amount: 150
}));


console.log('Blockchain valid? ' + blockChain.isChainValid());
blockChain.printCurrentChain();
console.log(`


            [CHANGING A BLOCK]


    `);


blockChain.chain[1].data = {
    sender: "Shukla Ji",
    receiver: "Suraj Sahab",
    amount: 200
};
blockChain.chain[1].hash = blockChain.chain[1].calculateHash();
console.log("Blockchain valid? " + blockChain.isChainValid());
blockChain.printCurrentChain();