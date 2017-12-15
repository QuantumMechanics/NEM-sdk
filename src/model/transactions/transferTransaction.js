import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import KeyPair from '../../crypto/keyPair';
import Objects from '../objects';
import MultisigWrapper from './multisigWrapper';
import Message from './message';

/**
 * Prepare a transfer transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared transfer transaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [TransferTransaction]{@link http://bob.nem.ninja/docs/#transferTransaction} object ready for serialization
 */
let prepare = function(common, tx, network){
    if (!common || !tx || !network) throw new Error('Missing parameter !');
	let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    let recipientCompressedKey = tx.recipient.toString();
    let amount = Math.round(tx.amount * 1000000);
    let message = Message.prepare(common, tx);
    let msgFee = Fees.calculateMessage(message, common.isHW);
    let due = network === Network.data.testnet.id ? 60 : 24 * 60;
    let mosaics = null;
    let mosaicsFee = null
    let entity = _construct(actualSender, recipientCompressedKey, amount, message, msgFee, due, mosaics, mosaicsFee, network);
    if (tx.isMultisig) {
        entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
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
let prepareMosaic = function(common, tx, mosaicDefinitionMetaDataPair, network){
    if (!common || !tx || !mosaicDefinitionMetaDataPair || tx.mosaics === null || !network) throw new Error('Missing parameter !');
    let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    let recipientCompressedKey = tx.recipient.toString();
    let amount = Math.round(tx.amount * 1000000);
    let message = Message.prepare(common, tx);
    let msgFee = Fees.calculateMessage(message, common.isHW);
    let due = network === Network.data.testnet.id ? 60 : 24 * 60;
    let mosaics = tx.mosaics;
    let mosaicsFee = Fees.calculateMosaics(amount, mosaicDefinitionMetaDataPair, mosaics);
    let entity = _construct(actualSender, recipientCompressedKey, amount, message, msgFee, due, mosaics, mosaicsFee, network);
    if (tx.isMultisig) {
        entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
}

/***
 * Create a transfer transaction object
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
let _construct = function(senderPublicKey, recipientCompressedKey, amount, message, msgFee, due, mosaics, mosaicsFee, network) {
    let timeStamp = Helpers.createNEMTimeStamp();
    let version = mosaics ? Network.getVersion(2, network) : Network.getVersion(1, network);
    let data = Objects.create("commonTransactionPart")(TransactionTypes.transfer, senderPublicKey, timeStamp, due, version);
    let fee = mosaics ? mosaicsFee : Fees.currentFeeFactor * Fees.calculateMinimum(amount / 1000000);
    let totalFee = Math.floor((msgFee + fee) * 1000000);
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

module.exports = {
    prepare,
    prepareMosaic
}