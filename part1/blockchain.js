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

    if (this.isValid(blockchain[blockchain.length - 1])) {
      this.blocks = this.blocks.concat(blockchain)
    }
  }

  isValid(newBlock) {
    if (!this.blocks.length) {
      return true
    }

    if (this.previousBlock().index + 1 !== newBlock.index) {
      return false
    } else if (this.previousBlock().hash !== newBlock.prevHash) {
      return false
    } else if (SHA256(newBlock.data).toString() !== newBlock.hash && this.blocks.length > 2) {
      return false
    }

    return true
  }
}

module.exports = Blockchain
