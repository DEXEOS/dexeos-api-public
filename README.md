# DEXEOS Public API

API Version | ``3``
---- | ----
HTTP Endpoint | ``https://api.dexeos.io/v3/<endpoint>``
HTTP Endpoint (Chart) | ``https://chart.dexeos.io/<endpoint>``
MQTT Endpoint (WSS) | ``wss://mqtt.dexeos.io/mqtt``
MQTT Endpoint (TCP) | ``tcp://tcpmqtt.dexeos.io:1883``
Content-Type | ``application/json``

Korean documentation: [한국어 문서로 이동](./README-ko.md)

## Before you start
We recommend using mqtt is you wish to listen for changes instead of sending requests every few seconds to the http api endpoint. 

To prevent abuse of the API please note too many requests per second to the API will result in IP address getting blocked temporarily.

## DEXEOS embed trade API
If you want to embed DEXEOS trade page in your own dapp, use [DEXEOS embed trade API](https://github.com/DEXEOS/dexeos-embed-trade).

## Keywords

- ``<code>`` means contract name e.g ``eosio.token``
- ``<symbol>`` means symbol in real caps e.g. ``EOS``
- ``<account>`` means eos account name e.g ``dexeoswallet``
- ``?`` keyword is for an optional value.

## Types / Enums

``<Market>`` - ``string`` type.

Key | Type
---- | ----
`EOS` | ``String``
`CUSD` | ``String``

``<TXType>`` - ``string`` type.

Key | Type
---- | ----
`buy` | ``String``
`sell` | ``String``
`cancel` | ``String``
`dropped` | ``String``

``<Date>``

Format | Description
---- | ----
``yyyymmddhhmm`` | Year(4), Month(2), Day(2), Hours(2), Minutes(2)


``<Status>``

Key | Type | Description
---- | ---- | ----
`open` | ``String`` | On order
`pending` | ``String`` | Still revisible
`partially_filled` | ``String`` | Some amount has been filled
`complete` | ``String`` | All amount has been filled
`cancelled` | ``String`` | Cancelled and no amount was filled
`cancelled_partially_filled` | ``String`` | Cancelled but some amount was filled



## Contents

#### Place/Cancel Order

* [About fee](#about-fee)
* [Place an order](#place-an-order)

#### DEXEOS Public API

* [Token Info](#token-info)
* [Open orders](#open-orders)
* [On order summary](#on-order-summary)
* [Order history](#order-history)
* [Transaction history](#transaction-history)
* [Trade history](#trade-history)
* [Orderbook](#orderbook)
* [Get USDT value](#get-usdt-value)
* [Get fee info](#get-fee-info)
* [Get whitelisted info](#get-whitelisted-info)

#### DEXEOS Chart API

* [Chart data](#chart-data)
 
#### DEXEOS MQTT

* [On new order event](#on-new-order-event)
* [On one token price change](#on-one-token-price-change)
* [On all tokens price changes](#on-all-tokens-price-changes)
* [On USDT value change](#on-usdt-value-change)

## Place/Cancel Order

### About fee

\* Please beaware, DEXEOS charges **fee** for buy/sell transaction.

Category | Amount
---- | ----
General user | `0.1%`
Whitelisted user | `0.0%`
Some of referral accounts | `by account`

\* Be careful for minimum order amount.

Market | Minimum order amount
---- | ----
EOS | `0.1`
CUSD | `10.0`

### Place an order

Please be careful about fee. For example if you placed an order for buy a token, you will receive token what you want to buy and it will off by fee. If you sell, you will also receive token which calculated with fee. If you want buy some token exactly, you have to reduce or increase quantity of token what you want.

#### Example (node.js)

See [Order Example](./Order%20Example).


## DEXEOS Public API

### Token info

#### Request

Description | Method | Path
---- | ---- | ----
Get all tokens | ``GET`` | ``/token``
Get one token | ``GET`` | ``/token/<code>::<symbol>``

#### Response

Array of ``<TokenInfo>``.

``<TokenInfo>``

Key | Type | Example
---- | ---- | ----
``pk`` | ``Number`` | 79
``code`` | ``String`` | "eosio.token"
``symbol`` | ``String`` | "EOS"
``market`` | ``<Market>`` | "CUSD"
``decimals`` | ``Number`` | 4
``name`` | ``String`` | "EOS"
``summary`` | ``<Summary>`` | -

``<Summary>`` - ``summary`` is last 24 hours from current time.

Key | Type | Example
---- | ---- | ----
`high` | ``Number`` | 0.00112
`low` | ``Number`` | 0.01523
`volume` | ``Number`` | 15237.2317432
`volume_per_market` | ``Number`` | 0.123612
`market` | ``<Market>`` | "EOS"
`percent` | ``Number`` | 0.12
`last_price` | ``Number`` | 3
`last_tx_type` | ``<TXType>`` | "sell"

### Open orders

#### Request

Description | Method | Path
---- | ---- | ----
Get all tokens | ``GET`` | ``/order/<account>``
Get one token | ``GET`` | ``/order/<account>/<code>::<symbol>``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/order`` | ``market`` | ``<Market>`` | ``*`` | "EOS"


#### Response

Array of ``<OpenOrder>``.

``<OpenOrder>``

Key | Type | Example
---- | ---- | ----
``pk`` | ``Number`` | 3590443
``type`` | ``<TXType>`` | "sell"
``block_num`` | ``Number`` | 42336796
``tx_id`` | ``String`` | "3a44f38a7a2ada3dab..."
``from`` | ``String`` | "abcdefg12345"
``code`` | ``String`` | "stablecarbon"
``symbol`` | ``String`` | "CUSD"
``quantity`` | ``Number`` | 0.07
``amount`` | ``Number`` | 0.07
``per_token`` | ``Number`` | 100
``update_date`` | ``String`` | "2019-02-12T05:20:12Z"
``register_date`` | ``String`` | "2019-02-12T05:20:12Z"
``market`` | ``<Market>`` | "EOS"

### On order summary

#### Request

Description | Method | Path
---- | ---- | ----
Onorder summary | ``GET`` | ``/onorder/<account>``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/onorder`` | ``market`` | ``<Market>`` | | "EOS"


#### Response

Array of ``<OnOrderSummary>``.

``<OnOrderSummary>``

Key | Type | Example
---- | ---- | ----
``code`` | ``String`` | "betdicetoken"
``symbol`` | ``String`` | "DICE"
``market`` | ``<Market>`` | "CUSD"
``total_quantity`` | ``Number`` | 1

### Order history

#### Request

Description | Method | Path
---- | ---- | ----
Order History* | ``GET`` | ``/orderhistory/<account>``

\* The limit is `150 transactions` per request. If you want to load more, add `skip` parameter.

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/orderhistory`` | ``skip`` | ``Number`` | | 150


#### Response

Array of ``<OrderHistory>``.

``<OrderHistory>``

Key | Type | Example
---- | ---- | ----
``pk`` | ``Number`` | 4220427
``type`` | ``<TXType>`` | "sell"
``block_num`` | ``Number`` | 44969756
``tx_id`` | ``String`` | "912142e0e7314b24..."
``from`` | ``String`` | "abcdefg12345"
``code`` | ``String`` | "eosio.token"
``symbol`` | ``String`` | "EOS"
``quantity`` | ``Number`` | 2
``amount`` | ``Number`` | 2
``per_token`` | ``Number`` | 1000000
``update_date`` | ``String`` | "2019-02-27T11:26:02Z"
``register_date`` | ``String`` | "2019-02-27T11:26:02Z"
``market`` | ``<Market>`` | "EOS"
``status`` | ``<Status>`` | "open"
``remain_amount`` | ``Number`` | 2

### Transaction history

#### Request

Description | Method | Path
---- | ---- | ----
Transaction history* | ``GET`` | ``/transaction/<account>``

\* The limit is `150 transactions` per request. If you want to load more, add `skip` parameter.

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/transaction`` | ``skip`` | ``Number`` | | 150
| | ``market`` | ``<Market>`` | | "EOS"

#### Response

Array of ``<TransactionHistory>``.

``<TransactionHistory>``

Key | Type | Example
---- | ---- | ----
``pk`` | ``Number`` | 4220422
``type`` | ``<TXType>?`` | ""
``tx_id`` | ``String`` | "912142e0e7314b24..."
``sell_trade_pk`` | ``Number`` | 3905207
``seller_account_name`` | ``String`` | "abcdefg12345"
``buy_trade_pk`` | ``Number`` | 3879447
``buyer_account_name`` | ``String`` | "abcdefg12345"
``code`` | ``String`` | "betdicetoken"
``symbol`` | ``String`` | "DICE"
``market`` | ``<Market>`` | "EOS"
``quantity`` | ``Number`` | 0.75
``per_token`` | ``Number`` | 0.1
``update_date`` | ``String`` | "2019-02-23T12:55:58Z"
``register_date`` | ``String`` | "2019-02-23T12:55:58Z"

### Trade history

#### Request

Description | Method | Path
---- | ---- | ----
Trade history | ``GET`` | ``/tradehistory/<code>::<symbol>``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/tradehistory`` | ``market`` | ``<Market>`` | | "EOS"

#### Response

Array of ``<TransactionHistory>``. see [Transaction History](#transaction-history)'s data type.

### Orderbook

#### Request

Description | Method | Path
---- | ---- | ----
Orderbook | ``GET`` | ``/orderbook/<code>::<symbol>``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/orderbook`` | ``market`` | ``<Market>`` | ``*`` | "EOS"


#### Response

Array of ``<OrderBook>``.

``<OrderBook>``

Key | Type | Example
---- | ---- | ----
``type`` | ``<TXType>`` | "buy"
``code`` | ``String`` | "stablecarbon"
``symbol`` | ``String`` | "CUSD"
``quantity`` | ``Number`` | 24.24
``amount`` | ``Number`` | 24.24
``per_token`` | ``Number`` | 0.30444504
``remain_amount`` | ``Number`` | 24.24

### Get USDT value

#### Request

Description | Method | Path
---- | ---- | ----
USDT value* | ``GET`` | ``/usdt``

\* If you want to fetch USDT info repeatedly, use **MQTT API**.

#### Response

``<CurrencyInfo>``

Key | Type | Example
---- | ---- | ----
``usdt`` | ``Number`` | 3.2677

### Get fee info

\* The `<account>` is referrer account.

#### Request

Description | Method | Path
---- | ---- | ----
Fee information | ``GET`` | ``/feep/<account>``

#### Response

``<FeeInfo>``

Key | Type | Example
---- | ---- | ----
``account`` | ``String`` | "dexeoswallet"
``percent`` | ``Number`` | 0.1

### Get whitelisted info

\* The `<account>` is DEXEOS user account.

#### Request

Description | Method | Path
---- | ---- | ----
Whitelisted information | ``GET`` | ``/fee/<account>``

#### Response

``<WhitelistedInfo>``

Key | Type | Example
---- | ---- | ----
``account`` | ``String`` | "yousoroserup"
``no_fee`` | ``Boolean`` | false


## DEXEOS Chart API

### Chart data

\* **Use** chart (chart.dexeos.io) endpoint.

#### Request

Description | Method | Path
---- | ---- | ----
Get chart data | ``GET`` | ``/chart``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/chart`` | ``code`` | ``String`` | ``*`` | "stablecarbon"
| | ``symbol`` | ``String`` | ``*`` | "CUSD"
| | ``resolution`` | ``<Resolution>`` | ``*`` | 30
| | ``from`` | ``<Date>`` | ``*`` | 201809051521
| | ``to`` | ``<Date>`` | ``*`` | 201903041522
| | ``market`` | ``<Market>`` | ``*`` | "EOS"

``<Resolution>``

Value | Type
---- | ----
1 | ``Number``
5 | ``Number``
15 | ``Number``
30 | ``Number``
60 | ``Number``
240 | ``Number``

#### Response

Array of ``<ChartData>``.

``<ChartData>``

Key | Type | Example
---- | ---- | ----
``open`` | ``Number`` | 0.381
``high`` | ``Number`` | 0.3947
``low`` | ``Number`` | 0.381
``close`` | ``Number`` | 0.3947
``volume`` | ``Number`` | 2
``symbol`` | ``String`` | "CUSD"
``code`` | ``String`` | "stablecarbon"
``market`` | ``<Market>`` | "EOS"
``timestamp`` | ``String`` | "2018-12-30T03:00:00Z"


## DEXEOS MQTT

### On new order event

#### Subscription

Description | Topic
---- | ----
On new order event | ``/global/<account>/order``

#### Response

a ``<OpenOrder>`` object. See [Open orders](#open-orders).


### On one token price change

#### Subscription

Description | Topic
---- | ----
On token price changes | ``/global/<code>::<symbol>/price``

#### Response

``<OneTokenPriceInfo>``

Key | Type | Example
---- | ---- | ----
``last_price`` | ``Number`` | 0.123


### On all tokens price changes

#### Subscription

Description | Topic
---- | ----
On **ALL** tokens price changes | ``/global/price``

#### Response

``<TokenInfo>`` object. See [Token info](#token-info).

### On USDT value change

#### Subscription

Description | Topic
---- | ----
On USDT value change | ``/global/usdt``

#### Response

``<CurrencyInfo>``

Key | Type | Example
---- | ---- | ----
``usdt`` | ``Number`` | 3.2677



