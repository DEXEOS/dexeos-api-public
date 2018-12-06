# DEXEOS-API Server

Current api version : ``2``

Current http endpoint: ``https://api.dexeos.io/v2/<endpoint>``

Current mqtt endpoint wss: ``wss://mqtt.dexeos.io/mqtt``

Current mqtt endpoint tcp: ``tcp://mqtt.dexeos.io:1883``

We recommend using mqtt is you wish to listen for changes instead of sending requests every few seconds to the http api endpoint. 

Content-Type: ``application/json``

# Keywords
``<code>`` means contract name e.g ``eosio.token``

``<symbol>`` means symbol in real caps e.g. ``EOS``

``<account>`` means eos account name e.g ``dexeoswallet``

# Constants
``<last_tx_type>`` => `` buy | sell ``

OrderHistory Status
``<status>`` => 
```
pending                     <still revisible> | 
partially_filled            <some amount has been filled> | 
complete                    <all amount has been filled> | 
cancelled_partially_filled  <cancelled but some amount was filled> | 
cancelled                   <cancelled and no amount was filled
```



# Place an order
Be careful when you place an order to buy, if total price have you must calculate with Math.ceil.

ex) if total_price is 0.00321 EOS, you must send 0.0033 EOS. You will get 9,000 PEN instead.

Place an order to buy
```javascript
const memo = {
  "type":"buy",
  "quantity":"1000",
  "price":"0.0001",
  "code":"betdicetoken",
  "symbol":"DICE"
};
eosjs.transfer("<your_eos_account>", "dexeoswallet", "0.1000 EOS", JSON.stringify(memo))
  .then(...)
  .catch(...);
```

Place an order to sell
```javascript
const memo = {
  "type":"sell",
  "quantity":"1000",
  "price":"0.0001",
  "code":"betdicetoken",
  "symbol":"DICE"
};
eosjs.transaction("betdicetoken", tr => {
  tr.transfer("<your_eos_account>", "dexeoswallet", "1000.0000 DICE", JSON.stringify(memo));
})
  .then(...)
  .catch(...);
```

# Token / Price List
summary is last 24 hours from current time.

All Tokens
``GET : /token``

One Token
``GET : /token/<code>::<symbol>``

Response
```
[ 
  {
    "pk"              :<Number>,
    "code"            :<String>,
    "symbol"          :<String>,
    "decimals"        :<Number>,
    "name"            :<String>,
    "summary":{
        "high"        :<Number>,
        "low"         :<Number>,
        "volume"      :<Number>,
        "volume_eos"  :<Number>,
        "percent"     :<Number>,
        "last_price"  :<Number>,
        "last_tx_type":<String>,
     }
    }
]
```

# Open Orders
ALL : ``GET: /order/<account>``

ONE TOKEN : ``GET /order/<account>/<code>::<symbol>``

Response
```
[
  {
    "pk"            :<Number>,
    "type"          :<String>,
    "block_num"     :<Number>,
    "tx_id"         :<String>,
    "from"          :<String>,
    "code"          :<String>,
    "symbol"        :<String>,
    "quantity"      :<Number>,  //total amount originally
    "amount"        :<Number>, //remaining amount not filled
    "per_eos"       :<Number>,
    "update_date"   :<String>,
    "register_date" :<String>
 }
]
```

# On Order Summary
``GET -  /onorder/<account>``

Response
```
[
  {
     "code"           :<String>,
     "symbol"         :<String>,
     "total_quantity" :<Number>
  }
]
```

# Order History
``GET - /orderhistory/<account>``

Response
```
[
  {
  "pk"              :<Number>,
  "type"            :<String>,
  "block_num"       :<Number>,
  "tx_id"           :<String>,
  "from"            :<String>,
  "code"            :<String>,
  "symbol"          :<String>,
  "quantity"        :<Number>,
  "amount"          :<Number>,
  "per_eos"         :<Number>,
  "update_date"     :<String>,
  "register_date"   :<String>,
  "status"          :<String>,
  "remain_amount"   :<Number>
  }
]
```

# Transaction History
ALL ``GET - /transaction/<account>``

ONE TOKEN ``GET - /transaction/<account>/<code>::<symbol>``

Response
```
[
  {
  "pk"                    :<Number>,
  "tx_id"                 :<String>,
  "sell_trade_pk"         :<Number>,
  "seller_account_name"   :<String>,
  "buy_trade_pk"          :<Number>,
  "buyer_account_name"    :<String>,
  "code"                  :<String>,
  "symbol"                :<String>,
  "quantity"              :<Number>,
  "per_eos"               :<Number>,
  "update_date"           :<String>,
  "register_date"         :<String>
  }
]
```

# MQTT Server - Realtime price and order change updates
We recommend to use this for all realtime updates instead of setTimeout on http endpoint

# On New Order
Endpoint : ``/global/<account>/order``

Response
```
    {
        "pk"            :<Number>,
        "type"          :<String>,
        "block_num"     :<Number>,
        "tx_id"         :<String>,
        "from"          :<String>,
        "code"          :<String>,
        "symbol"        :<String>,
        "quantity"      :<Number>,
        "amount"        :<Number>,
        "per_eos"       :<Number>,
        "update_date"   :<String>,
        "register_date" :<String>
    }
```

# On One Token Price change
Endpoint : ``/global/<code>::<token>/price``

Response
```
  {
    last_price: <Number>
  }
```

# On All Tokens Price Changes
Endpoint : ``/global/price``

Response
```
  [{
    code    : <String>,
    symbol  : <String>,
    summary:{
        last_price  : <Number>,
    },
  }]
```

# USDT
Endpoint : ``/global/usdt``

Response
```
{ 
  usdt: <Number> 
}
```


