# AI Crypto Arbitrage Trading Agent

This project implements an AI-powered crypto trading agent that automates the discovery and execution of arbitrage opportunities across multiple cryptocurrency exchanges. The agent uses OpenAI's GPT-4o (soon introduing option to use other LLM's as well) model to analyze price differences and make trading decisions.

## Features

- **AI-Driven Decision Making**: Leverages GPT-4o to analyze market conditions and identify arbitrage opportunities
- **Multi-Exchange Support**: Works with multiple popular exchanges (Binance, Coinbase, Kraken, KuCoin, Bybit, Gate.io)
- **Automated Trading**: Executes buy and sell orders based on detected price differentials
- **Risk Management**: Built-in wallet balance tracking and trade size limits (10% of wallet per trade)
- **Interactive CLI**: Simple command-line interface for interacting with the trading agent

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/ai-trade-agent.git
   cd ai-trade-agent
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

Start the trading agent with:

```
npm run start
```

Or use development mode with automatic restart on file changes:

```
npm run dev
```

Once started, you can interact with the agent through the command line. Example queries:

- `Is there any ETH arbitrage right now?`
- `Look for arbitrage opportunities between BTC on Binance and Coinbase`
- `Check if there's a price difference for SOL across exchanges`

The agent will:
1. Analyze your query
2. Fetch token prices from relevant exchanges
3. Identify potential arbitrage opportunities (price difference > 0.5%)
4. Execute trades if profitable opportunities exist
5. Report results including profit/loss and updated wallet balance

## Project Structure

- `index.js`: Main application entry point with the chat loop and system prompt
- `helpers/`: Contains utility functions for interacting with exchanges
  - `getTokenPrice.js`: Simulates fetching token prices from exchanges
  - `buyToken.js`: Simulates buying tokens on a specific exchange
  - `sellToken.js`: Simulates selling tokens on a specific exchange

## Configuration

The default wallet balance is set to $20. You can modify this in `index.js` by changing the `wallet_balance` variable.

The system uses a maximum of 10% of the wallet balance for any single trade to manage risk.


## TODO:

- **Real API Integration**: Replace simulated price functions with real API calls to exchanges
 - **Improved Error Handling**: Implement robust error handling for API failures
- **Web Interface**: Create a web dashboard to monitor trades and performance
- **Trade History**: Store and display history of all executed trades
- **Performance Metrics**: Add ROI calculations and other performance statistics
 - **Multiple Trading Strategies**: Implement additional strategies beyond simple arbitrage
 
## License

ISC

## Disclaimer

This project is provided for educational and research purposes only. Trading cryptocurrencies involves significant risk. This software does not constitute financial advice, and the developers are not responsible for any financial losses incurred through its use.