const assert = require('assert');
const ganache = require ('ganache-cli');
const Web3 = require('web3');
// Instance of Web3 constructor with ganache
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface, bytecode} = require('../compile');

let accounts;
let lottery;

beforeEach(async () =>{
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas: '1000000'});

  lottery.setProvider(provider)
});
describe('Lottery Test', ()=>{

  it('deploys contract', ()=>{
    assert.ok(lottery.options.address);
  });

  it('Allows One Account to enter', async() =>{
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({from: accounts[0]});
    assert.equal(accounts[0] , players[0]);
    assert.equal(1, players.length);
  });

  it('Allows Multiple Accounts to enter', async() =>{
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({from: accounts[0]});
    assert.equal(accounts[0] , players[0]);
    assert.equal(accounts[1] , players[1]);
    assert.equal(accounts[2] , players[2]);
    assert.equal(3, players.length);
  });

  it('Requires min ether to enter', async () =>{
    try{
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.001', 'ether')
      });
      //Throw an error if an error does not pop up
      assert(false);
    } catch (err){
      assert(err);
    }
  });

  it('Only manager can pick winner', async () => {
    try{
      await lottery.methods.pickWinner.send({
        from: accounts[1]
      });
      assert(false);
    } catch(err){
      assert(err);
    }
  });

  it('sends money to winner', async() => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({
      from:accounts[0]
    });

    const postBalance = await web3.eth.getBalance(accounts[0]);
    assert((postBalance - initialBalance) > web3.utils.toWei('.8', 'ether'));
    //Check that players array is reset
    const players = await lottery.methods.getPlayers().call({from: accounts[0]});
    assert.equal(0,players.length);
    //Check that balance of contract is reset
    const lotBalance = await web3.eth.getBalance(lottery.options.address);
    assert.equal(0, lotBalance);
  });
});
