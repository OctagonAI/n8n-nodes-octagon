import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Professional credential configuration for Octagon API
 * Handles secure authentication with Octagon's AI Agents API
 *
 * @author Octagon <ken@octagonai.co>
 * @version 1.0.4
 * @since 2024-01-15
 */
export class OctagonApi implements ICredentialType {
	name = 'octagonApi';
	displayName = 'Octagon API';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-not-http-url
	documentationUrl = 'httpsDocsOctagonagentsCom';
	properties: INodeProperties[] = [
		{
			displayName:
				'Get your free Octagon API Key at: <a href="https://app.octagonai.co/signup" target="_blank">app.octagonai.co/signup</a>',
			name: 'notice',
			type: 'notice',
			default: '',
			displayOptions: {
				show: {},
			},
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder: 'oct_1234567890abcdef...',
			description: 'Your Octagon API key from Settings → API Keys in your account',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api-gateway.octagonagents.com',
			url: '/v1/responses',
			method: 'POST',
			body: {
				query: 'Get everything for Octagon AI',
				agent: 'octagon-agent',
			},
		},
	};
}
