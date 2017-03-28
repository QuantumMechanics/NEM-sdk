# NEM-sdk
NEM Developer Kit for Node.js and the browser

## 1 - Introduction

This SDK is just a "draft" for now, lot of things will change as development and feedback goes, but it is enough to start developing great applications.

Nano Wallet will integrate this library instead of everything being merged in the same project. So we have a real separation between core and client.

#### Features:
- Easy integration
- Organised in namespaces
- Create wallets compatible with Nano Wallet client
- Simple transactions
- Mosaic transactions
- Encrypted, unencrypted and hex messaging
- Helpers and formatting functions
- 22 NIS API requests with promises
- Commented code and examples

### 1.1 - Installation

#### For the browser

Download the library source, open the `dist/` folder and put `nem-sdk.js` into your project.

Library include the `require()` function so you can `require()` the module directly

```html
<script src="nem-sdk.js"></script>
<script>
  // Include the library
  var nem = require("nem").default;
  console.log(nem)
</script>
```

#### For Node

No npm version yet so node users need to build the library from source or use the browser version in their node project

```javascript
// Use browser version in node
var nem = require("Path/to/nem-sdk.js").default;

// Use the library build/ folder
var nem = require("path/to/build/index.js").default;
``` 
### 1.2 - Build

#### Install dependencies

```npm install```

#### Build

```npm run build```

#### Build for the browser (after above build)

```npm run browserify```

### 1.3 - Organisation

The SDK is organised in namespaces and sub-namespaces. 

There is 4 main namespaces:

**nem.com**
- **requests**: Requests to NIS and the outside world

**nem.crypto**
- **keyPair**: Functions to create keypair from hex and sign data with it
- **helpers**: Miscellaneous cryptographic functions, like encrypt private key, decrypt a wallet, derive a password...
- **nacl**: External cryptographic library modified for NEM
- **js**: Access to the crypto-js library

**nem.model**
- **address**: Functions regarding NEM addresses like base32 encoding / decoding, verify, convert public key to address...
- **objects**: Contains usesul objects models
- **fees**: Contains all the transaction fees and calculation functions
- **network**: Contains networks types and functions related
- **nodes**: Contains array of nodes for different networks, default nodes, search by hash nodes...
- **sinks**: Contains the sink addresses for namespaces and mosaics by network
- **transactions**: Contains functions to prepare and send transaction objects
- **transactionTypes**: Contains all the NEM transactions types
- **wallet**: Contains functions to create wallets

**nem.utils**
- **convert**: Contains convertion functions
- **helpers**: Contains miscellaneous helper functions
- **format**: Contains miscellaneous formatting functions
- **nty**: Contains functions to build nty data
- **Serialization**: Contains functions to serialize transactions

Consult the code directly for details, almost all functions are commented, with parameters, return values and types. 

## 2 - Objects

**Namespace**: `nem.model.objects`

**Public methods**:
- `get`
- `create`

**Keywords**:

- **common**: An object to hold password and private key
- **endpoint**: An object containing info about a remote node
- **mosaicAttachment**: An object containing mosaic data to join in a transfer transaction
- **mosaicDefinitionMetaDataPair**: An object of objects containing mosaics properties
- **invoice**: An invoice object working on NEM mobile clients
- **transferTransaction**: An un-prepared transfer transaction object

When using this library you will manipulate a lot of objects, for ease, objects models are stored into a dedicated namespace. 
You can get an empty object by using `get` or use `create` for an object with parameters.

### 2.1 - Get objects

Return an empty object

#### Usage

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

Return an object with parameters

#### Usage

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

**Keywords**:
- `transfertransaction`
- `mosaicTransferTransaction`

This namespace is used to prepare and send transactions. 

For now only preparation of simple and mosaics transactions with encrypted, unencrypted and hex messages are implemented.

### 3.1 - Create and prepare transaction objects

In part 2 you can see in the examples how to build a transfer transaction object, with or without data.

Transaction objects you will create via `nem.model.object` are un-prepared transaction objects. They only contain raw / incomplete data and need to be arranged before being signed and sent.

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

#### Note

Amounts are in the smallest unit possible in a prepared transaction object:

> 1000000 = 1 XEM

### 3.2 - Sending prepared transactions

Once your transaction is prepared simply use the `send` function of the namespace:

```
// Serialize transfer transaction and announce
nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res) {....});

```

