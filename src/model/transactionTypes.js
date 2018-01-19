/**
 * The transfer transaction type
 *
 * @type {string}
 *
 * @default
 */
const transfer = 0x101; // 257

/**
 * The importance transfer type
 *
 * @type {string}
 *
 * @default
 */
const importanceTransfer = 0x801; // 2049

/**
 * The aggregate modification transaction type
 *
 * @type {string}
 *
 * @default
 */
const multisigModification = 0x1001; // 4097

/**
 * The multisignature signature transaction type
 *
 * @type {string}
 *
 * @default
 */
const multisigSignature = 0x1002; // 4098

/**
 * The multisignature transaction type
 *
 * @type {string}
 *
 * @default
 */
const multisigTransaction = 0x1004; // 4100

/**
 * The provision namespace transaction type
 *
 * @type {string}
 *
 * @default
 */
const provisionNamespace = 0x2001; // 8193

/**
 * The mosaic definition transaction type
 *
 * @type {string}
 *
 * @default
 */
const mosaicDefinition = 0x4001; // 16385

/**
 * The mosaic supply change transaction type
 *
 * @type {string}
 *
 * @default
 */
const mosaicSupply = 0x4002; // 16386

module.exports = {
  transfer,
  importanceTransfer,
  multisigModification,
  multisigSignature,
  multisigTransaction,
  provisionNamespace,
  mosaicDefinition,
  mosaicSupply,
};
