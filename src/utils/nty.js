/**
 * Create notary data
 *
 * @param {string} filename - A file name
 * @param {string} tags - File tags
 * @param {string} fileHash - File hash
 * @param {string} txHash - Transaction hash
 * @param {string} txMultisigHash - Multisignature transaction hash
 * @param {string} owner - Account address
 * @param {string} fromMultisig - Multisig account address
 * @param {string} dedicatedAccount - HD account of the file
 * @param {string} dedicatedPrivateKey - Private key of the HD account
 *
 * @return {array} - The notary data
 */
const createNotaryData = function (filename, tags, fileHash, txHash, txMultisigHash, owner, fromMultisig, dedicatedAccount, dedicatedPrivateKey) {
  const d = new Date();
  return {
    data: [{
      filename,
      tags,
      fileHash,
      owner,
      fromMultisig,
      dedicatedAccount,
      dedicatedPrivateKey,
      txHash,
      txMultisigHash,
      timeStamp: d.toUTCString(),
    }],
  };
};

/**
 * Update notary data
 *
 * @param {array} ntyData - The notary data array
 * @param {object} newNtyData - A notary data object
 *
 * @return {array} - The updated notary data array
 */
const updateNotaryData = function (ntyData, newNtyData) {
  ntyData.data.push(newNtyData.data[0]);
  return ntyData;
};

module.exports = {
  createNotaryData,
  updateNotaryData,
};
