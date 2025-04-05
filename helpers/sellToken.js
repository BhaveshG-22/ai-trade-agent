import dotenv from 'dotenv';
dotenv.config();

export async function sellToken(exchange, token, amount, tokenPrice, investedAmount, initialWalletBalance) {
    console.log(`📞 [sellToken] Called with exchange=${exchange}, token=${token}, amount=${amount}`);

    console.log(`🔴 Selling ${amount} ${token} on ${exchange}`);

    const totalReceived = amount * tokenPrice;
    console.log(`totalReceived : ${totalReceived}`);


    console.log(`from sellToken : Sold ${amount.toFixed(6)} ${token} on ${exchange} received: $${totalReceived.toFixed(2)}`);


    return JSON.stringify({
        type: "observation",
        observation: `Sold ${amount.toFixed(6)} ${token} on ${exchange} received: $${totalReceived}  , profit:${totalReceived - investedAmount} `,
        newWalletBalance: initialWalletBalance + totalReceived - investedAmount
    });

}