**`common`** is a `common` object containing a private key.

**`transactionEntity`** is the prepared transaction object.

**`endpoint`** is an endpoint object (See 4.1)

**`res`** returned by the callback will contain a NemAnnounceResult object (http://bob.nem.ninja/docs/#nemAnnounceResult)

### 3.3 - Transfer transactions without mosaics

The two provided exemple speaks for themselves:

- See `examples/node/transfer.js` for node
- See `examples/browser/transfer` for browser

The node version contains only the strict necessary while browser example needs to handle form and update fees.

### 3.4 - Transfer transactions with mosaics

- See `examples/node/mosaicTransfer.js` for node
- See `examples/browser/mosaicTransfer` for browser

Similar to transfer transaction, it use the same un-prepared `transferTransaction` object, but needs an array of `mosaicAttachment` objects.

Keyword of the preparation function is `mosaicTransferTransaction`.

Preparation of mosaic transfer transactions requires a `mosaicDefinitionMetaDataPair` object containing mosaic definitions of the mosaics you are joigning to the transaction. 

Definitions are needed to know informations about the included mosaic(s) and calculate quantity and fee accordingly.

#### Two ways are possible to get mosaic definitions:

 1) You can take it from NIS API using http://bob.nem.ninja/docs/#retrieving-mosaic-definitions and put the definition into `model/object.js`, in the `mosaicDefinitionMetaDataPair` object (like shown by the comments). If mosaics used in your application are fixed, it is the way to go.

 2) Query the network using the embedded API requests (`nem.com.requests.namespace.mosaicDefinitions`) as shown in the examples. If mosaics used in your application are not fixed, it is the way to go.

## 4 - Requests

### 4.1 - Create endpoints

To make requests to an NIS you need to pass an endpoint object. The object contains the node host and port so it is easier to handle.

```javascript
// Custom endpoint
var endpoint = nem.model.objects.create("endpoint")("http://myNode", 7890);

// Using sdk data
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
```

### 4.2 - API

**Namespace**: `nem.com.requests`

22 NIS API calls and a few other external requests are implemented and organised in namespaces:

#### **nem.com.requests.account**:
- **data**: Gets account data
- **harvestedBlocks**: Gets harvested blocks
- **incomingTransactions**: Gets incoming transactions
- **unconfirmedTransactions**: Gets unconfirmed transactions
- **allTransactions**: Gets all transactions
- **stopHarvesting**: Stop delegated harvesting
- **startHarvesting**: Start delegated harvesting
- **forwarded**: Gets the account data of the account for which the given account is the delegate account
- **namespaces**: Gets namespaces that an account owns
- **mosaics**: Gets mosaics that an account owns
- **mosaicDefinitions**: Gets mosaic definitions that an account owns
- **mosaicDefinitionsCreated**: Gets mosaic definitions that an account has created
- **unlockInfo**: Gets information about the maximum number of allowed harvesters and how many harvesters are already using the node

#### **nem.com.requests.apostille**:
- **audit**: Audit an apostille

#### **nem.com.requests.chain**:
- **height**: Gets the chain height
- **lastBlock**: Gets the last block
- **time**: Get network time

#### **nem.com.requests.endpoint**:
- **heartbeat**: Gets the node status

#### **nem.com.requests.market**:
- **xem**: Gets XEM price in BTC
- **btc**: Gets BTC price in $

#### **nem.com.requests.namespace**:
- **roots**: Gets root namespaces
- **info**: Gets the namespace with given id
- **mosaicDefinitions**: Gets mosaic definitions of a namespace

#### **nem.com.requests.supernodes**:
- **all**: Gets all supernodes info

#### **nem.com.requests.transaction**:
- **byHash**: Gets a transaction by hash
- **announce**: Announce a transaction to the network

### 4.3 - Usage

Requests are wrapped in `Promises` which allow to use "then" for callbacks

#### Examples:

``` javascript
// Gets chain height
nem.com.requests.chain.height(endpoint).then(function(res) {
	console.log(res)
}, function(err) {
	console.error(err)
})

// Gets account data
nem.com.requests.account.get(endpoint, "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S").then(...);
```

### 4.4 - More

Consult `src/com/requests` for details about requests parameters.

- See `examples/browser/monitor` for browser demonstration
- See `examples/node/requests` for all requests in node

## 5 - Helpers and Format

### 5.1 - Helpers

