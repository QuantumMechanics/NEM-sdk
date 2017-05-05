import Network from './network';
import Helpers from '../utils/helpers';
import Convert from '../utils/convert';
import TransactionTypes from './transactionTypes';
import Fees from './fees';
import Serialization from '../utils/serialization';
import KeyPair from '../crypto/keyPair';
import CryptoHelpers from '../crypto/cryptoHelpers';
import Requests from '../com/requests';
import Address from './address';

/**
 * Set the network version
 *
 * @param {number} val - A version number (1 or 2)
 * @param {number} network - A network id
 *
 * @return {number} - A network version
 */
let NETWORK_VERSION = function(val, network) {
    if (network === Network.data.mainnet.id) {
        return 0x68000000 | val;
    } else if (network === Network.data.testnet.id) {
        return 0x98000000 | val;
    }
    return 0x60000000 | val;
}

/**
 * Wrap a transaction in a multisignature transaction
 *
 * @param {string} senderPublicKey - The sender public key
 * @param {object} innerEntity - The transaction entity to wrap
 * @param {number} due - The transaction deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [MultisigTransaction]{@link http://bob.nem.ninja/docs/#multisigTransaction} object
 */
let _multisigWrapper = function(senderPublicKey, innerEntity, due, network) {
	let timeStamp = Helpers.createNEMTimeStamp();
    let version = NETWORK_VERSION(1, network);
    let data = _createCommonPart(TransactionTypes.multisigTransaction, senderPublicKey, timeStamp, due, version, network);
    let custom = {
        'fee': Fees.MultisigTransaction,
        'otherTrans': innerEntity
    };
    let entity = Helpers.extendObj(data, custom);
    return entity;
}

/**
 * Create the common part of a transaction
 *
 * @param {number} txType - A type of transaction
 * @param {string} senderPublicKey - The sender public key
 * @param {number} timeStamp - A timestamp for the transation
 * @param {number} due - A deadline in minutes
 * @param {number} version - A network version
 * @param {number} network - A network id
 *
 * @return {object} - A common transaction object
 */
let _createCommonPart = function(txtype, senderPublicKey, timeStamp, due, version, network) {
    return {
        'type': txtype,
        'version': version || NETWORK_VERSION(1, network),
        'signer': senderPublicKey,
        'timeStamp': timeStamp,
        'deadline': timeStamp + due * 60
    };
}

/**
 * Prepare a transfer transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared transfer transaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [TransferTransaction]{@link http://bob.nem.ninja/docs/#transferTransaction} object ready for serialization
 */
