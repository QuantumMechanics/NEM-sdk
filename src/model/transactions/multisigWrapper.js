import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import Objects from '../objects';

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
const multisigWrapper = function (senderPublicKey, innerEntity, due, network) {
  const timeStamp = Helpers.createNEMTimeStamp();
  const version = Network.getVersion(1, network);
  const data = Objects.create('commonTransactionPart')(TransactionTypes.multisigTransaction, senderPublicKey, timeStamp, due, version, network);
  const custom = {
    fee: Fees.multisigTransaction,
    otherTrans: innerEntity,
  };
  const entity = Helpers.extendObj(data, custom);
  return entity;
};

export default multisigWrapper;
