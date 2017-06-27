/**
 * An url encoded header
 *
 * @type {object}
 */
const urlEncoded = {
	'Content-Type': 'application/x-www-form-urlencoded'
}

/**
 * Create an application/json header
 *
 * @param {data} - A json string
 *
 * @return {object} - An application/json header with content length
 */
let json = function(data) {
	return {
		"Content-Type": "application/json",
	    "Content-Length": Buffer.from(data).byteLength
	}
}

module.exports = {
	urlEncoded,
	json
}