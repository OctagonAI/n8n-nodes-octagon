import { INodeType, ICredentialType } from 'n8n-workflow';
import { OctagonAgents } from './nodes/OctagonAgents/OctagonAgents.node';
import { OctagonApi } from './credentials/OctagonApi.credentials';

export const nodeTypes: INodeType[] = [new OctagonAgents()];

export const credentialTypes: ICredentialType[] = [new OctagonApi()];
