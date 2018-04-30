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
    return SHA256(input).toString()
  }

  addBlock(data) {
    const blockchain = this.blocks

    if (!blockchain.length) {
      blockchain.push({
        index: 0,
        prevHash: undefined,
        hash: '000000',
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

  isValid() {
    let isValid = true

    if (this.blocks[0].hash !== '000000') {
      isValid = false
    }

    if (this.blocks[0].index > 0) {
      isValid = false
    }

    if (this.blocks.length === 1) {
      return isValid
    }

    this.blocks.forEach((block, index) => {
      if (block.hash !== SHA256(this.previousBlock())) {
        isValid = false
      }

      if (index !== block.index) {
        isValid = false
      }

      if (index > 1) {
        if (block.prevHash !== this.blocks[index - 1].hash) {
          isValid = false
        }
      }

      if (typeof block.data !== 'string') {
        isValid = false
      }
    })

    return isValid
  }

  print() {
    console.log(JSON.stringify(this.blocks))
  }
}

module.exports = Blockchain
