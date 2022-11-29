module.exports = {
  networks: {
    loc_test_test: {
      network_id: "*",
      port: 7546,
      host: "127.0.0.1",
    },
    loc_private: {
      network_id: "*",
      port: 8545,
      host: "127.0.0.1",
      gas: 4700000,
    },
  },
  compilers: {
    solc: {
      version: "0.6.0",
    },
  },
};
