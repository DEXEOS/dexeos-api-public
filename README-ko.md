# DEXEOS Public API

API Version | ``3``
---- | ----
HTTP Endpoint | ``https://api.dexeos.io/v3/<endpoint>``
HTTP Endpoint (Chart) | ``https://chart.dexeos.io/<endpoint>``
MQTT Endpoint (WSS) | ``wss://mqtt.dexeos.io/mqtt``
MQTT Endpoint (TCP) | ``tcp://tcpmqtt.dexeos.io:1883``
Content-Type | ``application/json``

## 시작하기 전에
몇 초 주기로 데이터를 받아오는 작업을 하고자 할 때 HTTP 요청 대신 MQTT를 사용하시는 것을 권장합니다. 초당 많은 API 요청을 보내는 경우, 어뷰징을 막기 위해 일시적으로 접속 IP를 차단할 수 있음을 알려드립니다.

## 키워드

- ``<code>`` 는 토큰 코드를 의미합니다. 예: ``eosio.token``
- ``<symbol>`` 은 토큰 심볼(대문자)를 의미합니다. 예:  ``EOS``
- ``<account>`` 는 EOS 계정 이름을 의미합니다. 예:  ``dexeoswallet``

## Types / Enums

``<Market>`` - 데이터형: ``string``

Key | Type
---- | ----
`eos` | ``String``
`cusd` | ``String``

``<TXType>`` - 데이터형: ``string``

Key | Type
---- | ----
`buy` | ``String``
`sell` | ``String``
`cancel` | ``String``
`dropped` | ``String``

``<Date>``

Format | Description
---- | ----
``yyyymmddhhmm`` | 연도(4), 월(2), 일(2), 시(2), 분(2)


``<Status>``

Key | Type | Description
---- | ---- | ----
`open` | ``String`` | 주문 중
`pending` | ``String`` | Confirm 되지 않은 트랜잭션
`partially_filled` | ``String`` | 일부 수량에 한해 거래가 체결됨
`complete` | ``String`` | 모든 수량 거래 체결됨
`cancelled` | ``String`` | 취소됨
`cancelled_partially_filled` | ``String`` | 일부 수량에 한해 체결되었으나 취소됨



## Contents

#### 주문 트랜잭션/취소

