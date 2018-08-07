// these two are standard modules, don't have to reinstall in the terminal
//Path gives cross platform compatibility
const path = require('path');
const fs = require('fs');
const solc = require('solc');

//Path to inbox.sol file - function makes sure works on unix and windows
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
// Read in contents of file at utf8 coding
const source = fs.readFileSync(lotteryPath, 'utf8');

// console.log(solc.compile(source, 1));
// Pass code into solidity compiler & export bytecote and ABI
module.exports = solc.compile(source, 1).contracts[':Lottery'];
