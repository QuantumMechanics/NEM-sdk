/**
 * The default testnet node
 *
 * @type {string}
 */
const defaultTestnet = 'http://bigalice2.nem.ninja';

/**
 * The default mainnet node
 *
 * @type {string}
 */
const defaultMainnet = 'http://alice6.nem.ninja';

/**
 * The default mijin node
 *
 * @type {string}
 */
const defaultMijin = '';

/**
 * The default mainnet block explorer
 *
 * @type {string}
 */
const mainnetExplorer = 'http://chain.nem.ninja/#/transfer/';

/**
 * The default testnet block explorer
 *
 * @type {string}
 */
const testnetExplorer = 'http://bob.nem.ninja:8765/#/transfer/';

/**
 * The default mijin block explorer
 *
 * @type {string}
 */
const mijinExplorer = '';

/**
 * The nodes allowing search by transaction hash on testnet
 *
 * @type {array}
 */
const searchOnTestnet = [
  {
    uri: 'http://bigalice2.nem.ninja',
    location: 'America / New_York',
  },
  {
    uri: 'http://192.3.61.243',
    location: 'America / Los_Angeles',
  },
  {
    uri: 'http://23.228.67.85',
    location: 'America / Los_Angeles',
  },
];

/**
 * The nodes allowing search by transaction hash on mainnet
 *
 * @type {array}
 */
const searchOnMainnet = [
  {
    uri: 'http://62.75.171.41',
    location: 'Germany',
  }, {
    uri: 'http://104.251.212.131',
    location: 'USA',
  }, {
    uri: 'http://45.124.65.125',
    location: 'Hong Kong',
  }, {
    uri: 'http://185.53.131.101',
    location: 'Netherlands',
  }, {
    uri: 'http://sz.nemchina.com',
    location: 'China',
  },
];

/**
 * The nodes allowing search by transaction hash on mijin
 *
 * @type {array}
 */
const searchOnMijin = [
  {
    uri: '',
    location: '',
  },
];

/**
 * The testnet nodes
 *
 * @type {array}
 */
const testnet = [
  {
    uri: 'http://104.128.226.60',
  }, {
    uri: 'http://23.228.67.85',
  }, {
    uri: 'http://192.3.61.243',
  }, {
    uri: 'http://50.3.87.123',
  }, {
    uri: 'http://localhost',
  },
];

/**
 * The mainnet nodes
 *
 * @type {array}
 */
const mainnet = [
  {
    uri: 'http://62.75.171.41',
  }, {
    uri: 'http://san.nem.ninja',
  }, {
    uri: 'http://go.nem.ninja',
  }, {
    uri: 'http://hachi.nem.ninja',
  }, {
    uri: 'http://jusan.nem.ninja',
  }, {
    uri: 'http://nijuichi.nem.ninja',
  }, {
    uri: 'http://alice2.nem.ninja',
  }, {
    uri: 'http://alice3.nem.ninja',
  }, {
    uri: 'http://alice4.nem.ninja',
  }, {
    uri: 'http://alice5.nem.ninja',
  }, {
    uri: 'http://alice6.nem.ninja',
  }, {
    uri: 'http://alice7.nem.ninja',
  }, {
    uri: 'http://localhost',
  },
];

/**
 * The mijin nodes
 *
 * @type {array}
 */
const mijin = [
  {
    uri: '',
  },
];

/**
 * The server verifying signed apostilles
 *
 * @type {string}
 */
const apostilleAuditServer = 'http://185.117.22.58:4567/verify';

/**
 * The API to get all supernodes
 *
 * @type {string}
 */
const supernodes = 'https://supernodes.nem.io/nodes';

/**
 * The API to get XEM/BTC market data
 *
 * @type {string}
 */
const marketInfo = 'https://poloniex.com/public';

/**
 * The API to get BTC/USD market data
 *
 * @type {string}
 */
const btcPrice = 'https://blockchain.info/ticker';

/**
 * The default endpoint port
 *
 * @type {number}
 */
const defaultPort = 7890;

/**
 * The Mijin endpoint port
 *
 * @type {number}
 */
const mijinPort = 7895;

/**
 * The websocket port
 *
 * @type {number}
 */
const websocketPort = 7778;

module.exports = {
  defaultTestnet,
  defaultMainnet,
  defaultMijin,
  mainnetExplorer,
  testnetExplorer,
  mijinExplorer,
  searchOnTestnet,
  searchOnMainnet,
  searchOnMijin,
  testnet,
  mainnet,
  mijin,
  apostilleAuditServer,
  supernodes,
  defaultPort,
  mijinPort,
  websocketPort,
  marketInfo,
  btcPrice,
};
