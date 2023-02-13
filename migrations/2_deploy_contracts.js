var Voting = artifacts.require("Votethereum.sol");
module.exports = function(deployer) {
  deployer.deploy(Voting, web3.utils.asciiToHex("An Ethereum Voting Application"), {gas: 4700000});
};

