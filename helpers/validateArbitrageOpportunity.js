import dotenv from 'dotenv';
dotenv.config();

export async function validateArbitrageOpportunity(buyPrice, sellPrice, minimum_profit_margin) {
    let calculated_profit_percentage = ((sellPrice - buyPrice) / buyPrice) * 100
    console.log(`calculated_profit_percentage : ${calculated_profit_percentage}`);


    let validated = false

    let returnObj = {}

    if (calculated_profit_percentage > minimum_profit_margin) {
        returnObj.type = "observation"
        returnObj.observation = 'The arbitrage opportunity meets the user-defined profit margin. Proceeding with the trade.'
        returnObj.proceed = true
        returnObj.calculated_profit_percentage = calculated_profit_percentage
    } else {
        returnObj.type = "observation"
        returnObj.observation = 'The arbitrage opportunity does not meet the user-defined profit margin. Required: ${minimum_profit_margin}%, Found: ${calculated_profit_percentage.toFixed(2)}%. Trade will not be executed.'
        returnObj.proceed = false
        returnObj.calculated_profit_percentage = calculated_profit_percentage
    }


    returnObj = JSON.stringify(returnObj)
    console.log(`returnObj : ${returnObj}`);

    return returnObj


}
