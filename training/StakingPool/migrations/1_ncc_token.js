var NCCToken = artifacts.require("./NCCToken.sol");

module.exports = function (deployer) {
  deployer.deploy(NCCToken);
};
