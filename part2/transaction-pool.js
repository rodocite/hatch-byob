"use strict";

var TransactionPool = Object.assign(module.exports,{
  pending: [],
  invalid: [],
  findTransaction: (txHash, collection) => {
    let result
    collection.forEach((tx) => {
      if (tx.hash === txHash) {
        result = tx
      }
    })

    return result
  },
  isPending: (hash) => this.findTransaction(hash, this.pending),
  isInvalid: (hash) => this.findTransaction(hash, this.invalid),
  accept: (transaction) => {
    if (!transaction.data) {
      this.invalid.push(transaction)
      return false
    }

    if (!this.isPending(transaction.hash) && !this.isInvalid(transaction.hash)) {
      this.pending.push(transaction)
      return true
    } else {
      this.invalid.push(transaction)
    }

    return false
  }
});