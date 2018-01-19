import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import KeyPair from '../../crypto/keyPair';
import Objects from '../objects';
import Sinks from '../sinks';
import MultisigWrapper from './multisigWrapper';


/** *
 * Create a namespace provision transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {string} rentalFeeSink - The rental sink account
 * @param {number} rentalFee - The rental fee
 * @param {string} namespaceParent - The parent namespace
 * @param {string} namespaceName  - The namespace name
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [ProvisionNamespaceTransaction]{@link http://bob.nem.ninja/docs/#provisionNamespaceTransaction} object
 */
const _construct = function (senderPublicKey, rentalFeeSink, rentalFee, namespaceParent, namespaceName, due, network) {
  const timeStamp = Helpers.createNEMTimeStamp();
  const version = Network.getVersion(1, network);
  const data = Objects.create('commonTransactionPart')(TransactionTypes.provisionNamespace, senderPublicKey, timeStamp, due, version);
  const fee = Fees.namespaceAndMosaicCommon;
  const custom = {
    rentalFeeSink: rentalFeeSink.toUpperCase().replace(/-/g, ''),
    rentalFee,
    parent: namespaceParent,
    newPart: namespaceName,
    fee,
  };
  const entity = Helpers.extendObj(data, custom);
  return entity;
};

/**
 * Prepare a namespace provision transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared namespaceProvisionTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [ProvisionNamespaceTransaction]{@link http://bob.nem.ninja/docs/#provisionNamespaceTransaction} object ready for serialization
 */
const prepare = function (common, tx, network) {
  if (!common || !tx || !network) throw new Error('Missing parameter !');
  const kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
  const actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
  const rentalFeeSink = Sinks.namespace[network].toUpperCase().replace(/-/g, '');
  let rentalFee;
  // Set fee depending if namespace or sub
  if (tx.namespaceParent) {
    rentalFee = Fees.subProvisionNamespaceTransaction;
  } else {
    rentalFee = Fees.rootProvisionNamespaceTransaction;
  }
  const namespaceParent = tx.namespaceParent ? tx.namespaceParent.fqn : null;
  const namespaceName = tx.namespaceName.toString();
  const due = network === Network.data.testnet.id ? 60 : 24 * 60;
  let entity = _construct(actualSender, rentalFeeSink, rentalFee, namespaceParent, namespaceName, due, network);
  if (tx.isMultisig) {
    entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
  }
  return entity;
};


module.exports = {
  prepare,
};
