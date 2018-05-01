"use strict";

var SHA256 = require("crypto-js/sha256");

const createTransactionHash = ({ data, timestamp }) => {
  const encapsulation = [data, timestamp].join(';')
  return SHA256(encapsulation).toString()
}

const createTransaction = (data) => {
  const timestamp = Date.now()

  return {
    hash: createTransactionHash({ data, timestamp }),
    data,
    timestamp
  }
}

const isValid = (transaction) => {
  if (!Boolean(transaction.data)) {
    return false
  }

  let isValid = true

  if (transaction.hash !== createTransactionHash(transaction)) {
    isValid = false
  }

  if (typeof transaction.data !== 'string') {
    isValid = false
  }

  return isValid
}

Object.assign(module.exports,{
  createTransactionHash,
  createTransaction,
  isValid
});

// Hints:
//
// createTransaction(..)
//
// isValid(..)