**Namespace**: `nem.utils.helpers`

**Public methods**:
- `haveWallet`
- `needsSignature`
- `txTypeToName`
- `haveTx`
- `getTransactionIndex`
- `mosaicIdToName`
- `getHostname`
- `haveCosig`
- `getFileName`
- `getExtension`
- `createNEMTimeStamp`
- `fixPrivateKey`
- `prepareMessage`
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

#### Format address example

```javascript
var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

// Add hyphens to NEM address
var fmtAddress = nem.utils.format.address(address); //TBCI2A-67UQZA-KCR6NS-4JWAEI-CEIGEI-M72G3M-VW5S
```
#### Format a nem quantity example

```javascript
var xemQuantity = 10003002; // Smallest unit

var fmt = nem.utils.format.nemValue(transactionEntity.fee)

// Format quantity
var fmtFee = fmt[0] + "." + fmt[1]; // 10.003002 XEM
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

To create a key pair you need a private key.

```javascript
var keyPair = nem.crypto.keyPair.create(privateKey);
```

### 6.3 - Sign with key pairs

To sign a transaction or any other data simply use the above `keyPair` object:

```javascript
var signature = keyPair.sign(data);
```

### 6.4 - Extract public key from key pair

You can extract the public key from the `keyPair` object very easily

```javascript
var publicKey = keyPair.publicKey.toString();
```

## 7 - Addresses

Addresses are base32 string used to receive XEM. They look like this:

> NAMOAV-HFVPJ6-FP32YP-2GCM64-WSRMKX-A5KKYW-WHPY
> NAMOAVHFVPJ6FP32YP2GCM64WSRMKXA5KKYWWHPY

The version without hyphens ("-") is the one we'll use in our queries and lower level processing. The formatted version is only for visual purposes.

#### Beggining of the address depend of the network:

- **Mainnet (104)**: N

- **Testnet (-104)**: T

- **Mijin (96)**: M

### 7.1 - Convert public key to an address

Addresses are just public keys "compressed" in base 32.

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

Namespace: `nem.crypto.helpers`

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

Namespace: `nem.model.wallets`

**Public methods**:
- `createPRNG`
- `createBrain`
- `importPrivatekey`

The SDK allow to create wallets 100% compatible with the Nano Wallet client (as BIP32 not implemented yet the client will ask for an upgrade).

Wallet can contain multiple accounts in an object of objects. The first account is the primary account and is labelled like this by default. 

Every accounts objects but primary of brain wallets contains an encrypted private key. Brain wallets primary do not contains an encrypted private key because it is retrieved by the password / passphrase.

Each wallet has an `algo` property, it is needed to know how to decrypt the accounts.

Wallet files (.wlt) are just storing a wallet object as base 64 strings.

### 9.1 - Create a simple wallet

Create a wallet with the primary account's private key generated from a PRNG

```javascript
// Set a wallet name
var walletName = "QuantumMechanicsPRNG";

// Set a password
var password = "Something";

// Create PRNG wallet
var wallet = nem.model.wallet.createPRNG(walletName, password, nem.model.network.data.testnet.id));
```

### 9.2 - Create a brain wallet

Create a wallet with primary account's private key derived from a password/passphrase

```javascript
// Set a wallet name
var walletName = "QuantumMechanicsBrain";

// Set a password/passphrase
var password = "Something another thing and something else";

// Create Brain wallet
var wallet = nem.model.wallet.createBrain(walletName, password, nem.model.network.data.testnet.id));
```

### 9.3 - Create a private key wallet

Create a wallet with primary account's private key imported

```javascript
// Set a wallet name
var walletName = "QuantumMechanicsImported";

// Set a password
var password = "Something";

// Create a private key wallet
var wallet = nem.model.wallet.importPrivatekey(walletName, password, privateKey, nem.model.network.data.testnet.id));
``` 

### 9.4 - Create the wallet file

Create an empty file, name it `walletName.wlt` and put the base 64 string given by below code

```javascript
// Convert stringified wallet object to word array
var wordArray = nem.crypto.js.enc.Utf8.parse(JSON.stringify(wallet));

// Word array to base64
var base64 = nem.crypto.js.enc.Base64.stringify(wordArray);
``` 

### 9.4 - Decrypt wallet account

`nem.crypto.helpers.passwordToPrivatekey` is a function to decrypt an account into a wallet and return it's private key into the common object

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