* [수수료에 대하여](#수수료에-대하여)
* [주문하기](#주문하기)

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

#### DEXEOS 차트 API

* [Chart data](#chart-data)
 
#### DEXEOS MQTT

* [On new order event](#on-new-order-event)
* [On one token price change](#on-one-token-price-change)
* [On all tokens price changes](#on-all-tokens-price-changes)
* [On USDT value change](#on-usdt-value-change)

## Place/Cancel Order

### 수수료에 대하여

\* DEXEOS는 토큰 구매 혹은 판매 시 **수수료**를 부과합니다.

Category | Amount
---- | ----
일반 | `0.1%`
화이트리스트 | `0.0%`
일부 특별한 계정 | `계정에 따라 다름`

### 주문하기

수수료가 부과되는 점을 유의하여 주문을 넣으셔야 합니다. 예를 들면, 어떤 토큰을 `1.0000 EOS`에 구매하시고자 한다면, 수수료를 포함하여 총 `1.001 EOS`를 보내셔야 합니다 (`0.1%` 수수료일 때). 정확하게 `1.0000 EOS`에 맞춰 구매하시려면 직접 토큰 구매량이나 가격을 조절하셔야 합니다.


#### Example (node.js)

[Order Example](./Order%20Example) 을 참고하여 주세요.


## DEXEOS Public API

### Token info
토큰 정보

#### Request

Description | Method | Path
---- | ---- | ----
모든 토큰 정보 | ``GET`` | ``/token``
한 개의 토큰 정보 | ``GET`` | ``/token/<code>::<symbol>``

#### Response

``<TokenInfo>`` 객체의 배열.

``<TokenInfo>``

Key | Type | Example
---- | ---- | ----
``pk`` | ``Number`` | 79
``code`` | ``String`` | "eosio.token"
``symbol`` | ``String`` | "EOS"
``market`` | ``<Market>`` | "cusd"
``decimals`` | ``Number`` | 4
``name`` | ``String`` | "EOS"
``summary`` | ``<Summary>`` | -

``<Summary>`` - ``summary`` 는 현재 시간으로부터 24시간까지의 데이터를 가지고 있습니다.

Key | Type | Example
---- | ---- | ----
`high` | ``Number`` | 0.00112
`low` | ``Number`` | 0.01523
`volume` | ``Number`` | 15237.2317432
`volume_per_market` | ``Number`` | 0.123612
`market` | ``<Market>`` | "eos"
`percent` | ``Number`` | 0.12
`last_price` | ``Number`` | 3
`last_tx_type` | ``<TXType>`` | "sell"

### Open orders
미체결 주문 내역

#### Request

Description | Method | Path
---- | ---- | ----
모든 토큰에 대한 정보 | ``GET`` | ``/order/<account>``
한 개의 토큰에 대한 정보 | ``GET`` | ``/order/<account>/<code>::<symbol>``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/order`` | ``market`` | ``<Market>`` | ``*`` | "eos"


#### Response

``<OpenOrder>`` 객체의 배열.

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
``market`` | ``<Market>`` | "eos"

### On order summary

<주문 중> 요약

#### Request

Description | Method | Path
---- | ---- | ----
주문 중 요약 | ``GET`` | ``/onorder/<account>``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/onorder`` | ``market`` | ``<Market>`` | | "eos"


#### Response

``<OnOrderSummary>`` 객체의 배열.

``<OnOrderSummary>``

Key | Type | Example
---- | ---- | ----
``code`` | ``String`` | "betdicetoken"
``symbol`` | ``String`` | "DICE"
``market`` | ``<Market>`` | "cusd"
``total_quantity`` | ``Number`` | 1

### Order history
주문 내역

#### Request

Description | Method | Path
---- | ---- | ----
주문 내역* | ``GET`` | ``/orderhistory/<account>``

\* 요청당 `150 트랜잭션`으로 제한됩니다. 더 불러오려면, 파라메터에 `skip` 및 값을 추가해야 합니다.

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/orderhistory`` | ``skip`` | ``Number`` | | 150


#### Response

``<OrderHistory>`` 객체의 배열.

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
``market`` | ``<Market>`` | "eos"
``status`` | ``<Status>`` | "open"
``remain_amount`` | ``Number`` | 2

### Transaction history
트랜잭션 내역

#### Request

Description | Method | Path
---- | ---- | ----
트랜잭션 내역* | ``GET`` | ``/transaction/<account>``

\* 요청당 `150 트랜잭션`으로 제한됩니다. 더 불러오려면, 파라메터에 `skip` 및 값을 추가해야 합니다.

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/transaction`` | ``skip`` | ``Number`` | | 150
| | ``market`` | ``<Market>`` | | "eos"

#### Response

``<TransactionHistory>`` 객체의 배열.

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
``market`` | ``<Market>`` | "eos"
``quantity`` | ``Number`` | 0.75
``per_token`` | ``Number`` | 0.1
``update_date`` | ``String`` | "2019-02-23T12:55:58Z"
``register_date`` | ``String`` | "2019-02-23T12:55:58Z"

### Trade history

거래 내역

#### Request

Description | Method | Path
---- | ---- | ----
거래 내역 | ``GET`` | ``/tradehistory/<code>::<symbol>``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/tradehistory`` | ``market`` | ``<Market>`` | | "eos"

#### Response

``<TransactionHistory>`` 객체의 배열. 데이터 타입은 [Transaction History](#transaction-history) 을 참고하세요.

### Orderbook

호가 목록

#### Request

Description | Method | Path
---- | ---- | ----
호가 목록 | ``GET`` | ``/orderbook/<code>::<symbol>``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/orderbook`` | ``market`` | ``<Market>`` | ``*`` | "eos"


#### Response

``<OrderBook>`` 객체의 배열.

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

USDT 값

#### Request

Description | Method | Path
---- | ---- | ----
USDT 값* | ``GET`` | ``/usdt``

\* 지속적으로 값을 갱신해야 한다면, **MQTT API**를 사용하세요.

#### Response

``<CurrencyInfo>`` 객체.

Key | Type | Example
---- | ---- | ----
``usdt`` | ``Number`` | 3.2677

### Get fee info

수수료 정보

#### Request

Description | Method | Path
---- | ---- | ----
수수료 정보 | ``GET`` | ``/fee/<account>``

#### Response

``<FeeInfo>`` 객체.

Key | Type | Example
---- | ---- | ----
``account`` | ``String`` | "letsplay.hos"
``percent`` | ``Number`` | 0.1


## DEXEOS Chart API

### Chart data

\* Endpoint로 **chart.dexeos.io** 를 사용하세요.

#### Request

Description | Method | Path
---- | ---- | ----
차트 데이터 | ``GET`` | ``/chart``

#### Parameters

API | Name | Type | Required | Example
---- | ---- | ---- | ---- | ----
``/chart`` | ``code`` | ``String`` | ``*`` | "stablecarbon"
| | ``symbol`` | ``String`` | ``*`` | "CUSD"
| | ``resolution`` | ``<Resolution>`` | ``*`` | 30
| | ``from`` | ``<Date>`` | ``*`` | 201809051521
| | ``to`` | ``<Date>`` | ``*`` | 201903041522
| | ``market`` | ``<Market>`` | ``*`` | "eos"

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

``<ChartData>`` 객체의 배열.

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
``market`` | ``<Market>`` | "eos"
``timestamp`` | ``String`` | "2018-12-30T03:00:00Z"


## DEXEOS MQTT

### On new order event

신규 주문 발생 이벤트

#### Subscription

Description | Topic
---- | ----
신규 주문 발생 이벤트 | ``/global/<account>/order``

#### Response

``<OpenOrder>`` 객체. 데이터 타입은 [Open orders](#open-orders) 를 참고하세요.


### On one token price change

토큰 가격 변동 이벤트

#### Subscription

Description | Topic
---- | ----
토큰 가격 변동 | ``/global/<code>::<symbol>/price``

#### Response

``<OneTokenPriceInfo>`` 객체.

Key | Type | Example
---- | ---- | ----
``last_price`` | ``Number`` | 0.123


### On all tokens price changes

전체 토큰 가격 변동 이벤트

#### Subscription

Description | Topic
---- | ----
**전체** 토큰 정보 | ``/global/price``

#### Response

``<TokenInfo>`` 객체. 데이터 타입은 [Token info](#token-info) 를 참고하세요.


### On USDT value change

USDT 값 변동 이벤트

#### Subscription

Description | Topic
---- | ----
USDT 값 변동 | ``/global/usdt``

#### Response

``<CurrencyInfo>``

Key | Type | Example
---- | ---- | ----
``usdt`` | ``Number`` | 3.2677



