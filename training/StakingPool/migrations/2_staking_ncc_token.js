const fs = require("fs");
const contract = JSON.parse(
  fs.readFileSync("D:/Projects/BlockChainLearning/training/StakingPool/build/contracts/NCCToken.json", "utf8")
);

var StakingNCCToken = artifacts.require("./StakingNCCToken.sol");

module.exports = function (deployer) {
  deployer.deploy(StakingNCCToken, contract.networks[5777].address);
};
