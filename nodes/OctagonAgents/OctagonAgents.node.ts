import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import * as packageInfo from '../../package.json';

const PREDICTION_MARKETS_AGENT = 'octagon-prediction-markets-agent';
const KALSHI_URL_PATTERN = /https:\/\/kalshi\.com\/markets\/\S+/i;

type PredictionMarketsMode = 'default' | 'cache' | 'refresh';

type ResponseContentItem = {
	text?: string;
	annotations?: IDataObject[];
};

type ResponseOutputItem = {
	content?: ResponseContentItem[];
};

type OctagonResponse = {
	output?: ResponseOutputItem[];
	usage?: IDataObject;
};

type CachePayload = IDataObject;

function resolveModel(agent: string, mode: PredictionMarketsMode): string {
	if (agent !== PREDICTION_MARKETS_AGENT) {
		return agent;
	}

	if (mode === 'cache') {
		return `${PREDICTION_MARKETS_AGENT}:cache`;
	}

	if (mode === 'refresh') {
		return `${PREDICTION_MARKETS_AGENT}:refresh`;
	}

	return PREDICTION_MARKETS_AGENT;
}

function parseCachePayload(analysis: string): CachePayload | undefined {
	try {
		const parsed = JSON.parse(analysis) as unknown;

		if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
			return undefined;
		}

		return parsed as CachePayload;
	} catch {
		return undefined;
	}
}

/**
 * Professional n8n node for Octagon AI Agents
 * Provides access to 15 specialized financial and market research AI agents
 *
 * @author Octagon <ken@octagonai.co>
 * @version 1.1.1
 * @since 2024-01-15
 */
