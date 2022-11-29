app = await StakingPool.deployed()
accounts = await web3.eth.getAccounts()
app.stake(5, {from: accounts[3], value: web3.utils.toWei("10", "ether")})
app.withdraw({from: accounts[3]})


num = await app.getReward(accounts[3])





token = await NCCToken.deployed()
token.transfer(accounts[1], 100000)
token.transfer(accounts[2], 100000)
token.transfer(accounts[3], 100000)

token.transferFrom(accounts[0], accounts[1], 10000)


tokenPool = await StakingNCCToken.deployed()

tokenPool.stake(1000, 3, {from: accounts[0]})
tokenPool.stake(2000, 10, {from: accounts[1]})
tokenPool.stake(10000, 50, {from: accounts[2]})
