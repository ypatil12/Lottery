const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('Web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
  'loan organ control dignity strategy diet system prepare physical cargo cheese become',
  'https://rinkeby.infura.io/v3/2e4487b9399b4d7ab19a6f645cd20177'
);

const web3 = new Web3(provider);

// Make function for async promise
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Deploying from: ', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: '0x'+bytecode})
    .send({from: accounts[0]});

  // console.log(interface);
  console.log('Deployed to: ', result.options.address);
};
deploy();
