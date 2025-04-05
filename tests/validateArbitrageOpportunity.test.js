import { validateArbitrageOpportunity } from '../helpers/validateArbitrageOpportunity.js';

describe('validateArbitrageOpportunity function', () => {
  test('should return proceed=true when profit margin is sufficient', async () => {
    // Arrange
    const buyPrice = 3000;
    const sellPrice = 3200; // ~6.67% profit
    const minimumProfitMargin = 5; // 5%
    
    // Act
    const result = await validateArbitrageOpportunity(buyPrice, sellPrice, minimumProfitMargin);
    
    // Assert
    expect(result.type).toBe('observation');
    expect(result.proceed).toBe(true);
    expect(result.observation).toContain('meets the user-defined profit margin');
    
    // Check calculated profit percentage
    const expectedProfitPercentage = ((sellPrice - buyPrice) / buyPrice) * 100;
    expect(result.calculated_profit_percentage).toBeCloseTo(expectedProfitPercentage);
  });

  test('should return proceed=false when profit margin is insufficient', async () => {
    // Arrange
    const buyPrice = 3000;
    const sellPrice = 3050; // ~1.67% profit
    const minimumProfitMargin = 2; // 2%
    
    // Act
    const result = await validateArbitrageOpportunity(buyPrice, sellPrice, minimumProfitMargin);
    
    // Assert
    expect(result.type).toBe('observation');
    expect(result.proceed).toBe(false);
    expect(result.observation).toContain('does not meet the user-defined profit margin');
    
    // Check calculated profit percentage
    const expectedProfitPercentage = ((sellPrice - buyPrice) / buyPrice) * 100;
    expect(result.calculated_profit_percentage).toBeCloseTo(expectedProfitPercentage);
  });
});