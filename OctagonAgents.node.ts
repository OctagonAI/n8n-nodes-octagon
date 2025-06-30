import { IExecuteFunctions, INodeType, INodeTypeDescription, INodeExecutionData, INodePropertyOptions, NodeOperationError, NodeConnectionType } from 'n8n-workflow';
import * as https from 'https';

/**
 * Makes HTTP request to Octagon API
 * 
 * @param apiKey - The API key for authentication
 * @param agent - The agent model to use
 * @param query - The user query
 * @returns Promise<any> - API response
 * @throws Error when API request fails
 */
async function makeApiRequest(apiKey: string, agent: string, query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: agent,
      input: query,
    });

    const options: https.RequestOptions = {
      hostname: 'api-gateway.octagonagents.com',
      port: 443,
      path: '/v1/responses',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'n8n-octagon-node/1.0.0',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`API request failed with status ${res.statusCode}: ${response.error || body}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`HTTP request error: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(30000); // 30 second timeout
    req.write(data);
    req.end();
  });
}

/**
 * Professional n8n node for Octagon AI Agents
 * Provides access to 15 specialized financial and market research AI agents
 * 
 * @author Octagon <ken@octagonai.co>
 * @version 1.0.0
 * @since 2024-01-15
 */
// nodelinter-ignore-next-line node-dirname-against-convention
export class OctagonAgents implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Octagon',
    name: 'octagonAgents',
    // nodelinter-ignore-next-line node-class-description-icon-not-svg
    icon: 'file:Octagon-logo-only.png',
    group: ['input'],
    version: 1,
    subtitle: '={{$parameter["agent"]}}',
    description: 'Interact with Octagon AI Agents for financial and market research',
    defaults: {
      name: 'Octagon',
    },
    // nodelinter-ignore-next-line node-class-description-inputs-wrong-regular-node
    inputs: ['main'] as any,
    // nodelinter-ignore-next-line node-class-description-outputs-wrong
    outputs: ['main'] as any,
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
          { name: 'Companies Agent', value: 'octagon-companies-agent', description: 'Provides private company information' },
          { name: 'Crypto Agent', value: 'octagon-crypto-agent', description: 'Analyzes cryptocurrency market data' },
          { name: 'Deals Agent', value: 'octagon-deals-agent', description: 'Analyzes M&A and IPO data' },
          { name: 'Debts Agent', value: 'octagon-debts-agent', description: 'Analyzes private debts, borrowers, and lenders' },
          { name: 'Deep Research Agent', value: 'octagon-deep-research-agent', description: 'Conducts in-depth research' },
          { name: 'Financials Agent', value: 'octagon-financials-agent', description: 'Analyzes financial statements' },
          { name: 'Funding Agent', value: 'octagon-funding-agent', description: 'Analyzes private company funding data' },
          { name: 'Funds Agent', value: 'octagon-funds-agent', description: 'Analyzes private funds' },
          { name: 'Holdings Agent', value: 'octagon-holdings-agent', description: 'Analyzes institutional ownership and holdings' },
          { name: 'Investors Agent', value: 'octagon-investors-agent', description: 'Provides investor information' },
          { name: 'Octagon Agent (Router)', value: 'octagon-agent', description: 'General router to all Octagon sub-agents' },
          { name: 'Scraper Agent', value: 'octagon-scraper-agent', description: 'Extracts data from websites' },
          { name: 'SEC Filings Agent', value: 'octagon-sec-agent', description: 'Analyzes SEC filings data' },
          { name: 'Stock Data Agent', value: 'octagon-stock-data-agent', description: 'Analyzes stock market data' },
          { name: 'Transcripts Agent', value: 'octagon-transcripts-agent', description: 'Analyzes earnings call transcripts' },
        ],
        default: 'octagon-agent',
        description: 'Select the Octagon agent for your research task',
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        placeholder: 'Ask any financial or market research question...',
        description: 'Your research query or question',
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
        // Get credentials - validates API key exists and is properly formatted
        const credentials = await this.getCredentials('octagonApi', i);
        
        // Get parameters and validate required fields
        const agent = this.getNodeParameter('agent', i) as string;
        const query = this.getNodeParameter('query', i) as string;
        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

        // Validate required parameters
        if (!query || query.trim().length === 0) {
          throw new NodeOperationError(this.getNode(), 'Query is required and cannot be empty', { itemIndex: i });
        }

        // Make API request to Octagon
        const response = await makeApiRequest(credentials.apiKey as string, agent, query);
        
        let analysis = '';
        let citations: any[] = [];
        let usage: any = {};
        
        // Handle response structure safely
        if (response.output && response.output.length > 0) {
          const outputItem = response.output[0] as any;
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

        // Prepare output data
        const outputData: any = {
          agent,
          query,
          analysis,
          sources: citations,
          metadata: {
            apiType: 'responses',
            timestamp: new Date().toISOString(),
          },
        };

        // Add usage information if requested
        if (additionalFields.includeUsage && usage) {
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
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    return this.prepareOutputData(returnData);
  }
}