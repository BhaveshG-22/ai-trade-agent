import OpenAI from 'openai';
import readline from 'readline-sync';
import dotenv from 'dotenv';
import { sellToken } from './helpers/sellToken.js';
import { buyToken } from './helpers/buyToken.js';
import { getTokenPrice } from './helpers/getTokenPrice.js';
dotenv.config()

// Initialize OpenAI client with API key
const client = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`
});

// Define tools (functions) the AI agent can use
const tools = {
  getTokenPrice: getTokenPrice,
  sellToken: sellToken,
  buyToken: buyToken
};

let wallet_balance = 20

const systemPrompt = `You're an AI crypto arbitrage assistant with start plan, action, observation, and output states.Your goal is to find and act on price differences between tokens across exchanges.

You only need to decide which token to buy/sell and on which exchange. The system will handle the correct amount based on 10% of wallet balance.

First, analyze the user's prompt and think step by step about what tools you need to use. Plan your approach carefully.

After planning, take the action with appropriate tools. Format your response as JSON with type, function, and input fields. 
For example, if you need to get Toke nPrice data, use: { "type": "action", "function": "getTokenPrice", "input": { "exchange": "Exchange Name", "token": "Token Name" } }.

Wait for observation results after your action. Based on the results, you may need to plan additional steps.

Finally, provide the AI response based on the start prompt and observation. Format your final output as {"type": "output", "output": "your final answer here",profit:"boolean", tradeStart="initialWalletBalance",tradeEnd="updatedNewWalletBalance"}.

Available tools:
- getTokenPrice: A function that accepts a city name as string and returns the weather details as a string.
- buyToken: A function that accepts a city name as string and returns the weather details as a string.
- sellToken: A function that accepts a city name as string and returns the weather details as a string.


Example flow:

User: “Is there any ETH arbitrage right now?”

Plan: { "type": "plan", "plan": "I will get ETH prices from Binance and Coinbase." }


Action: "{ type: action, function: getTokenPrice, input: { exchange: binance, token: ETH } }"

Observation: 3220.50

Action: "{ type: action, function: getTokenPrice, input: { exchange: coinbase, token: ETH } }"

Observation: 3300.00

Plan: { "type": "plan", "plan": "The price difference is $79.50. That's more than 0.5%. I will now buy ETH on Binance and sell it on Coinbase." }

Action: "{ type: action, function: buyToken, input: { "exchange": "binance", "token": "ETH","walletBalance":${wallet_balance},"tokenPrice":"tokenPrice"} }"

Observation: Bought X ETH on Binance

Action: "{ type: action, function: sellToken, input: { "exchange": "coinbase", "token": "ETH","amount":"X" } }"

Observation: Sold ETH on Coinbase

Output: "{ type: "output", output: "Arbitrage completed. Bought  ETH on Binance at $3220.50, sold on Coinbase at $3300.00. Estimated profit: 2.47%",profit:"true",tradeStart=${wallet_balance},newWalletBalance="20.494"}"
 
Strictly use the JSON format shown above for all actions and outputs.


Available exchanges:
- binance
- coinbase
- kucoin
- kraken
- bybit
- gateio

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


        break;
      } else if (parsed.type == 'action') {

        const fn = tools[parsed.function]
        let observation = null;

        switch (parsed.function) {
          case 'getTokenPrice':
            observation = await fn(parsed.input.exchange, parsed.input.token);
            break;

          case 'buyToken':
            observation = await fn(parsed.input.exchange, parsed.input.token, parsed.input.walletBalance, parsed.input.tokenPrice);
            // export async function buyToken(exchange, token, walletBalance, tokenPrice) {

            break;

          case 'sellToken':
            observation = await fn(parsed.input.exchange, parsed.input.token, parsed.input.amount);
            break;

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
        // console.log(`🧠 Plan: ${parsed.plan}`);
        console.log(`🧠`);
        continue;
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