var sellEvent = app.LogSellArticle({}, {fromBlock: 0, toBlock: 'latest'}).watch(function(error, result) {console.log(result);});
