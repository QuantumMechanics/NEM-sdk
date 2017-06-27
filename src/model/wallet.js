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
let createPRNG = function (walletName, password, network) {
    if (!walletName.length || !password.length || !network) throw new Error('A parameter is missing !');
    // Generate keypair from random private key
    var privateKey = convert.ua2hex(nacl.randomBytes(32));
    var kp = KeyPair.create(privateKey);
    // Create address from public key
    let addr = Address.toAddress(kp.publicKey.toString(), network);
    // Encrypt private key using password
    let encrypted = CryptoHelpers.encodePrivKey(privateKey, password);
    return Objects.create("wallet")(walletName, addr, true, "pass:bip32", encrypted, network);
}

/**
 * Create a wallet containing a private key generated using a derived passphrase
 *
 * @param {string} walletName - The wallet name
 * @param {string} passphrase - The wallet passphrase
 * @param {number} network - The network id
 *
 * @return {object} - A Brain wallet object
 */
let createBrain = function (walletName, passphrase, network) {
    if (!walletName.length || !passphrase.length || !network) throw new Error('A parameter is missing !');
    var privateKey = CryptoHelpers.derivePassSha(passphrase, 6000).priv;
    var kp = KeyPair.create(privateKey);
    // Create address from public key
    let addr = Address.toAddress(kp.publicKey.toString(), network);
    return Objects.create("wallet")(walletName, addr, true, "pass:6k", "", network);
}

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
let importPrivateKey = function (walletName, password, privateKey, network) {
    if (!walletName.length || !password.length || !network || !privateKey) throw new Error('A parameter is missing !');
    if (!Helpers.isPrivateKeyValid(privateKey)) throw new Error('Private key is not valid !');
    // Create address from private key
    let kp = KeyPair.create(privateKey);
    let addr = Address.toAddress(kp.publicKey.toString(), network);
    // Encrypt private key using password
    let encrypted = CryptoHelpers.encodePrivKey(privateKey, password);
    return Objects.create("wallet")(walletName, addr, false, "pass:enc", encrypted, network);
}

module.exports = {
    createPRNG,
    createBrain,
    importPrivateKey
}