
Web3 = require('web3');

web3 = new Web3(new Web3.providers.HttpProvider("http://0.0.0.0:7545"));

accounts = await web3.eth.getAccounts()

const solc = require('solc');

const sourceCode = fs.readFileSync('Greetings.sol').toString();

const jsonCode = JSON.stringify({
    language: 'Solidity',
    sources: {
        'Task': {
            content: sourceCode
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            },
        },
    },
})

compiledCode = solc.compile(jsonCode);

abiContract = JSON.parse(compiledCode).contracts['Task']['Greetings'].abi;

greetingsContract = new web3.eth.Contract(abiContract);

byteCode = JSON.parse(compiledCode).contracts['Task']['Greetings'].evm.bytecode.object;

// greetingsCDeployed =  greetingsContract.new({data: '0x' + byteCode, from: web3.eth.accounts[0], gas: 4700000});

greetingsCDeployed =  await greetingsContract.deploy({data: byteCode, arguments: ['Hello World']}).send({from: accounts[0], gas: 4700000});

// greetingsInstance = greetingsContract.at(greetingsCDeployed.address);

// greetingsInstance = greetingsContract.at(greetingsCDeployed.options.address);

newContractInstance = new web3.eth.Contract(abiContract, greetingsCDeployed.options.address);

newContractInstance.methods.setMessage('Hello Thanh').send({from: accounts[0], gas: 4700000});

newContractInstance.methods.getMessage().call().then(console.log);

