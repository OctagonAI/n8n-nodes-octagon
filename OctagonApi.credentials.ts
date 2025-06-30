import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * Professional credential configuration for Octagon API
 * Handles secure authentication with Octagon's AI Agents API
 * 
 * @author Octagon <ken@octagonai.co>
 * @version 1.0.0
 * @since 2024-01-15
 */
export class OctagonApi implements ICredentialType {
  name = 'octagonApi';
  displayName = 'Octagon API';
  // nodelinter-ignore-next-line cred-class-field-documentation-url-not-http-url
  documentationUrl = 'https://docs.octagonagents.com/authentication';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Octagon API key. Get it from Settings → API Keys in your Octagon account.',
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
} 