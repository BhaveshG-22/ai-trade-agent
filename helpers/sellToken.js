import dotenv from 'dotenv';
dotenv.config();

export async function sellToken(exchange, token, amount) {
    console.log(`📞 [sellToken] Called with exchange=${exchange}, token=${token}, amount=${amount}`);

    console.log(`🔴 Selling ${amount} ${token} on ${exchange}`);
    return `Sold ${amount} ${token} on ${exchange}`;
}
