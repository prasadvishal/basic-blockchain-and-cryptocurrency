/*
 * Author: Vishal
 * Date: 23rd Sept 2018
 * File: bc_example.js
 */


const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(senderAddress, receiverAddress, amount) {
        this.senderAddress = senderAddress;
        this.receiverAddress = receiverAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(createdDate, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.createdDate = createdDate;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    /*
     * Author : Vishal
     * Date: 23rd Sept 2018
     * computes hash of the current block by encrypting current block details.
     * @return: String 
     */
    calculateHash() {
        return SHA256(this.previousHash + this.createdDate + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    /*
     * Author : Vishal
     * Date: 23rd Sept 2018
     * computes hash with the difficulty by discovering a hash which starts with 'difficulty' no. of '0'.
     * @params: 
        1. difficulty: type=int, defines no. of '0' 
     */
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) { // comparing with string of '0' of length 'difficulty'
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }
}


class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 70;
    }

    /*
     * Author: Vishal
     * Date: 23rd Sept 2018
     * Method to create ad return first block (Genesus Block) of our blockchain
     * @return Block
     */
    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), [], "0");
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
            1. miningRewardAddress: String
    */
        minePendingTransactions(miningRewardAddress) {
            const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
            this.pendingTransactions.push(rewardTx);
    
            let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
            block.mineBlock(this.difficulty);
    
            console.log('Block successfully mined!');
            this.chain.push(block);
    
            this.pendingTransactions = [];
        }
    
        /*
            * Author: Vishal
            * Date: 23rd Sept 2018
            * Method to add a new Transaction in the Transaction pool.
            * @params: 
                1. transaction: Transaction
        */
        createTransaction(transaction) {
            this.pendingTransactions.push(transaction);
        }
    
    
        /*
            * Author: Vishal
            * Date: 23rd Sept 2018
            * Method to check the current Coin/WAllet balance of any user address.
            * @params: 
                1. address: String
        */
        getBalanceOfAddress(address) {
            let balance = 0;
    
            for (const block of this.chain) {
                for (const trans of block.transactions) {
                    if (trans.senderAddress === address) {
                        balance -= trans.amount;
                    }
    
                    if (trans.receiverAddress === address) {
                        balance += trans.amount;
                    }
                }
            }
    
            return balance;
        }

    /*
     * Author: Vishal
     * Date: 23rd Sept 2018
     * Method to validate blockchain by verifying current block's hash and verifying previous block's Hash.
     * @return : boolean
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
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
blockChain.createTransaction(new Transaction('Shukla Ji Ka Address', 'Suraj Sahab Ka Address', 100));
//console.log('\nPending Transactions: ', blockChain.pendingTransactions);
blockChain.createTransaction(new Transaction('Suraj Sahab Ka Address', 'Bhabhi Ji Ka Address', 50));
//console.log('\nPending Transactions: ', blockChain.pendingTransactions);
console.log('\n Mining First Transaction...');
blockChain.minePendingTransactions('Vishal Ka Address ');

console.log('\nBalance of Vishal is', blockChain.getBalanceOfAddress('Vishal Ka Address '));
console.log('\n Mining Second Transaction...');
blockChain.minePendingTransactions('Vishal Ka Address ');

console.log('\nBalance of Vishal is', blockChain.getBalanceOfAddress('Vishal Ka Address '));