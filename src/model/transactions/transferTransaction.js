import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import KeyPair from '../../crypto/keyPair';
import Objects from '../objects';
import MultisigWrapper from './multisigWrapper';
import Message from './message';


/** *
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
const _construct = function (senderPublicKey, recipientCompressedKey, amount, message, msgFee, due, mosaics, mosaicsFee, network) {
  const timeStamp = Helpers.createNEMTimeStamp();
  const version = mosaics ? Network.getVersion(2, network) : Network.getVersion(1, network);
  const data = Objects.create('commonTransactionPart')(TransactionTypes.transfer, senderPublicKey, timeStamp, due, version);
  const fee = mosaics ? mosaicsFee : Fees.currentFeeFactor * Fees.calculateMinimum(amount / 1000000);
  const totalFee = Math.floor((msgFee + fee) * 1000000);
  const custom = {
    recipient: recipientCompressedKey.toUpperCase().replace(/-/g, ''),
    amount,
    fee: totalFee,
    message,
    mosaics,
  };
  const entity = Helpers.extendObj(data, custom);
  return entity;
};


/**
 * Prepare a transfer transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared transfer transaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [TransferTransaction]{@link http://bob.nem.ninja/docs/#transferTransaction} object ready for serialization
 */
const prepare = function (common, tx, network) {
  if (!common || !tx || !network) throw new Error('Missing parameter !');
  const kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
  const actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
  const recipientCompressedKey = tx.recipient.toString();
  const amount = Math.round(tx.amount * 1000000);
  const message = Message.prepare(common, tx);
  const msgFee = Fees.calculateMessage(message, common.isHW);
  const due = network === Network.data.testnet.id ? 60 : 24 * 60;
  const mosaics = null;
  const mosaicsFee = null;
  let entity = _construct(actualSender, recipientCompressedKey, amount, message, msgFee, due, mosaics, mosaicsFee, network);
  if (tx.isMultisig) {
    entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
  }
  return entity;
};


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
const prepareMosaic = function (common, tx, mosaicDefinitionMetaDataPair, network) {
  if (!common || !tx || !mosaicDefinitionMetaDataPair || tx.mosaics === null || !network) throw new Error('Missing parameter !');
  const kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
  const actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
  const recipientCompressedKey = tx.recipient.toString();
  const amount = Math.round(tx.amount * 1000000);
  const message = Message.prepare(common, tx);
  const msgFee = Fees.calculateMessage(message, common.isHW);
  const due = network === Network.data.testnet.id ? 60 : 24 * 60;
  const mosaics = tx.mosaics;
  const mosaicsFee = Fees.calculateMosaics(amount, mosaicDefinitionMetaDataPair, mosaics);
  let entity = _construct(actualSender, recipientCompressedKey, amount, message, msgFee, due, mosaics, mosaicsFee, network);
  if (tx.isMultisig) {
    entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
  }
  return entity;
};

module.exports = {
  prepare,
  prepareMosaic,
};
