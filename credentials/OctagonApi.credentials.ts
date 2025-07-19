import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

import * as packageInfo from '../package.json';

/**
 * Professional credential configuration for Octagon API
 * Handles secure authentication with Octagon's AI Agents API
 *
 * @author Octagon <ken@octagonai.co>
 * @version 1.0.7
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
				'User-Agent': `${packageInfo.name}/${packageInfo.version} (Node.js/${process.versions.node})`,
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api-gateway.octagonagents.com',
			url: '/v1/responses',
			method: 'POST',
			body: {
				model: 'octagon-agent',
				input: 'Test connection',
				stream: true,
			},
		},
	};
}
