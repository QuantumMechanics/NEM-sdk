import nacl from '../external/nacl-fast';
import convert from '../utils/convert';
import Helpers from '../utils/helpers';
import KeyPair from '../crypto/keyPair';
import CryptoHelpers from '../crypto/cryptoHelpers';
import Address from '../model/address';
import Objects from './objects';

/**
 * Create a wallet containing a private key generated using a Pseudo Random Number Generator
 *
 * @param {string} walletName - The wallet name
 * @param {string} password - The wallet password
 * @param {number} network - The network id
 *
 * @return {object} - A PRNG wallet object
 */
const createPRNG = function (walletName, password, network) {
  if (!walletName.length || !password.length || !network) throw new Error('A parameter is missing !');
  // Generate keypair from random private key
  const privateKey = convert.ua2hex(nacl.randomBytes(32));
  const kp = KeyPair.create(privateKey);
  // Create address from public key
  const addr = Address.toAddress(kp.publicKey.toString(), network);
  // Encrypt private key using password
  const encrypted = CryptoHelpers.encodePrivKey(privateKey, password);
  return Objects.create('wallet')(walletName, addr, true, 'pass:bip32', encrypted, network);
};

/**
 * Create a wallet containing a private key generated using a derived passphrase
 *
 * @param {string} walletName - The wallet name
 * @param {string} passphrase - The wallet passphrase
 * @param {number} network - The network id
 *
 * @return {object} - A Brain wallet object
 */
const createBrain = function (walletName, passphrase, network) {
  if (!walletName.length || !passphrase.length || !network) throw new Error('A parameter is missing !');
  const privateKey = CryptoHelpers.derivePassSha(passphrase, 6000).priv;
  const kp = KeyPair.create(privateKey);
  // Create address from public key
  const addr = Address.toAddress(kp.publicKey.toString(), network);
  return Objects.create('wallet')(walletName, addr, true, 'pass:6k', '', network);
};

/**
 * Create a wallet containing any private key
 *
 * @param {string} walletName - The wallet name
 * @param {string} password - The wallet passphrase
 * @param {string} privateKey - The private key to import
 * @param {number} network - The network id
 *
 * @return {object} - A private key wallet object
 */
const importPrivateKey = function (walletName, password, privateKey, network) {
  if (!walletName.length || !password.length || !network || !privateKey) throw new Error('A parameter is missing !');
  if (!Helpers.isPrivateKeyValid(privateKey)) throw new Error('Private key is not valid !');
  // Create address from private key
  const kp = KeyPair.create(privateKey);
  const addr = Address.toAddress(kp.publicKey.toString(), network);
  // Encrypt private key using password
  const encrypted = CryptoHelpers.encodePrivKey(privateKey, password);
  return Objects.create('wallet')(walletName, addr, false, 'pass:enc', encrypted, network);
};

module.exports = {
  createPRNG,
  createBrain,
  importPrivateKey,
};
