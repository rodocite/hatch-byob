"use strict";

var SHA256 = require("crypto-js/sha256");

class Blockchain {
  constructor(loadedBlockchain = []) {
    this.blocks = loadedBlockchain
  }

  previousBlock() {
    return this.blocks[this.blocks.length - 1]
  }

  createBlockHash(input) {
    const x = {
      prevHash: "000000",
      index: 1,
      data: "The power of a gun can kill",
      timestamp: 1523292008985,
    }

    return SHA256(x).toString()
  }

  addBlock(data) {
    const blockchain = this.blocks

    if (!blockchain.length) {
      blockchain.push({
        index: 0,
        prevHash: undefined,
        hash: '00000',
        data: data,
        timestamp: Date.now()
      })
    } else {
      const previousBlock = this.previousBlock()
      const prevHash =  previousBlock.hash
      const index = previousBlock.index + 1
      const timestamp = Date.now()

      blockchain.push({
        index,
        prevHash,
        hash: this.createBlockHash({prevHash, index, data, timestamp}),
        data,
        timestamp
      })
    }

    if (this.isBlockValid(blockchain[blockchain.length - 1])) {
      this.blocks = this.blocks.concat(blockchain)
    }
  }

  isBlockValid(newBlock) {
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

  print() {
    console.log(JSON.stringify(this.blocks))
  }
}

module.exports = Blockchain
