import dotenv from 'dotenv';
dotenv.config()
import OpenAI from 'openai';
import readline from 'readline-sync';
import { sellToken } from './helpers/sellToken.js';
import { buyToken } from './helpers/buyToken.js';
import { getTokenPrice } from './helpers/getTokenPrice.js';
import { validateArbitrageOpportunity } from './helpers/validateArbitrageOpportunity.js';


// Initialize OpenAI client with API key
const client = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`
});

// Define tools (functions) the AI agent can use
const tools = {
  getTokenPrice: getTokenPrice,
  sellToken: sellToken,
  buyToken: buyToken,
  validateArbitrageOpportunity, validateArbitrageOpportunity
};

let wallet_balance = process.env.WALLET_BALANCE
let minimum_profit_margin = process.env.MIN_PROFIT_MARGIN


console.log("Wallet Balance:", wallet_balance);
console.log("Minimum Profit Margin:", minimum_profit_margin);



const systemPrompt = `You're an AI crypto arbitrage assistant with start plan, action, observation, and output states.Your goal is to find and act on price differences between tokens across exchanges.

You only need to decide which token to buy/sell and on which exchange. The system will handle the correct amount based on wallet balance.

First, analyze the user's prompt and think step by step about what tools you need to use. Plan your approach carefully.

After planning, take the action with appropriate tools. Format your response as JSON with type, function, and input fields. 
For example, if you need to get Token Price data, use: { "type": "action", "function": "getTokenPrice", "input": { "exchange": "Exchange Name", "token": "Token Name" } }.

Wait for observation results after your action. Based on the results, you may need to plan immediate next required step.

Finally, provide the AI response based on the start prompt and observation. Format your final output as {"type": "output", "output": "your final answer here"}.

Available tools:
--getTokenPrice: Accepts a token name as a string (e.g., "ETH") and returns a formatted string showing real-time prices of that token across multiple exchanges (Binance, Coinbase Pro, Kraken, KuCoin, Bybit, Gate.io). Includes errors for unsupported pairs.
--buyToken: Accepts exchange, token, walletBalance, and tokenPrice, uses 10% of the wallet balance to buy the token, and returns an observation message along with the amount of tokens bought and the token price used.
--sellToken: Accepts exchange, token, amount (same as the amount bought in the buyToken function), tokenPrice and investedAmount (in buyToken Operation). Executes a sell operation, logs the transaction details, and returns an object containing the observation message and the total amount received and calculated profit from how much was invested by buying and how much received at the end of transaction.
--validateArbitrageOpportunity: Accepts buyPrice, sellPrice, and user-defined minimum_profit_margin, then calculates the profit margin and returns an object indicating whether the trade meets the required margin, including a message, the calculated percentage, and a proceed flag (true/false).

Example flow:
User: “Is there any BTC arbitrage right now?”

Plan: { "type": "plan", "plan": "I will get BTC prices from all available exchanges" }

Action: { "type": "action", "function": "getTokenPrice", "input": { "token": "BTC" } }

Observation:{ "type": "observation", "observation": "📥 Observation: ✅ binance: $83194.77 ❌ coinbasepro: ccxt[exchangeId] is not a constructor ✅ kraken: $83177.5 ✅ kucoin: $83193.8 ✅ bybit: $83198.4 ✅ gateio: $83187.2" } 

Plan :{ "type": "plan", "plan": "I will analyze the BTC prices across exchanges. If there's a price difference that meets the minimum profit margin requirement, I will validate the arbitrage opportunity."}

Observation: { "type": "observation", "observation": "Price arbitrage detected. Need to verify if the profit meets the user-defined minimum margin before executing the trade." }

Action: { "type": "action", "function": "validateArbitrageOpportunity", "input": {  buyPrice: 1787.09, sellPrice: 1788.69, 'minimum_profit_margin': ${minimum_profit_margin} } } 

