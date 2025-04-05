import { buyToken } from '../helpers/buyToken.js';
import { jest } from '@jest/globals';

// Mock console.log to avoid cluttering test output
console.log = jest.fn();

describe('buyToken function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should correctly calculate amount when buying a token', async () => {
    // Arrange
    const exchange = 'binance';
    const token = 'ETH';
    const walletBalance = 1000;
    const tokenPrice = 3000;
    
    // Act
    const result = await buyToken(exchange, token, walletBalance, tokenPrice);
    const parsed = JSON.parse(result);
    
    // Assert
    expect(parsed.type).toBe('observation');
    expect(parsed.observation).toContain(`Bought`);
    expect(parsed.observation).toContain(`${token}`);
    expect(parsed.observation).toContain(`${exchange}`);
    
    // Calculate expected amount (10% of wallet / token price)
    const expectedAmount = (walletBalance * 0.1) / tokenPrice;
    expect(parsed.amount).toBeCloseTo(expectedAmount);
    expect(parsed.tokenPrice).toBe(tokenPrice);
  });

  test('should return error message for invalid inputs', async () => {
    // Arrange & Act
    const resultInvalidPrice = await buyToken('binance', 'ETH', 1000, 0);
    const resultInvalidBalance = await buyToken('binance', 'ETH', 0, 1000);
    const resultNaNPrice = await buyToken('binance', 'ETH', 1000, 'invalid');
    
    // Assert
    expect(resultInvalidPrice).toContain('Invalid input');
    expect(resultInvalidBalance).toContain('Invalid input');
    expect(resultNaNPrice).toContain('Invalid input');
  });
});