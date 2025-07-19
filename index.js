const { OctagonAgents } = require('./dist/nodes/OctagonAgents/OctagonAgents.node');
const { OctagonApi } = require('./dist/credentials/OctagonApi.credentials');

module.exports = {
	nodeTypes: [new OctagonAgents()],
	credentialTypes: [new OctagonApi()],
};
