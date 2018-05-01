"use strict";

var SHA256 = require("crypto-js/sha256");

const genesisBlock = {
  data: "genesis!",
  hash: "000000",
  index: 0,
  prevHash: undefined,
  timestamp: 1523291999654
}

class Blockchain {
  constructor(loadedBlockchain = [ genesisBlock ]) {
    this.blocks = loadedBlockchain
  }

  previousBlock() {
    return this.blocks[this.blocks.length - 1]
  }

  createBlockHash({ prevHash, index, data, timestamp }) {
    const encapsulated = [prevHash, index, data, timestamp].join(';')
    return SHA256(encapsulated).toString()
  }

  addBlock(data) {
    const previousBlock = this.previousBlock()
    const prevHash =  previousBlock.hash
    const index = previousBlock.index + 1
    const timestamp = Date.now()

    const block = {
      index,
      prevHash,
      hash: this.createBlockHash({ prevHash, index, data, timestamp }),
      data,
      timestamp
    }

    if (this.isBlockValid(block)) {
      this.blocks = this.blocks.concat(block)
    }
  }

  isBlockValid(newBlock) {
    const { prevHash, index, data, timestamp } = newBlock
    const blockHash = this.createBlockHash({ prevHash, index, data, timestamp })

    if (!this.blocks.length) {
      return false
    }

    if (this.previousBlock().index + 1 !== newBlock.index) {
      return false
    } else if (this.previousBlock().hash !== newBlock.prevHash) {
      return false
    } else if (blockHash !== newBlock.hash && this.blocks.length > 2) {
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
      if (index !== block.index) {
        isValid = false
      }

      if (typeof block.data !== 'string') {
        isValid = false
      }

      if (index > 0) {
        const blockHash = this.createBlockHash({
          prevHash: block.prevHash,
          index: index,
          data: block.data,
          timestamp: block.timestamp
        })

        if (block.hash !== blockHash) {
          isValid = false
        }
      }
    })

    return isValid
  }

  print() {
    console.log(JSON.stringify(this.blocks))
  }
}

module.exports = Blockchain
