import { INodeType, ICredentialType } from 'n8n-workflow';
import { OctagonAgents } from './OctagonAgents.node';
import { OctagonApi } from './OctagonApi.credentials';

export const nodeTypes: INodeType[] = [
  new OctagonAgents(),
];

export const credentialTypes: ICredentialType[] = [
  new OctagonApi(),
];