import dotenv from 'dotenv';
dotenv.config();

export async function validateArbitrageOpportunity(buyPrice, sellPrice, minimum_profit_margin) {
    let calculated_profit_percentage = ((sellPrice - buyPrice) / buyPrice) * 100

    let validated = false


    if (calculated_profit_percentage > minimum_profit_margin) {
        return {
            "type": "observation",
            "observation": "The arbitrage opportunity meets the user-defined profit margin. Proceeding with the trade.",
            "proceed": true,
            "calculated_profit_percentage": calculated_profit_percentage
        }
    } else {
        return {
            "type": "observation",
            "observation": `The arbitrage opportunity does not meet the user-defined profit margin. Required: ${minimum_profit_margin}%, Found: ${calculated_profit_percentage.toFixed(2)}%. Trade will not be executed.`,
            "proceed": false,
            "calculated_profit_percentage": calculated_profit_percentage

        };
    }


}
