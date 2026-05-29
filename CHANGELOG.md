# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] - 2026-05-29

### Changed

- Removed the six private-market agents from the node UI.
- Renumbered the remaining visible agent options after removing the private-market entries.
- Updated package metadata and documentation to match the narrower public-market and research scope.

## [1.1.2] - 2026-05-27

### Changed

- Updated `OctagonAgents` error handling to throw standard n8n errors by default.
- Wrapped HTTP and API failures with `NodeApiError` and preserved structured error rows only for Continue On Fail mode.
- Added GitHub Actions CI and provenance-based publish workflow support for verified n8n releases.
- Updated release documentation to require GitHub Actions publishing instead of local npm publish.

## [1.1.1] - 2026-05-21

### Changed

- Replaced the stale Scraper Agent entry with Prediction Markets Agent.
- Added prediction markets modes for default report lookup, cache search, and forced refresh.
- Added Kalshi URL guidance and validation for prediction markets requests.
- Added structured `cacheData` output when cache mode returns JSON metadata.
- Updated package metadata and documentation to reflect prediction markets support.

## [1.0.0] - 2024-01-15

### Added

- 🎯 **Octagon Agent Router** - Intelligent routing to appropriate specialized agents
- 🔒 **Secure Authentication** - Professional credential management
- 📊 **15 Specialized Agents** for comprehensive financial research:
  - SEC Filings Agent
  - Transcripts Agent
  - Stock Data Agent
  - Financials Agent
  - Holdings Agent
  - Crypto Agent
  - Companies Agent
  - Funding Agent
  - Funds Agent
  - Deals Agent
  - Investors Agent
  - Debts Agent
  - Scraper Agent
  - Deep Research Agent
- ⚡ **Simplified Interface** - Clean, professional UI
- 🛡️ **Comprehensive Error Handling** - Graceful error management
- 📈 **Rich Output Format** - Analysis with source citations and metadata
- 🔍 **Token Usage Tracking** - Optional usage information
- 🎨 **Professional Branding** - Custom Octagon logo and styling

### Features

- Responses API integration for optimal performance
- Automatic agent selection via router
- Source citation and verification
- Professional documentation
- Enterprise-grade error handling
- TypeScript support
- Modern n8n compatibility

### Technical

- Built with TypeScript 5.0+
- Compatible with n8n v0.198.0+
- Node.js 16+ requirement
- Professional package structure
- Comprehensive JSDoc documentation
