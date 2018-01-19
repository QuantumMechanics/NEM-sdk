/**
* Networks info data
*
* @type {object}
*/
const data = {
  mainnet: {
    id: 104,
    prefix: '68',
    char: 'N',
  },
  testnet: {
    id: -104,
    prefix: '98',
    char: 'T',
  },
  mijin: {
    id: 96,
    prefix: '60',
    char: 'M',
  },
};

/**
 * Gets a network prefix from network id
 *
 * @param {number} id - A network id
 *
 * @return {string} - The network prefix
 */
const id2Prefix = function (id) {
  if (id === 104) {
    return '68';
  } else if (id === -104) {
    return '98';
  }
  return '60';
};

/**
 * Gets the starting char of the addresses of a network id
 *
 * @param {number} id - A network id
 *
 * @return {string} - The starting char of addresses
 */
const id2Char = function (id) {
  if (id === 104) {
    return 'N';
  } else if (id === -104) {
    return 'T';
  }
  return 'M';
};

/**
 * Gets the network id from the starting char of an address
 *
 * @param {string} startChar - A starting char from an address
 *
 * @return {number} - The network id
 */
const char2Id = function (startChar) {
  if (startChar === 'N') {
    return 104;
  } else if (startChar === 'T') {
    return -104;
  }
  return 96;
};

/**
 * Gets the network version
 *
 * @param {number} val - A version number (1 or 2)
 * @param {number} network - A network id
 *
 * @return {number} - A network version
 */
const getVersion = function (val, network) {
  if (network === data.mainnet.id) {
    return 0x68000000 | val;
  } else if (network === data.testnet.id) {
    return 0x98000000 | val;
  }
  return 0x60000000 | val;
};

module.exports = {
  data,
  id2Prefix,
  id2Char,
  char2Id,
  getVersion,
};
