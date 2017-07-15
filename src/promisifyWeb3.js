module.exports = {
  promisify: function (web3) {
    // Pipes values from a Web3 callback.
    var callbackToResolve = function (resolve, reject) {
      return function (error, value) {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      };
    };

    // List synchronous functions masquerading as values.
    var syncGetters = {
      db: [],
      eth: [ "accounts", "blockNumber", "coinbase", "gasPrice", "hashrate",
        "mining", "protocolVersion", "syncing" ],
      net: [ "listening", "peerCount" ],
      personal: [ "listAccounts" ],
      shh: [],
      version: [ "ethereum", "network", "node", "whisper" ]
    };

    Object.keys(syncGetters).forEach(function(group) {
      Object.keys(web3[group]).forEach(function (method) {
        if (syncGetters[group].indexOf(method) > -1) {
          // Skip
        } else if (typeof web3[group][method] === "function") {
          web3[group][method + "Promise"] = function () {
            var args = arguments;
            return new Promise(function (resolve, reject) {
              args[args.length] = callbackToResolve(resolve, reject);
              args.length++;
              web3[group][method].apply(web3[group], args);
            });
          };
        }
      });
    });
  }
};
