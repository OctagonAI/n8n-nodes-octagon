# Octagon for n8n

A professional n8n node that integrates with [Octagon's AI Agents API](https://docs.octagonagents.com/) for financial and market research. This node provides access to Octagon's specialized AI agents for analyzing SEC filings, earnings transcripts, stock data, private market intelligence, and more.

## Features

- **🔄 Smart Router Agent**: Octagon Agent automatically routes queries to the most appropriate specialized agent
- **15 Specialized Agents**: Access to all Octagon's AI agents for different research domains
- **🔒 Secure Authentication**: Built-in credential management for API keys
- **📊 Rich Output**: Returns analysis with source citations and metadata
- **⚡ Simplified Interface**: Clean, professional UI with essential options only
- **🛡️ Error Handling**: Graceful error handling with detailed error messages

## Available Agents

### 🔄 **Smart Router (Default)**

- **Octagon Agent** (`octagon-agent`) - Intelligent router that automatically selects the best specialized agent for your query

### 📈 **Public Market Agents**

- **SEC Filings Agent** (`octagon-sec-agent`) - Analyzes SEC filings data
- **Transcripts Agent** (`octagon-transcripts-agent`) - Analyzes earnings call transcripts
- **Stock Data Agent** (`octagon-stock-data-agent`) - Analyzes stock market data
- **Financials Agent** (`octagon-financials-agent`) - Analyzes financial statements
- **Holdings Agent** (`octagon-holdings-agent`) - Analyzes institutional ownership and holdings
- **Crypto Agent** (`octagon-crypto-agent`) - Analyzes cryptocurrency market data

### 🏢 **Private Market Agents**

- **Companies Agent** (`octagon-companies-agent`) - Provides private company information
- **Funding Agent** (`octagon-funding-agent`) - Analyzes private company funding data
- **Funds Agent** (`octagon-funds-agent`) - Analyzes private funds
- **Deals Agent** (`octagon-deals-agent`) - Analyzes M&A and IPO data
- **Investors Agent** (`octagon-investors-agent`) - Provides investor information
- **Debts Agent** (`octagon-debts-agent`) - Analyzes private debts, borrowers, and lenders

### 🔍 **Research Agents**

- **Scraper Agent** (`octagon-scraper-agent`) - Extracts data from websites
- **Deep Research Agent** (`octagon-deep-research-agent`) - Conducts in-depth research

## Installation

### Prerequisites

1. **Octagon API Key**: Get your free API key from [Octagon](https://octagonagents.com)
   - Sign up for an account
   - Go to Settings → API Keys
   - Create a new API key

2. **n8n Installation**: This node requires n8n v0.198.0 or higher

### Install the Node

#### Method 1: Install from npm (when published)

```bash
npm install n8n-nodes-octagon
```

#### Method 2: Install from local package

```bash
# Install the packaged node
npm install -g ./n8n-nodes-octagon-1.0.3.tgz

# Or install from the project directory
npm install -g /path/to/n8n-octagon-node
```

#### Method 3: Docker Installation

```dockerfile
FROM n8nio/n8n:latest

# Copy and install the custom node
COPY n8n-nodes-octagon-1.0.3.tgz /tmp/
USER root
RUN cd /usr/local/lib/node_modules/n8n && \
    npm install /tmp/n8n-nodes-octagon-1.0.3.tgz
USER node
```

## Usage

### Quick Start

1. **Add Node**: Search for "Octagon" in n8n workflow
2. **Configure**:
   - **Add Credentials**: Go to Credentials → "Octagon API"
   - **Agent**: Use "Octagon Agent (Router)" for automatic routing (default)
   - **Query**: Enter your financial research question
3. **Execute**: Run the workflow to get AI-powered analysis with citations

### Node Configuration

The node interface is clean and simple:

- **🎯 Agent**: Select from router or 14 specialized agents
- **💬 Query**: Your research question (supports complex queries)
- **⚙️ Additional Options**:
  - Include Token Usage (optional)

### Example Queries

#### Universal Queries (using Octagon Agent Router)

```
Tell me about Apple's latest earnings performance
What's happening with Tesla's stock price?
Analyze SpaceX's latest funding round
Compare Microsoft vs Google revenue growth
```

#### Specialized Agent Queries

```
# SEC Filings Agent
What were Apple's revenue numbers in Q3 2023?
Analyze Tesla's latest 10-K filing for risk factors

# Transcripts Agent
What did Apple's CEO say about iPhone sales in the latest earnings call?
Analyze management guidance from Tesla's Q4 2023 earnings call

# Stock Data Agent
What's the 52-week high and low for AAPL?
Compare Tesla's stock performance to the S&P 500 this year

# Companies Agent (Private Market)
Tell me about Stripe's latest funding round
What is the current valuation of SpaceX?
```

### Output Format

The node returns a JSON object with the following structure:

```json
{
	"agent": "octagon-agent",
	"query": "Tell me about Apple's latest earnings",
	"analysis": "Apple reported strong Q4 2023 results with revenue of $89.5 billion...",
	"sources": [
		{
			"order": 1,
			"name": "Apple Inc. (10-Q) - 2023-Q4, Page: 10",
			"url": "https://octagon-sec-filings.s3.amazonaws.com/..."
		}
	],
	"metadata": {
		"apiType": "responses",
		"timestamp": "2024-01-15T10:30:00.000Z"
	},
	"usage": {
		"prompt_tokens": 150,
		"completion_tokens": 800,
		"total_tokens": 950
	}
}
```

## Best Practices

1. **🎯 Use the Router**: Start with "Octagon Agent (Router)" - it automatically selects the best specialized agent
2. **📝 Be Specific**: The more specific your query, the more accurate the response
3. **🔄 One Task Per Query**: Focus each query on a single analytical task for best results
4. **📅 Provide Context**: Include relevant context like time periods, specific metrics, or companies
5. **🔗 Follow Citations**: Always check the source citations for verification

## Error Handling

The node includes comprehensive error handling:

- **🔑 Authentication Errors**: Invalid API keys, expired tokens
- **🌐 Network Errors**: Connection issues, timeouts, rate limits
- **📝 Query Errors**: Malformed or empty queries
- **🤖 Agent Errors**: Agent-specific errors or limitations

Errors are returned in a structured format:

```json
{
	"error": true,
	"message": "Authentication failed. Please check your API key.",
	"query": "Your original query",
	"agent": "octagon-agent",
	"timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Development

### Building from Source

```bash
git clone https://github.com/octagon/octagon-n8n-node.git
cd octagon-n8n-node
npm install
npm run build
```

### Development Mode

```bash
npm run dev  # Watch mode for development
```

### Package for Distribution

```bash
npm run package  # Creates .tgz file
```

## Local Development & Testing

### Prerequisites for Local Development

1. **Install n8n globally**:

```bash
npm install -g n8n
```

2. **Clone and build the node**:

```bash
git clone https://github.com/octagon/octagon-n8n-node.git
cd octagon-n8n-node
npm install
npm run build
```

### Method 1: Custom Extensions (Recommended for Development)

This method loads the node directly from your development directory:

```bash
# Start n8n with custom extensions path
N8N_CUSTOM_EXTENSIONS=/path/to/octagon-n8n-node n8n start

# Example (adjust path to your actual directory):
N8N_CUSTOM_EXTENSIONS=/Users/yourname/Desktop/octagon-n8n-node n8n start
```

**Advantages:**

- ✅ No need to reinstall after changes
- ✅ Perfect for development and testing
- ✅ Changes reflect immediately after rebuild

### Method 2: Global Package Installation

Install the built package globally:

```bash
# Build and package
npm run package

# Install globally
npm install -g ./n8n-nodes-octagon-1.0.3.tgz

# Start n8n normally
n8n start
```

**Note**: Requires reinstallation after each change.

### Testing Your Installation

1. **Start n8n** using one of the methods above
2. **Open your browser** to http://localhost:5678
3. **Create a new workflow**
4. **Search for "Octagon"** in the node list
5. **Add the node** and configure:
   - Set up Octagon API credentials
   - Select "Octagon Agent (Router)"
   - Enter a test query: "Tell me about Apple's latest earnings"
   - Execute the workflow

### Development Workflow

1. **Make code changes** in your editor
2. **Rebuild**: `npm run build`
3. **Restart n8n** (if using Custom Extensions method)
4. **Test changes** in n8n interface
5. **Repeat** as needed

### Troubleshooting Local Development

**Node not appearing:**

- Restart n8n completely
- Check the custom extensions path is correct
- Verify the build completed successfully

**Icon not loading:**

- Clear browser cache (`Cmd/Ctrl + Shift + R`)
- Check that `Octagon-logo-only.png` is in the `dist/` folder

**TypeScript errors:**

```bash
npm run build  # Check for compilation errors
```

**Permission issues:**

```bash
# Fix n8n settings permissions
chmod 600 ~/.n8n/config
```

## Troubleshooting

### Common Issues

1. **Node not appearing**: Restart n8n after installation
2. **Icon not loading**: Clear browser cache
3. **Authentication errors**: Verify API key in credentials
4. **Rate limiting**: Check your Octagon plan limits

### Support Channels

- **📚 Documentation**: [Octagon API Documentation](https://docs.octagonagents.com/)
- **🐛 Issues**: [GitHub Issues](https://github.com/octagon/octagon-n8n-node/issues)
- **💬 Support**: Contact Octagon support for API-related questions
- **📧 Email**: support@octagonagents.com

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

---

**⚠️ Note**: This node requires an active Octagon API subscription. Some agents may have usage limits or require premium access. Get started with a free API key at [octagonagents.com](https://octagonagents.com).

**🏆 Professional Grade**: This node is built to enterprise standards with comprehensive error handling, security best practices, and optimal performance.
