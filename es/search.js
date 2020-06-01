const esClient = require('./esclient');

const search = async function (indexName, type, payload) {
	return await esClient.search({
		index: indexName,
		type: type,
		body: payload,
	});
};

module.exports = search;
