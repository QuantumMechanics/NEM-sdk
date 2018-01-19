import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import KeyPair from '../../crypto/keyPair';
import Objects from '../objects';

/**
 * Prepare a signature transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared signature transaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MultisigSignatureTransaction]{@link http://bob.nem.ninja/docs/#multisigSignatureTransaction} object ready for serialization
 */
const prepare = function (common, tx, network) {
  if (!common || !tx || !network) throw new Error('Missing parameter !');
  const kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
  const due = network === Network.data.testnet.id ? 60 : 24 * 60;

  const senderPublicKey = kp.publicKey.toString();
  const timeStamp = Helpers.createNEMTimeStamp();
  const version = Network.getVersion(1, network);
  const data = Objects.create('commonTransactionPart')(TransactionTypes.multisigSignature, senderPublicKey, timeStamp, due, version);
  const fee = Fees.signatureTransaction;

  const custom = {
    fee,
  };
  const entity = Helpers.extendObj(tx, data, custom);
  return entity;
};

module.exports = {
  prepare,
};