let prepareTransferTransaction = function(common, tx, network){
    if (!common || !tx || !network) throw new Error('Missing parameter !');
	let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    let recipientCompressedKey = tx.recipient.toString();
    let amount = Math.round(tx.amount * 1000000);
    let message = prepareMessage(common, tx);
    let due = network === Network.data.testnet.id ? 60 : 24 * 60;
    let mosaics = null;
    let mosaicsFee = null
    let entity = _constructTransferTransaction(actualSender, recipientCompressedKey, amount, message, due, mosaics, mosaicsFee, network);
    if (tx.isMultisig) {
        entity = _multisigWrapper(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
}


/**
 * Prepare a mosaic transfer transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared transfer transaction object
 * @param {object} mosaicDefinitionMetaDataPair - The mosaicDefinitionMetaDataPair object with properties of mosaics to send
 * @param {number} network - A network id
 *
 * @return {object} - A [TransferTransaction]{@link http://bob.nem.ninja/docs/#transferTransaction} object ready for serialization
 */
let prepareMosaicTransferTransaction = function(common, tx, mosaicDefinitionMetaDataPair, network){
    if (!common || !tx || !mosaicDefinitionMetaDataPair || tx.mosaics === null || !network) throw new Error('Missing parameter !');
    let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    let recipientCompressedKey = tx.recipient.toString();
    let amount = Math.round(tx.amount * 1000000);
    let message = prepareMessage(common, tx);
    let due = network === Network.data.testnet.id ? 60 : 24 * 60;
    let mosaics = tx.mosaics;
    let mosaicsFee = Fees.calculateMosaics(amount, mosaicDefinitionMetaDataPair, mosaics);
    let entity = _constructTransferTransaction(actualSender, recipientCompressedKey, amount, message, due, mosaics, mosaicsFee, network);
    if (tx.isMultisig) {
        entity = _multisigWrapper(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
}

/***
 * Create a transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {string} recipientCompressedKey - The recipient account public key
 * @param {number} amount - The amount to send in micro XEM
 * @param {object} message - The message object
 * @param {number} due - The deadline in minutes
 * @param {array} mosaics - The array of mosaics to send
 * @param {number} mosaicFee - The fees for mosaics included in the transaction
 * @param {number} network - A network id
 *
 * @return {object} - A [TransferTransaction]{@link http://bob.nem.ninja/docs/#transferTransaction} object
 */
let _constructTransferTransaction = function(senderPublicKey, recipientCompressedKey, amount, message, due, mosaics, mosaicsFee, network) {
    let timeStamp = Helpers.createNEMTimeStamp();
    let version = mosaics ? NETWORK_VERSION(2, network) : NETWORK_VERSION(1, network);
    let data = _createCommonPart(TransactionTypes.transfer, senderPublicKey, timeStamp, due, version);
    let msgFee = message.payload.length ? Fees.calculateMessage(message) : 0;
    let fee = mosaics ? mosaicsFee : Fees.calculateMinimum(amount / 1000000);
    let totalFee = (msgFee + fee) * 1000000;
    let custom = {
        'recipient': recipientCompressedKey.toUpperCase().replace(/-/g, ''),
        'amount': amount,
        'fee': totalFee,
        'message': message,
        'mosaics': mosaics
    };
    let entity = Helpers.extendObj(data, custom);
    return entity;
}

/**
 * Prepare a signature transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared signature transaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [TransferTransaction]{@link http://bob.nem.ninja/docs/#transferTransaction} object ready for serialization
 */
let prepareSignatureTransaction = function(common, tx, network) {
    if (!common || !tx || !network) throw new Error('Missing parameter !');
    let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let due = network === Network.data.testnet.id ? 60 : 24 * 60;

    let senderPublicKey = kp.publicKey.toString();
    let timeStamp = Helpers.createNEMTimeStamp();
    let version = NETWORK_VERSION(1, network);
    let data = _createCommonPart(TransactionTypes.multisigSignature, senderPublicKey, timeStamp, due, version);
    let fee = Fees.signatureTransaction;

    let custom = {
        'fee': fee
    };
    let entity = Helpers.extendObj(tx, data, custom);
    return entity;
}

let prepareMultisignatureModificationTransaction = function(){

}

let prepareMosaicDefinitionTransaction = function(){

}

let prepareNamespaceProvisionTransaction = function () {

}

let prepareImportanceTransferTransaction = function() {

}

/**
 * Build a message object
 *
 * @param {object} common - An common object
 * @param {object} tx - An un-prepared transferTransaction object
 *
 * @return {object} - A prepared message object
 */
let prepareMessage = function(common, tx) {
    if (tx.encryptMessage && common.privateKey) {
        return {
            'type': 2,
            'payload': CryptoHelpers.encode(common.privateKey, tx.recipientPubKey, tx.message.toString())
        };
    } else {
        return {
            'type': 1,
            'payload': Helpers.isHexadecimal(tx.message.toString()) && tx.message.toString().substring(0, 2) === 'fe' ? tx.message.toString() : Convert.utf8ToHex(tx.message.toString())
        };
    }
}

/**
 * Serialize a transaction and broadcast it to the network
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {object} entity - The prepared transaction object
 * @param {object} common - A password/privateKey object
 *
 * @return {promise} - An announce transaction promise of the NetworkRequests service
 */
let send = function(common, entity, endpoint) {
    if(!endpoint || !entity || !common) throw new Error('Missing parameter !');
    if (common.privateKey.length !== 64 && common.privateKey.length !== 66) throw new Error('Invalid private key, length must be 64 or 66 characters !');
    if (!Helpers.isHexadecimal(common.privateKey)) throw new Error('Private key must be hexadecimal only !');
    let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let result = Serialization.serializeTransaction(entity);
    let signature = kp.sign(result);
    let obj = {
        'data': Convert.ua2hex(result),
        'signature': signature.toString()
    };
    return Requests.transaction.announce(endpoint, JSON.stringify(obj));
}

/**
 * Prepare a transaction object
 *
 * @param {string} objectName - The name of the object to prepare
 *
 * @retrun {function} - The prepare function corresponding to the object name
 */
let prepare = function(objectName) {
    switch(objectName) {
        case "transferTransaction":
            return prepareTransferTransaction;
            break;
        case "mosaicTransferTransaction":
            return prepareMosaicTransferTransaction;
            break;
        case "signatureTransaction":
            return prepareSignatureTransaction;
            break;
        default:
            return {};
    }
}

module.exports = {
    prepare,
    send,
    prepareMessage
}