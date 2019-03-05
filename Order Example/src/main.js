const Eos = require("eosjs");
const ScatterJS = require("scatterjs-core").default;
const ScatterEOS = require("scatterjs-plugin-eosjs").default;

const connectOption = { initTimeout: 10000 };

const options = {
  host: "eos.greymass.com",
  protocol: "https",
  port: 443,

  blockchain: "eos",
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
};

ScatterJS.plugins(new ScatterEOS());

ScatterJS.scatter
  .connect("DEXEOS Transfer Example", connectOption)
  .then(connected => {
    if (!connected) {
      console.log("Please install or unlock scatter first");
      return false;
    }

    const scatter = ScatterJS.scatter;
    const identityField = { accounts: [options] };

    scatter
      .getIdentity(identityField)
      .then(async () => {
        const account = scatter.identity.accounts.find(
          x => x.blockchain === "eos"
        );
        const scatterEOSOptions = { expireInSeconds: 60 };

        const eos = scatter.eos(options, Eos, scatterEOSOptions);
        const transactionOption = {
          authorization: [`${account.name}@${account.authority}`]
        };

        // SEE each functions code
        buyToken(account, eos, transactionOption);
        sellToken(account, eos, transactionOption);
      })
      .catch(error => {
        console.error(error);
      });
  })
  .catch(error => {
    console.error(error);
  });

function buyToken(account, eos, transactionOption) {
  const memo = {
    type: "buy",
    market: "eos", // <Market> type. "eos" or "cusd"

    quantity: "1000", // Amount of token
    price: "0.01", // the price

    code: "betdicetoken", // Token code to buy
    symbol: "DICE" // Token symbol name to buy
  };

  // eos market: eosio.token / CUSD market: stablecarbon
  // eos market symbol: EOS / CUSD market symbol: CUSD
  const marketCode = "eosio.token";
  const marketSymbol = "EOS";

  eos
    .transaction(marketCode, tr => {
      tr.transfer(
        account.name,
        "dexeoswallet",
        `0.1234 ${marketSymbol}`,
        JSON.stringify(memo),
        transactionOption
      );
    })
    .then(trx => {
      console.log(`Transaction ID: ${trx.transaction_id}`);
    })
    .catch(error => {
      console.error(error);
    });
}

function sellToken(account, eos, transactionOption) {
  const memo = {
    type: "sell",
    market: "eos", // <Market> type. "eos" or "cusd"

    quantity: "1.012", // Amount of token
    price: "1", // the price

    code: "betdicetoken", // Token code to sell
    symbol: "DICE" // Token symbol name to sell
  };

  eos
    .transaction(memo["code"], tr => {
      tr.transfer(
        account.name,
        "dexeoswallet",
        `${memo["quantity"]} ${memo["symbol"]}`,
        JSON.stringify(memo),
        transactionOption
      );
    })
    .then(trx => {
      console.log(`Transaction ID: ${trx.transaction_id}`);
    })
    .catch(error => {
      console.error(error);
    });
}

function cancelOrder(account, eos, transactionOption) {
  eos
    .transaction("dexeoswallet", tr => {
      tr.cancelorder({
        owner: account.name,
        tradepk: 123456 // trade_pk from your open orders
      });
    })
    .then(trx => {
      console.log(`Order cancelled`);
    })
    .catch(error => {
      console.error(error);
    });
}
