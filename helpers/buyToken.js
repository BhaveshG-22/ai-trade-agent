import dotenv from 'dotenv';
dotenv.config();

export async function buyToken(exchange, token, walletBalance, tokenPrice) {
    console.log('exchange, token, walletBalance, tokenPrice');
    console.log(exchange, token, walletBalance, tokenPrice);

    const price = parseFloat(tokenPrice)
    const maxSpend = parseFloat(walletBalance * 0.1);
    const amount = parseFloat(maxSpend / price);

    console.log(`🟢 Buying ${amount} ${token} on ${exchange} for $${maxSpend.toFixed(2)}`);

    return `Bought ${amount.toFixed(6)} ${token} on ${exchange} for $${maxSpend.toFixed(2)}`;
}
