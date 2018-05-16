# NEM-sdk
NEM Developer Kit for Node.js and the browser

---

#### Features:
- Easy integration
- Organised in namespaces
- Create wallets compatible with Nano Wallet client
- Simple transactions
- Mosaic transactions
- Encrypted, unencrypted and hex messaging
- Create and audit Apostilles
- Create and verify signatures
- Helpers and formatting functions
- 22 NIS API requests with promises
- Websockets for real time blockchain data
- Commented code and examples
- Browser examples ready to use out of the box

---

# Documentation

## Table of Contents
1. [Introduction](#1---introduction)
  - 1. [Installation](#11---installation)
  - 2. [Build](#12---build)
  - 3. [Organisation](#13---organisation)
2. [Objects](#2---objects)
  - 1. [Get objects](#21---get-objects)
  - 2. [Create objects](#22---create-objects)
  - 3. [More](#23---more)
3. [Transactions](#3---transactions)
  - 1. [Create and prepare transaction objects](#31---create-and-prepare-transaction-objects)
  - 2. [Sending prepared transactions](#32---sending-prepared-transactions)
  - 3. [Transfer transactions without mosaics](#33---transfer-transactions-without-mosaics)
  - 4. [Transfer transactions with mosaics](#34---transfer-transactions-with-mosaics)
4. [Communications](#4---communications)
  - 1. [Create endpoints](#41---create-endpoints)
  - 2. [API requests](#42---api-requests)
  - 3. [Usage](#43---usage)
  - 4. [More](#44---more)
  - 5. [Websockets](#45---websockets)
  - 6. [Usage](#46---usage)
  - 7. [More](#47---more)
5. [Helpers and Format](#5---helpers-and-format)
  - 1. [Helpers](#51---helpers)
  - 2. [Format](#52---format)
6. [Private Keys](#6---private-keys)
  - 1. [Create private keys](#61---create-private-keys)
  - 2. [Create key pairs](#62---create-key-pairs)
  - 3. [Sign with key pair](#63---sign-with-key-pair)
  - 4. [Extract public key from key pair](#64---extract-public-key-from-key-pair)
  - 5. [Verify a signature](#65---verify-a-signature)
7. [Addresses](#7---addresses)
  - 1. [Convert public key to an address](#71---convert-public-key-to-an-address)
  - 2. [Verify address validity](#72---verify-address-validity)
  - 3. [Verify if address is from given network](#73---verify-if-address-is-from-given-network)
  - 4. [More](#74---more)
8. [Crypto Helpers](#8---crypto-helpers)
9. [Wallets](#9---wallets)
  - 1. [Create simple wallets](#91---create-simple-wallets)
  - 2. [Create brain wallets](#92---create-brain-wallets)
  - 3. [Create private key wallets](#93---create-private-key-wallets)
  - 4. [Create wallet files](#94---create-wallet-files)
  - 5. [Decrypt account in wallet](#95---decrypt-account-in-wallet)
10. [Apostille](#10---apostille)
  - 1. [Create an Apostille](#101---create-an-apostille)
  - 2. [Verify an Apostille](#102---verify-an-apostille)
  - 3. [More](#103---more)

---

## 1 - Introduction

### 1.1 - Installation

#### For the browser:

Download the library source, open the `dist/` folder and put `nem-sdk.js` into your project.

Library include the `require()` function so you can `require()` the module directly

```html
<script src="nem-sdk.js"></script>
<script>
  // Include the library
  var nem = require("nem-sdk").default;
  console.log(nem)
</script>
```

#### For Node:

##### Using npm:

`npm install nem-sdk`

```javascript
// Use require
var nem = require("nem-sdk").default;
```

```javascript
// ES6
import nem from 'nem-sdk';
```

##### Using `build/` folder:

```javascript
// Use the build/ folder
var nem = require("path/to/build/index.js").default;
``` 
### 1.2 - Build

#### Install dependencies:

```npm install```

#### Build:

```npm run build```

#### Build for the browser (after above build):

```npm run browserify```

### 1.3 - Organisation

The SDK is organised in namespaces and sub-namespaces. 

There is 4 main namespaces:

#### `nem.com`
- `requests`: Requests to NIS and the outside world
- `websockets`: Connection, subscription and requests to NIS websockets

#### `nem.crypto`
- `keyPair`: Functions to create keypair from hex and sign data with it
- `helpers`: Miscellaneous cryptographic functions, like encrypt private key, decrypt a wallet, derive a password...
- `nacl`: External cryptographic library modified for NEM
- `js`: Access to the crypto-js library

#### `nem.model`
- `address`: Functions regarding NEM addresses like base32 encoding / decoding, verify, convert public key to address...
- `objects`: Contains usesul objects models
- `fees`: Contains all the transaction fees and calculation functions
- `network`: Contains networks types and functions related
- `nodes`: Contains array of nodes for different networks, default nodes, search by hash nodes...
- `sinks`: Contains the sink addresses for namespaces and mosaics by network
- `transactions`: Contains functions to prepare and send transaction objects
- `transactionTypes`: Contains all the NEM transactions types
- `wallet`: Contains functions to create wallets

#### `nem.utils`
- `convert`: Contains convertion functions
- `helpers`: Contains miscellaneous helper functions
- `format`: Contains miscellaneous formatting functions
- `nty`: Contains functions to build nty data
- `Serialization`: Contains functions to serialize transactions

Consult the code directly for details, almost all functions are commented, with parameters, return values and types. 

## 2 - Objects

**Namespace**: `nem.model.objects`

This namespace allow to easily `get` or `create` objects to use in the SDK. Each object is accessible via a keyword.

**Public methods**:
- `get`
- `create`

**Keywords**:
- `common`: An object to hold password and private key
- `endpoint`: An object containing info about a remote node
- `mosaicAttachment`: An object containing mosaic data to join in a transfer transaction
- `mosaicDefinitionMetaDataPair`: An object of objects containing mosaics properties
- `invoice`: An invoice object working on NEM mobile clients
- `transferTransaction`: An un-prepared transfer transaction object
- `signatureTransaction`: An un-prepared signature transaction object

### 2.1 - Get objects

Return an empty object

#### Usage:

```javascript
// Get an empty object
var object = nem.model.objects.get("keyword");
```

#### Example:

```javascript
// Get an empty object
var transferTransaction = nem.model.objects.get("transferTransaction");
```
#### Return:

```json
{
    "amount": "",
    "recipient": "",
    "recipientPublicKey": "",
    "isMultisig": false,
    "multisigAccount" : "",
    "message": "",
    "isEncrypted" : false,
    "mosaics": []
}
```

### 2.2 - Create objects

Return an object with parameters.

Using the `create` method takes different parameters depending of the object.

#### Parameters

##### `common`
Name           | Type             | Description   |
---------------|------------------|---------------|
password       | string           | A password    |
privateKey     | string           | A private key |

##### `endpoint`
Name           | Type             | Description   |
---------------|------------------|---------------|
host           | string           | An NIS uri    | 
port           | string           | An NIS port   |

##### `mosaicAttachment`
Name           | Type             | Description               |
---------------|------------------|---------------------------|
namespaceId    | string           | A namespace name          | 
mosaicName     | string           | A mosaic name             | 
quantity       | long number      | A quantity in micro-units |

##### `transferTransaction`
Name           | Type             | Description               |
---------------|------------------|---------------------------|
recipient      | string           | A recipient address       | 
amount         | number           | An amount                 | 
message        | string           | A message to join         |

#### Usage:

```javascript
// Create an object with parameters
var object = nem.model.objects.create("keyword")(param1, param2, ...);
```

#### Example:

```javascript
// Create an object with parameters
var transferTransaction = nem.model.objects.create("transferTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", 10, "Hello");
```

#### Return:

```json
{
    "amount": 10,
    "recipient": "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S",
    "recipientPublicKey": "",
    "isMultisig": false,
    "multisigAccount" : "",
    "message": "Hello",
    "isEncrypted" : false,
    "mosaics": []
}
```

### 2.3 - More

Consult `src/model/objects.js` for details about objects and creation parameters

## 3 - Transactions

**Namespace**: `nem.model.transactions`

**Public methods**:
- `prepare`
- `send`
- `prepareMessage`

**Keywords**:
- `transferTransaction`
- `mosaicTransferTransaction`
- `signatureTransaction`

This namespace is used to prepare and send transactions. 

For now only preparation of simple and mosaics transactions with encrypted, unencrypted and hex messages are implemented.

### 3.1 - Create and prepare transaction objects

In part 2 you can see in the examples how to build a transfer transaction object, with or without data.

Transaction objects you will create via `nem.model.objects` are un-prepared transaction objects. They only contain raw / incomplete data and need to be arranged before being signed and sent.

Using the `prepare` method takes different parameters depending of the transaction object.

#### Parameters

##### `transferTransaction`

Name           | Type             | Description                  |
---------------|------------------|------------------------------|
common         | object           | A common object              |
tx             | object           | A transferTransaction object |
network        | number           | A network id                 |

##### `mosaicTransferTransaction`

Name                          | Type             | Description                           |
------------------------------|------------------|---------------------------------------|
common                        | object           | A common object                       |
tx                            | object           | A transferTransaction object          |
mosaicDefinitionMetaDataPair  | object           | A mosaicDefinitionMetaDataPair object (see 3.4)|
network                       | number           | A network id                          |

#### Usage:

```javascript
// Prepare a transaction object
var preparedTransaction = nem.model.transactions.prepare("keyword")(param1, param2, ...);
```

#### Transfer transaction example:

```javascript
// Create an object with parameters
var transferTransaction = nem.model.objects.create("transferTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", 10, "Hello");

// Prepare the above object
var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id)
```

#### Return:

```javascript
{
	type: 257,
  	version: -1744830463,
  	signer: '0257b05f601ff829fdff84956fb5e3c65470a62375a1cc285779edd5ca3b42f6',
  	timeStamp: 62995509,
  	deadline: 62999109,
  	recipient: 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S',
  	amount: 10000000,
  	fee: 2000000,
  	message: { type: 1, payload: '48656c6c6f' },
  	mosaics: null
}
```

You can easily see the difference between an un-prepared transaction object (2.2) and above prepared object.

#### Note:

Amounts are in the smallest unit possible in a prepared transaction object:

> 1000000 = 1 XEM

#### Signature transaction example:

```javascript
// Create an object with parameters (multisig account address and inner transaction hash)
var signatureTransaction = nem.model.objects.create("signatureTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", "161d7f74ab9d332acd46f96650e74371d65b6e1a0f47b076bdd7ccea37903175");

// Prepare the above object
var transactionEntity = nem.model.transactions.prepare("signatureTransaction")(common, signatureTransaction, nem.model.network.data.testnet.id)
```

#### Return:

```javascript
{
  type: 4098,
  version: -1744830463,
  signer: '0257b05f601ff829fdff84956fb5e3c65470a62375a1cc285779edd5ca3b42f6',
  timeStamp: 62995509,
  deadline: 62999109,
  otherHash: {
    data: '161d7f74ab9d332acd46f96650e74371d65b6e1a0f47b076bdd7ccea37903175'
  },
  otherAccount: 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S',
  fee: 6000000
}
```

### 3.2 - Sending prepared transactions

Once your transaction is prepared simply use the `send` method of the namespace.

#### Parameters

Name           | Type             | Description                   |
---------------|------------------|-------------------------------|
common         | object           | A common object               |
entity         | object           | A prepared transaction object |
endpoint       | object           | An endpoint object            |

#### Example

```javascript
// Serialize transfer transaction and announce
nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res) {....});

```

#### return

A `NemAnnounceResult` object (http://bob.nem.ninja/docs/#nemAnnounceResult)

### 3.3 - Transfer transactions without mosaics

The two provided example speaks for themselves:

- See `examples/node/transfer.js` for node
- See `examples/browser/transfer` for browser

The node version contains only the strict necessary while browser example needs to handle form and update fees.

### 3.4 - Transfer transactions with mosaics

- See `examples/node/mosaicTransfer.js` for node
- See `examples/browser/mosaicTransfer` for browser

Similar to transfer transaction, it use the same un-prepared `transferTransaction` object, but needs an array of `mosaicAttachment` objects.

Keyword of the preparation function is `mosaicTransferTransaction`.

Preparation of mosaic transfer transactions requires a `mosaicDefinitionMetaDataPair` object containing mosaic definitions of the mosaics you are joining to the transaction. 

Definitions are needed to know informations about the included mosaic(s) and calculate quantity and fee accordingly.

#### Two ways are possible to get mosaic definitions:

 1) You can take it from NIS API using http://bob.nem.ninja/docs/#retrieving-mosaic-definitions and put the definition into `model/objects.js`, in the `mosaicDefinitionMetaDataPair` object (like shown by the comments). If mosaics used in your application are fixed, it is the way to go.

 2) Query the network using the embedded API requests (`nem.com.requests.namespace.mosaicDefinitions`) as shown in the examples. If mosaics used in your application are not fixed, it is the way to go.

## 4 - Communications

### 4.1 - Create endpoints

To communicate with an NIS you need an `endpoint` object. The object contains the node host and port so it is easier to handle.

#### Examples

```javascript
// Custom endpoint
var endpoint = nem.model.objects.create("endpoint")("http://myNode", 7890);

// Using sdk data
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
```

### 4.2 - API requests

**Namespace**: `nem.com.requests`

22 NIS API calls and a few other external requests are implemented and organised in namespaces:

#### `nem.com.requests.account`
- `data`: Gets account data
- `forwarded`: Gets the account data of the account for which the given account is the delegate account
- `harvesting.blocks`: Gets harvested blocks
- `harvesting.stop`: Stop delegated harvesting
- `harvesting.start`: Start delegated harvesting
- `namespaces.owned`: Gets namespaces that an account owns
- `mosaics.owned`: Gets mosaics that an account owns
- `mosaics.allDefinitions`: Gets all mosaic definitions that an account owns
- `mosaics.definitions`: Gets mosaic definitions that an account has created
- `transactions.incoming`: Gets incoming transactions
- `transactions.unconfirmed`: Gets unconfirmed transactions
- `transactions.all`: Gets all transactions
- `transactions.outgoing`: Gets outgoing transactions
- `unlockInfo`: Gets information about the maximum number of allowed harvesters and how many harvesters are already using the node

#### `nem.com.requests.apostille`
- `audit`: Audit an apostille

#### `nem.com.requests.chain`
- `height`: Gets the chain height
- `lastBlock`: Gets the last block
- `time`: Get network time

#### `nem.com.requests.endpoint`
- `heartbeat`: Gets the node status

#### `nem.com.requests.market`
- `xem`: Gets XEM price in BTC
- `btc`: Gets BTC price in $

#### `nem.com.requests.namespace`
- `roots`: Gets root namespaces
- `info`: Gets the namespace with given id
- `mosaicDefinitions`: Gets mosaic definitions of a namespace

#### `nem.com.requests.supernodes`
- `all`: Gets all supernodes info

#### `nem.com.requests.transaction`
- `byHash`: Gets a transaction by hash
- `announce`: Announce a transaction to the network

### 4.3 - Usage

Requests are wrapped in `Promises` which allow to use `then()` for callbacks

#### Examples:

``` javascript
// Gets chain height
nem.com.requests.chain.height(endpoint).then(function(res) {
	console.log(res)
}, function(err) {
	console.error(err)
})

// Gets account data
nem.com.requests.account.data(endpoint, "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S").then(...);
```

### 4.4 - More

Consult `src/com/requests` for details about requests parameters.

- See `examples/browser/monitor` for browser demonstration
- See `examples/node/requests` for all requests in node

### 4.5 - WebSockets

**Namespace**: `nem.com.websockets`

**Note**: For now webSockets use two versions of SockJS to work in Node (v1.1.4) and the browser (v0.3.4). Using only latest SockJS v1.1.4, gives an error when used in browser:

`XMLHttpRequest cannot load http://bob.nem.ninja:7778/w/messages/info?t=1429552020306. A wildcard '*' cannot be used in the 'Access-Control-Allow-Origin' header when the credentials flag is true. Origin 'null' is therefore not allowed access.`

If anyone has a solution to that, it is welcome.

#### `nem.com.websockets.connector`
- `create`: Create a connector object
- `close`: Close the websocket connection 

#### `nem.com.websockets.subscribe`
- `errors`: Subscribes to error channel

#### `nem.com.websockets.subscribe.account`
- `data`: Subscribes to account data channel
- `transactions.recent`: Subscribes to recent transactions channel
- `transactions.confirmed`: Subscribes to confirmed transactions channel
- `transactions.unconfirmed`: Subscribes to unconfirmed transactions channel

#### `nem.com.websockets.subscribe.chain`
- `height`: Subscribes to new chain height channel
- `blocks`: Subscribes to new blocks channel

#### `nem.com.websockets.requests.account`
- `data`: Requests account data from channel
- `transactions.recent`: Requests recent transactions from channel

### 4.6 - Usage

You first need to create a connector object pointing to the right endpoint then use this connector to open the connection.

If connection is a success, the `connector.connect` function will resolve a promise in a `.then()` function, in which you can request and subscribe to channels.

Subscription takes a connector and resolve in a simple callback function (`.then()` not supported), where your data will be received from the channel. It acts exactly like a `.on('something')`.

#### Parameters

##### `create`

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
endpoint       | object           | An endpoint object (using websocket port) | 
address        | string           | A NEM account address      |

##### All subscription methods

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
connector      | object           | An open connector object        |
callback       | function         | A callback function where data will be received | 
address        | string           | A NEM account address (optional, for custom account subscription)|

##### All request methods 

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
connector      | object           | An open connector object        |
address        | string           | A NEM account address (optional, for custom account request)|

#### Example:

``` javascript
// Create an endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);

// Address to subscribe
var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

// Create a connector object
var connector = nem.com.websockets.connector.create(endpoint, address);

// Connect using connector
connector.connect().then(function() {
  // If we are here we are connected
  console.log("Connected");

  // Subscribe to new blocks channel
  nem.com.websockets.subscribe.chain.blocks(connector, function(res) {
    console.log(res);
  });

  // Subscribe to account data channel
  nem.com.websockets.subscribe.account.data(connector, function(res) {
    console.log(res);
  });

  // Request account data
  nem.com.websockets.requests.account.data(connector);

}, function (err) {
  // If we are here connection failed 10 times (1/s).
  console.log(err);
});
```

### 4.7 - More

Consult `src/com/websockets` for details.

- See `examples/browser/websockets` for browser demonstration
- See `examples/nodejs/websockets.js` for Node demonstration

## 5 - Helpers and Format

### 5.1 - Helpers

**Namespace**: `nem.utils.helpers`

**Public methods**:
- `needsSignature`
- `haveTx`
- `getTransactionIndex`
- `haveCosig`
- `createNEMTimeStamp`
- `fixPrivateKey`
- `isPrivateKeyValid`
- `isPublicKeyValid`
- `checkAndFormatUrl`
- `createTimeStamp`
- `getTimestampShort`
- `convertDateToString`
- `extendObj`
- `isHexadecimal`
- `searchMosaicDefinitionArray`
- `grep`
- `isTextAmountValid`
- `cleanTextAmount`
- `formatEndpoint`

### 5.2 - Format

**Namespace**: `nem.utils.format`

**Public methods**:
- `address`
- `hexMessage`
- `hexToUtf8`
- `importanceTransferMode`
- `levyFee`
- `nemDate`
- `nemImportanceScore`
- `nemValue`
- `pubToAddress`
- `splitHex`
- `supply`
- `supplyRaw`
- `mosaicIdToName`
- `txTypeToName`

#### Format address 

Add hyphens to unformatted address.

#### Parameters

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
address        | string           | An unformatted NEM address      | 

#### Example

```javascript
var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

// Add hyphens to NEM address
var fmtAddress = nem.utils.format.address(address); //TBCI2A-67UQZA-KCR6NS-4JWAEI-CEIGEI-M72G3M-VW5S
```
#### Format a nem quantity

Change a NEM quantity into an array of values.

Quantity means the smallest unit (1.000000 XEM = 1'000'000)

#### Parameters

Name           | Type             | Description                       |
---------------|------------------|-----------------------------------|
data           | number           | A quantity (smallest unit)        | 

#### Example

```javascript
var xemQuantity = 10003002; // Smallest unit for XEM

// Format quantity
var fmt = nem.utils.format.nemValue(xemQuantity)

var fmtAmount = fmt[0] + "." + fmt[1]; // 10.003002
```

#### Format a message object

Format hexadecimal payload contained in message objects.

Message objects also contains type:

Type 1: Plain message. 
Type 2: Encrypted message.

#### Parameters

Name           | Type             | Description                       |
---------------|------------------|-----------------------------------|
msg            | object           | A message object                  | 

#### Example

```javascript
var msg = {
  "type": 1,
  "payload": "4e454d20697320617765736f6d652021"
}

// Format msg
var fmt = nem.utils.format.hexMessage(msg); // NEM is awesome !
```

## 6 - Private Keys

A private key is a 64 or 66 characters hex string, looking like this:

```
// 64 characters hexadecimal private key
712cb1b773066cf572b6f271cb10be49b3e71ed24dd7b6a2ac876af9f3ad84e7

// 66 characters hexadecimal private key (always start with 00 in that case)
00d32b7c09e8747908b1ed9dbc893ff33987b2275bb3401cd5199f45b1bbbc7d75
```

### 6.1 - Create private keys

To obtain a private key, 4 choices are possible:

1) You can type yourself a random 64 hexadecimal string

2) Use the included PRNG:
``` javascript
// Create random bytes from PRNG
var rBytes = nem.crypto.nacl.randomBytes(32);

// Convert the random bytes to hex
var privateKey = nem.utils.convert.ua2hex(rBytes);
```

3) Create a private key from a passphrase:
``` javascript
// Derive a passphrase to get a private key
var privateKey = nem.crypto.helpers.derivePassSha(passphrase, 6000).priv;
```

4) Use a private key from another source.

### 6.2 - Create key pairs

Key pairs are objects representing accounts keys (private, secret and public) and are used to sign data or transactions.

#### Parameters

Name           | Type             | Description                     |
---------------|------------------|---------------------------------|
hexData        | string           | 64 or 66 hexadecimal characters | 

#### Example

```javascript
// A funny but valid private key
var privateKey = "aaaaaaaaaaeeeeeeeeeebbbbbbbbbb5555555555dddddddddd1111111111aaee";

// Create a key pair
var keyPair = nem.crypto.keyPair.create(privateKey);
```

### 6.3 - Sign with key pair

To sign a transaction or any other data simply use the above `keyPair` object

#### Example

```javascript
var signature = keyPair.sign(data);
```

### 6.4 - Extract public key from key pair

You can extract the public key from the `keyPair` object very easily

#### Example

```javascript
var publicKey = keyPair.publicKey.toString();
```

### 6.5 - Verify a signature

To verify a signature you need the signer public key, the data that have been signed and the signature.

#### Parameters

Name           | Type             | Description               |
---------------|------------------|---------------------------|
publicKey      | string           | The signer public key     | 
data           | string           | The data that were signed | 
signature      | string           | The signature of the data |


#### Example

```javascript
var signer = "0257b05f601ff829fdff84956fb5e3c65470a62375a1cc285779edd5ca3b42f6"
var signature = "392511e5b1d78e0991d4cb2a10037cc8be775e56d76b8157a4da726ccb44042e9b419084c09128ffe2a78fe78e2a19beb0e2f57e14b66c962187e61457bd9e09"
var data = "NEM is awesome !";
// Verify
var result = nem.crypto.verifySignature(signer, data, signature);
```

- See `examples/nodejs/verifySignature.js` for node demonstration

## 7 - Addresses

**Namespace**: `nem.model.address`

**Public methods**:
- `b32encode`
- `b32decode`
- `toAddress`
- `isFromNetwork`
- `isValid`
- `clean`

Addresses are base32 string used to receive XEM. They look like this:

> NAMOAV-HFVPJ6-FP32YP-2GCM64-WSRMKX-A5KKYW-WHPY
> NAMOAVHFVPJ6FP32YP2GCM64WSRMKXA5KKYWWHPY

The version without hyphens ("-") is the one we'll use in our queries and lower level processing. The formatted version is only for visual purposes.

#### Beginning of the address depend of the network:

- **Mainnet (104)**: N

- **Testnet (-104)**: T

- **Mijin (96)**: M

### 7.1 - Convert public key to an address

```javascript
var address = nem.model.address.toAddress(publicKey, networkId)
```

### 7.2 - Verify address validity

```javascript
var isValid = nem.model.address.isValid(address);
```

### 7.3 - Verify if address is from given network

```javascript
var isFromNetwork = nem.model.address.isFromNetwork(address, networkId);
```

### 7.4 - More

Consult `src/model/address.js` for more details

## 8 - Crypto Helpers

**Namespace**: `nem.crypto.helpers`

**Public methods**:
- `toMobileKey`
- `derivePassSha`
- `passwordToPrivatekey`
- `checkAddress`
- `randomKey`
- `decrypt`
- `encrypt`
- `encodePrivKey`
- `encode`
- `decode`


## 9 - Wallets

**Namespace**: `nem.model.wallet`

**Public methods**:
- `createPRNG`
- `createBrain`
- `importPrivateKey`

The SDK allow to create wallets 100% compatible with the Nano Wallet client (as BIP32 not implemented yet the client will ask for an upgrade).

Wallet can contain multiple accounts in an object of objects. The first account is the primary account and is labelled like this by default. 

Every accounts objects but primary of brain wallets contains an encrypted private key. Brain wallets primary do not contains an encrypted private key because it is retrieved by the password / passphrase.

Each wallet has an `algo` property, it is needed to know how to decrypt the accounts.

Wallet files (.wlt) are just storing a wallet object as base 64 strings.

### 9.1 - Create simple wallets

`nem.model.wallet.createPRNG` create a wallet object with the primary account's private key generated from a PRNG

```javascript
// Set a wallet name
var walletName = "QuantumMechanicsPRNG";

// Set a password
var password = "Something";

// Create PRNG wallet
var wallet = nem.model.wallet.createPRNG(walletName, password, nem.model.network.data.testnet.id);
```

### 9.2 - Create brain wallets

`nem.model.wallet.createBrain` create a wallet object with primary account's private key derived from a password/passphrase

```javascript
// Set a wallet name
var walletName = "QuantumMechanicsBrain";

// Set a password/passphrase
var password = "Something another thing and something else";

// Create Brain wallet
var wallet = nem.model.wallet.createBrain(walletName, password, nem.model.network.data.testnet.id);
```

### 9.3 - Create private key wallets

`nem.model.wallet.importPrivateKey` create a wallet object with primary account's private key imported

```javascript
// Set a wallet name
var walletName = "QuantumMechanicsImported";

// Set a password
var password = "Something";

// Set private key
var privateKey = "Private key to import";

// Create a private key wallet
var wallet = nem.model.wallet.importPrivateKey(walletName, password, privateKey, nem.model.network.data.testnet.id);
``` 

### 9.4 - Create wallet files

Create an empty file, name it `walletName.wlt` and put the base 64 string given by below code

```javascript
// Convert stringified wallet object to word array
var wordArray = nem.crypto.js.enc.Utf8.parse(JSON.stringify(wallet));

// Word array to base64
var base64 = nem.crypto.js.enc.Base64.stringify(wordArray);
``` 

### 9.5 - Decrypt account in wallet

`nem.crypto.helpers.passwordToPrivatekey` is a function to decrypt an account into a wallet and return it's private key into the `common` object

```javascript
// Create a common object
var common = nem.model.objects.create("common")("walletPassword/passphrase", "");

// Get the wallet account to decrypt
var walletAccount = wallet.accounts[index];

// Decrypt account private key 
nem.crypto.helpers.passwordToPrivatekey(common, walletAccount, wallet.algo);

// The common object now has a private key
console.log(common)

``` 

## 10 - Apostille

**Namespace**: `nem.model.apostille`

**Public methods**:
- `create`
- `generateAccount`
- `hashing`
- `verify`

This namespace is used to create and verify Apostilles. For detailled informations about Apostille: https://www.nem.io/ApostilleWhitePaper.pdf

### 10.1 - Create an Apostille

`nem.model.apostille.create` create an apostille object containing information about the apostille, and the transaction ready to be sent via `nem.model.transactions.send`.

#### Example

```javascript
// Create a common object holding key
var common = nem.model.objects.create("common")("", "privateKey");

// Simulate the file content
var fileContent = nem.crypto.js.enc.Utf8.parse('Apostille is awesome !');

// Create the Apostille
var apostille = nem.model.apostille.create(common, "Test.txt", fileContent, "Test Apostille", nem.model.apostille.hashing["SHA256"], false, {}, true, nem.model.network.data.testnet.id);

// Serialize transfer transaction and announce
nem.model.transactions.send(common, apostille.transaction, endpoint).then(...)
```

- See `examples/node/apostille/create` for creation example in node

### 10.2 - Verify an Apostille

`nem.model.apostille.verify` verify an apostille from a file content (as Word Array) and an apostille transaction object.

```javascript
// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Simulate the file content
var fileContent = nem.crypto.js.enc.Utf8.parse('Apostille is awesome !');

// Transaction hash of the Apostille
var txHash = "9b2dc096fb55e610c97a870b1d385458ca3d60b6f656428a981069ab8edd9a28";

// Get the Apostille transaction from the chain
nem.com.requests.transaction.byHash(endpoint, txHash).then(function(res) {
  // Verify
  if (nem.model.apostille.verify(fileContent, res.transaction)) {
    console.log("Apostille is valid");
  } else {
    console.log("Apostille is invalid");
  }
}, function(err) {
  console.log("Apostille is invalid");
  console.log(err);
});
```

- See `examples/node/apostille/audit` for verification example in node

### 10.3 - More

Consult `src/model/apostille.js` for more details