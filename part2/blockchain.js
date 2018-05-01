"use strict";

var SHA256 = require("crypto-js/sha256");

const genesisBlock= {
  data: "genesis!",
  hash: "000000",
  index: 0,
  prevHash: undefined,
  timestamp: 1523291999654
}

class Blockchain {
  constructor(chain = [ genesisBlock ]) {
    this.blocks = chain
  }

  containsTransaction(transactionHash) {
    let foundHash = false

    this.blocks.slice(1).forEach((block, index) => {
      return block.data.forEach((transaction) => {
        if (transaction.hash === transactionHash) {
          foundHash = block.hash
        }
      })
    })

    return foundHash
  }

  previousBlock() {
    return this.blocks[this.blocks.length - 1]
  }

  createBlockHash({ prevHash, index, data, timestamp }) {
    const encapsulated = [prevHash, index, JSON.stringify(data), timestamp].join(';')
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

    if (this.blockIsValid(block)) {
      this.blocks = this.blocks.concat(block)
      return block
    } else {
      return false
    }
  }

  transactionIsValid(transaction) {
    const createTransactionHash = ({ data, timestamp }) => {
      const encapsulation = [data, timestamp].join(';')
      return SHA256(encapsulation).toString()
    }

    return createTransactionHash(transaction) === transaction.hash
  }

  blockIsValid(newBlock) {
    let isValid = true
    const blockHash = this.createBlockHash(newBlock)

    if (this.previousBlock().index + 1 !== newBlock.index) {
      return false
    } else if (this.previousBlock().hash !== newBlock.prevHash) {
      return false
    } else if (blockHash !== newBlock.hash) {
      return false
    }

    if (newBlock.data) {
      newBlock.data.forEach((transaction) => {
        if (!this.transactionIsValid(transaction)) {
          isValid = false
        }
      })
    } else {
      return false
    }

    return isValid
  }

  isValid() {
    let isValid = true

    if (this.blocks[0].hash !== '000000' || this.blocks[0].index !== 0) {
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
        const blockHash = this.createBlockHash(block)

        if (block.hash !== blockHash) {
          isValid = false
        }
      }
    })

    return isValid
  }

  print() {
    console.log(this.blocks)
  }
}

module.exports = Blockchain
