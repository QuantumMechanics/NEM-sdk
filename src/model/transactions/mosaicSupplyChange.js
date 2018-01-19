import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import KeyPair from '../../crypto/keyPair';
import Objects from '../objects';
import MultisigWrapper from './multisigWrapper';


/** *
 * Create a mosaic supply change transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {object} mosaicId - The mosaic id
 * @param {number} supplyType - The type of change
 * @param {number} delta - The amount involved in the change
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicSupplyChangeTransaction]{@link http://bob.nem.ninja/docs/#mosaicSupplyChangeTransaction} object
 */
const _construct = function (senderPublicKey, mosaicId, supplyType, delta, due, network) {
  const timeStamp = Helpers.createNEMTimeStamp();
  const version = Network.getVersion(1, network);
  const data = Objects.create('commonTransactionPart')(TransactionTypes.mosaicSupply, senderPublicKey, timeStamp, due, version);
  const fee = Fees.namespaceAndMosaicCommon;
  const custom = {
    mosaicId,
    supplyType,
    delta,
    fee,
  };
  const entity = Helpers.extendObj(data, custom);
  return entity;
};

/**
 * Prepare a mosaic supply change transaction
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared mosaicSupplyChangeTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicSupplyChangeTransaction]{@link http://bob.nem.ninja/docs/#mosaicSupplyChangeTransaction} object ready for serialization
 */
const prepare = function (common, tx, network) {
  const kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
  const actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
  const due = network === Network.data.testnet.id ? 60 : 24 * 60;
  let entity = _construct(actualSender, tx.mosaic, tx.supplyType, tx.delta, due, network);
  if (tx.isMultisig) {
    entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
  }
  return entity;
};

module.exports = {
  prepare,
};
