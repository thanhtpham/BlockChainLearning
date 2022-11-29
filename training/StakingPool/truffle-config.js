module.exports = {
  networks: {
    ganache: {
      network_id: "*",
      port: 7654,
      host: "127.0.0.1"
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.17"
    }
  }
};