// nodelinter-ignore-next-line node-dirname-against-convention
export class OctagonAgents implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Octagon',
		name: 'octagonAgents',
		icon: 'file:octagon.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["agent"]}}',
		description: 'Financial AI agents',
		defaults: {
			name: 'Octagon',
		},
		usableAsTool: true,
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionType.Main],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'octagonApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Agent',
				name: 'agent',
				type: 'options',
				options: [
					{
						name: '01. Octagon Agent (Router)',
						value: 'octagon-agent',
						description:
							'Intelligent agent router that analyzes queries and routes to specialized agents',
					},
					{
						name: '02. SEC Agent',
						value: 'octagon-sec-agent',
						description:
							'Public market intelligence - Analyzes SEC filings and public company disclosures',
					},
					{
						name: '03. Transcripts Agent',
						value: 'octagon-transcripts-agent',
						description: 'Public market intelligence - Analyzes earnings call transcripts',
					},
					{
						name: '04. Stock Data Agent',
						value: 'octagon-stock-data-agent',
						description:
							'Public market intelligence - Provides real-time and historical stock market data',
					},
					{
						name: '05. Holdings Agent',
						value: 'octagon-holdings-agent',
						description: 'Public market intelligence - Analyzes institutional holdings data',
					},
					{
						name: '06. Financials Agent',
						value: 'octagon-financials-agent',
						description: 'Public market intelligence - Analyzes financial statements',
					},
					{
						name: '07. Crypto Agent',
						value: 'octagon-crypto-agent',
						description: 'Public market intelligence - Analyzes cryptocurrency market data',
					},
					{
						name: '08. Companies Agent',
						value: 'octagon-companies-agent',
						description: 'Private market intelligence - Provides private company information',
					},
					{
						name: '09. Funding Agent',
						value: 'octagon-funding-agent',
						description: 'Private market intelligence - Analyzes private company funding data',
					},
					{
						name: '10. Funds Agent',
						value: 'octagon-funds-agent',
						description:
							'Private market intelligence - Analyzes investment funds and fund managers',
					},
					{
						name: '11. Deals Agent',
						value: 'octagon-deals-agent',
						description: 'Private market intelligence - Analyzes M&A and IPO data',
					},
					{
						name: '12. Investors Agent',
						value: 'octagon-investors-agent',
						description:
							'Private market intelligence - Analyzes venture capital and private equity investors',
					},
					{
						name: '13. Debts Agent',
						value: 'octagon-debts-agent',
						description:
							'Private market intelligence - Analyzes private debts, borrowers, and lenders',
					},
					{
						name: '14. Prediction Markets Agent',
						value: PREDICTION_MARKETS_AGENT,
						description: 'Deep research intelligence - Creates Kalshi prediction market reports',
					},
					{
						name: '15. Deep Research Agent',
						value: 'octagon-deep-research-agent',
						description: 'Deep research intelligence - Conducts in-depth research',
					},
				],
				default: 'octagon-agent',
				description: 'Select the Octagon agent for your research task',
			},
			{
				displayName:
					'Prediction markets requests must include a Kalshi market URL in the query. Use Cache Search to inspect cached reports without refreshing, or Refresh Report to force a new report.',
				name: 'predictionMarketsNotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						agent: [PREDICTION_MARKETS_AGENT],
					},
				},
			},
			{
				displayName: 'Prediction Markets Mode',
				name: 'predictionMarketsMode',
				type: 'options',
				displayOptions: {
					show: {
						agent: [PREDICTION_MARKETS_AGENT],
					},
				},
				options: [
					{
						name: 'Default Report',
						value: 'default',
						description: 'Use cache first and refresh only on cache miss',
					},
					{
						name: 'Cache Search',
						value: 'cache',
						description: 'Return cached report metadata without creating a new report',
					},
					{
						name: 'Refresh Report',
						value: 'refresh',
						description: 'Always create a new report before returning content',
					},
				],
				default: 'default',
				description: 'Choose how the prediction markets agent should resolve report data',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				placeholder:
					'Ask any financial or market research question. Prediction markets queries must include a Kalshi market URL...',
				description:
					'Your research query or question. Prediction markets requests must include a Kalshi market URL.',
				required: true,
			},
			{
				displayName: 'Additional Options',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Include Token Usage',
						name: 'includeUsage',
						type: 'boolean',
						default: false,
						description: 'Whether to include token usage information in the response',
					},
				],
			},
		],
	};

	/**
	 * Executes the Octagon AI agent request
	 *
	 * @param this - The n8n execution context
	 * @returns Promise<INodeExecutionData[][]> - Formatted response with analysis and citations
	 * @throws Error when API request fails or authentication is invalid
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				// Get parameters and validate required fields
				const agent = this.getNodeParameter('agent', i) as string;
				const query = this.getNodeParameter('query', i) as string;
				const predictionMarketsMode = this.getNodeParameter(
					'predictionMarketsMode',
					i,
					'default',
				) as PredictionMarketsMode;
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
					includeUsage?: boolean;
				};

				// Validate required parameters
				if (!query || query.trim().length === 0) {
					throw new NodeOperationError(this.getNode(), 'Query is required and cannot be empty', {
						itemIndex: i,
					});
				}

				if (agent === PREDICTION_MARKETS_AGENT && !KALSHI_URL_PATTERN.test(query)) {
					throw new NodeOperationError(
						this.getNode(),
						'Prediction markets requests must include a Kalshi market URL in the query',
						{
							itemIndex: i,
						},
					);
				}

				const model = resolveModel(agent, predictionMarketsMode);

				// Prepare request options using n8n's HTTP helpers
				const requestOptions: IHttpRequestOptions = {
					url: 'https://api-gateway.octagonagents.com/v1/responses',
					method: 'POST',
					body: {
						model,
						input: query,
					},
					json: true,
					headers: {
						'Content-Type': 'application/json',
						'User-Agent': `${packageInfo.name}/${packageInfo.version}`,
					},
				};

				// Make API request using n8n's HTTP helpers with authentication
				const response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'octagonApi',
					requestOptions,
				)) as OctagonResponse;

				let analysis = '';
				let citations: IDataObject[] = [];
				let usage: IDataObject | undefined;
				let cacheData: CachePayload | undefined;

				// Handle response structure safely
				if (response.output && response.output.length > 0) {
					const outputItem = response.output[0];
					if (outputItem.content && outputItem.content.length > 0) {
						const contentItem = outputItem.content[0];
						if (contentItem.text) {
							analysis = contentItem.text;
						}
						if (contentItem.annotations) {
							citations = contentItem.annotations;
						}
					}
				}

				if (response.usage) {
					usage = response.usage;
				}

				if (model.endsWith(':cache') && analysis.trim().length > 0) {
					cacheData = parseCachePayload(analysis);
					if (!cacheData) {
						throw new NodeOperationError(
							this.getNode(),
							'Prediction markets cache mode returned invalid JSON',
							{
								itemIndex: i,
							},
						);
					}
				}

				// Prepare output data
				const outputData: IDataObject = {
					agent,
					model,
					query,
					analysis,
					sources: citations,
					metadata: {
						apiType: 'responses',
						timestamp: new Date().toISOString(),
					},
				};

				if (cacheData) {
					outputData.cacheData = cacheData;
				}

				// Add usage information if requested
				if (additionalFields.includeUsage === true && usage) {
					outputData.usage = usage;
				}

				returnData.push({
					json: outputData,
				});
			} catch (error) {
				// Handle errors gracefully
				const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

				returnData.push({
					json: {
						error: true,
						message: errorMessage,
						query: this.getNodeParameter('query', i) as string,
						agent: this.getNodeParameter('agent', i) as string,
						model: resolveModel(
							this.getNodeParameter('agent', i) as string,
							this.getNodeParameter('predictionMarketsMode', i, 'default') as PredictionMarketsMode,
						),
						timestamp: new Date().toISOString(),
					},
				});
			}
		}

		return this.prepareOutputData(returnData);
	}
}
