"use strict";

var SHA256 = require("crypto-js/sha256");

class Blockchain {
  constructor(loadedBlockchain = []) {
    this.blocks = [...loadedBlockchain]
  }

  previousBlock() {
    return this.blocks[this.blocks.length - 1]
  }

  addBlock(data) {
    const blockchain = [...this.blocks]

    if (!blockchain.length) {
      blockchain.push({
        index: 0,
        prevHash: undefined,
        hash: '00000',
        data: data,
        timestamp: Date.now()
      })
    } else {
      blockchain.push({
        index: this.previousBlock().index + 1,
        prevHash: this.previousBlock().hash,
        hash: SHA256(data).toString(),
        data: data,
        timestamp: Date.now()
      })
    }

    console.log(blockchain)

    if (this.isValid(blockchain[blockchain.length - 1])) {
      this.blocks = this.blocks.concat(blockchain)
    }
  }

  isValid(newBlock) {
    if (!this.blocks.length) {
      return true
    }

    if (this.previousBlock().index + 1 !== newBlock.index) {
      console.log('index')
      return false
    } else if (this.previousBlock().hash !== newBlock.prevHash) {
      console.log('previousHash')
      return false
    } else if (SHA256(newBlock.data).toString() !== newBlock.hash && this.blocks.length > 2) {
      console.log('sha')
      return false
    }

    return true
  }
}

module.exports = Blockchain
