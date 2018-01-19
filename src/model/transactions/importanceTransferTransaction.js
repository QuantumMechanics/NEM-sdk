import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import KeyPair from '../../crypto/keyPair';
import Objects from '../objects';
import MultisigWrapper from './multisigWrapper';

/** *
 * Create an importance transfer transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {string} remotePublicKey - The remote account public key
 * @param {number} mode - 1 for activating, 2 for deactivating
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - An [ImportanceTransferTransaction]{@link https://bob.nem.ninja/docs/#importanceTransferTransaction} object
 */
const _construct = function (senderPublicKey, remotePublicKey, mode, due, network) {
  const timeStamp = Helpers.createNEMTimeStamp();
  const version = Network.getVersion(1, network);
  const data = Objects.create('commonTransactionPart')(TransactionTypes.importanceTransfer, senderPublicKey, timeStamp, due, version);
  const fee = Fees.importanceTransferTransaction;
  const custom = {
    remoteAccount: remotePublicKey,
    mode,
    fee,
  };
  const entity = Helpers.extendObj(data, custom);
  return entity;
};

/**
 * Prepare an importance transfer transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared importanceTransferTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - An [ImportanceTransferTransaction]{@link https://bob.nem.ninja/docs/#importanceTransferTransaction} object ready for serialization
 */
const prepare = function (common, tx, network) {
  if (!common || !tx || !network) throw new Error('Missing parameter !');
  const kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
  const actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
  const due = network === Network.data.testnet.id ? 60 : 24 * 60;
  let entity = _construct(actualSender, tx.remoteAccount, tx.mode, due, network);
  if (tx.isMultisig) {
    entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
  }
  return entity;
};


module.exports = {
  prepare,
};