Observation: { "type": "observation", "observation": "The arbitrage opportunity meets the user-defined profit margin. Proceeding with the trade.","proceed": true,"calculated_profit_percentage": "calculated_profit_percentage" }

Plan: { "type": "plan", "plan": "The BTC is cheaper on Binance and more priced in Coinbase, I will now buy BTC on Kraken and sell it on Bybit." }

Action: "{ "type": "action", "function": "buyToken", "input": { "exchange": "binance", "token": "BTC","walletBalance":"current_Wallet_Balance","tokenPrice":"current Token Price in binance"} }"

Observation: "{ "type": "observation", "observation": "Bought X BTC on Kraken", "amount":"X" }"

Action: "{ "type": "action", function: sellToken, input: { "exchange": "coinbase", "token": "BTC","amount":"X" ,initialWalletBalance } } }"

Observation: "{ "type": "observation", "observation": "Sold X BTC on Bybit , received $" }"

Output: "{ "type": "output", "output": "Arbitrage completed. Bought  BTC on Binance at $3220.50, sold on Coinbase at $3300.00.}"

Output: "{ "type": "EXECUTED", "EXECUTED": "Arbitrage completed "
 
Strictly use the JSON format shown above for all actions and outputs.


Available exchanges:
- binance
- coinbase
- kucoin
- kraken
- bybit
- gateio

IMPORTANT : If there are no viable arbitrage opportunities across the exchanges as if price difference does not meet the required profit margin then EXIT LOOP by following output .
Output: "{ "type": 'EXECUTED', "EXECUTED": 'No profitable arbitrage opportunity' }"

`

// Main function to handle the chat
async function chat() {
  let messages = [
    {
      role: 'system',
      content: systemPrompt
    }
  ];



  while (true) {
    const query = readline.question(':')

    if (query.length > 2) {
      messages.push({
        role: 'user',
        content: query
      })
    } else {
      messages.push({
        role: 'user',
        content: 'Is there any ETH arbitrage right now?'
      })
    }

    while (true) {
      // Call the OpenAI API
      const chat = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
        response_format: { type: 'json_object' }
      });

      // Get the result
      const result = chat.choices[0].message.content;

      messages.push({
        role: 'assistant',
        content: result
      })

      const parsed = JSON.parse(result)
      console.log(parsed);



      if (parsed.type == 'output') {
        console.log(`🤖: ${parsed.output}`);
        continue;
      } else if (parsed.type == 'action') {

        const fn = tools[parsed.function]
        let observation = null;

        switch (parsed.function) {
          case 'getTokenPrice':
            observation = await fn(parsed.input.token);
            break;

          case 'buyToken':
            observation = await fn(parsed.input.exchange, parsed.input.token, wallet_balance, parsed.input.tokenPrice);
            //  export async function buyToken(exchange, token, walletBalance, tokenPrice) {

            break;

          case 'sellToken':
            observation = await fn(parsed.input.exchange, parsed.input.token, parsed.input.amount, parsed.input.tokenPrice, parsed.input.investedAmount, wallet_balance);
            console.log(`##@##${observation}`);
            let parsedObservation = JSON.parse(observation)
            wallet_balance = parsedObservation.newWalletBalance
            break;

          case 'validateArbitrageOpportunity':


            observation = await fn(parsed.input.buyPrice, parsed.input.sellPrice, parsed.input.minimum_profit_margin);
            continue;

          default:
            console.log(`ERROR: failed to parse response \n received ${JSON.stringify(parsed, null, 2)}`);
            break;
        }

        // Only push observation if the action was valid
        if (observation !== null) {
          console.log(`📥 Observation: ${observation}`);
          messages.push({
            role: 'user',
            content: `Observation: ${observation}`
          });
        }

      } else if (parsed.type == 'plan') {
        console.log(`🧠`);
        continue;
      } else if (parsed.type == 'EXECUTED') {
        console.log(`✅✅ DONE : ${parsed.EXECUTED}`);
        break;
      }

    }


    messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ]

  }



}


chat()
