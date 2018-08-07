pragma solidity ^0.4.17;

contract Lottery{
  address public manager;
  address[] public players;
  address public winner;

  function Lottery() public payable{
      manager = msg.sender;
  }
  //Payable denotes the caller of function is sending ether
  function enter() public payable{
      require(msg.value > .01 ether);

      players.push(msg.sender);
  }

  function random() private view returns (uint){
      return uint(keccak256(block.difficulty, now, players));
  }

  function pickWinner() public restricted{
      uint index = random() % players.length;
      players[index].transfer(this.balance);
      winner = players[index];
      players = new address[](0);
  }

  function getPlayers() public view returns (address[]){
      return players;
  }

  modifier restricted() {
      require (msg.sender == manager);
      //Underscore is basically saying other code going here
      _;
  }
}
