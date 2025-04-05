import dotenv from 'dotenv';
dotenv.config();

export async function getTokenPrice(exchange, token) {
    console.log(`📞 [getTokenPrice] Called with exchange=${exchange}, token=${token}`);
    
    let rp = (Math.random() * 1000 + 1000).toFixed(2); // price between $1000 - $2000
    return `The price of ${token} in ${exchange} is $${rp}`;
}
