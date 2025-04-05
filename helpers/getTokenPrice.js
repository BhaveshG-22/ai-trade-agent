import dotenv from 'dotenv';
import ccxt from 'ccxt';

dotenv.config();

const supportedExchanges = [
    'binance',
    'coinbasepro',
    'kraken',
    'kucoin',
    'bybit',
    'gateio',
];

export async function getTokenPrice(token) {
    console.log(`📞 [getTokenPrice] Fetching prices for ${token} across all exchanges...`);

    const symbol = `${token.toUpperCase()}/USDT`;

    const pricePromises = supportedExchanges.map(async (exchangeId) => {
        try {
            const exchange = new ccxt[exchangeId]();
            await exchange.loadMarkets();

            if (!exchange.markets[symbol]) {
                throw new Error(`Symbol ${symbol} not found`);
            }

            const ticker = await exchange.fetchTicker(symbol);
            return { exchange: exchangeId, price: ticker.last };
        } catch (err) {
            return { exchange: exchangeId, error: err.message };
        }
    });

    const results = await Promise.all(pricePromises);

    // Format the response
    const summary = results.map((r) => {
        if (r.error) return `❌ ${r.exchange}: ${r.error}`;
        return `✅ ${r.exchange}: $${r.price}`;
    });

    return summary.join('\n');
}
