# DEXEOS Order Example (node.js)

DEXEOS transaction (buy, sell and cancel) example with `nodejs`, `eosjs` and `scatterjs`.

Install dependencies with...

```
yarn
```

... and run 🎉

```
node main
```

Make sure you have to install & unlock scatter before test.

## Buy

See `buyToken` function

## Sell

See `sellToken` function

## Cancel

See `cancelOrder` function

## Remember
For all buy orders, if price * quantity in memo is greater than the total quantity you send, you should ceil.

For example memo : {price:0.123456789, quantity: 100}

price * quantity = 123.456789 for the case of EOS you should send 123.4568 instead of 123.4567. 

A simple example in JavaScript to ceil

```
const price = 0.123456789
const quantity = 1000;
const total = price * quantity;
const toSend = Math.ceil(total * 10000)/10000
```
Be careful with float precision.

Also remember for CUSD market the decimal places is 2, so 
```
const toSend = Math.ceil(total * 100)/100
```

For all sell orders, the total quantity you send should be exactly equal to the quantity you write in memo.



