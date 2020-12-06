/**
 * An url encoded header
 *
 * @type {object}
 */
const urlEncoded = {
  "Content-Type": "application/x-www-form-urlencoded",
};

/**
 * Create an application/json header
 *
 * @return {object} - An application/json header
 */
const json = {
  "Content-Type": "application/json",
};

module.exports = {
  urlEncoded,
  json,
};
