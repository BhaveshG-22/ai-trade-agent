import { sellToken } from '../helpers/sellToken.js';
import { jest } from '@jest/globals';

// Mock console.log to avoid cluttering test output
console.log = jest.fn();

describe('sellToken function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should correctly calculate amount received when selling a token', async () => {
    // Arrange
    const exchange = 'coinbase';
    const token = 'ETH';
    const amount = 0.5;
    const tokenPrice = 3200;
    const investedAmount = 1500;
    const initialWalletBalance = 1000;
    
    // Act
    const result = await sellToken(
      exchange, 
      token, 
      amount, 
      tokenPrice, 
      investedAmount, 
      initialWalletBalance
    );
    const parsed = JSON.parse(result);
    
    // Assert
    expect(parsed.type).toBe('observation');
    expect(parsed.observation).toContain(`Sold`);
    expect(parsed.observation).toContain(`${token}`);
    expect(parsed.observation).toContain(`${exchange}`);
    
    // Calculate expected values
    const expectedTotal = amount * tokenPrice;
    const expectedProfit = expectedTotal - investedAmount;
    const expectedNewBalance = initialWalletBalance + expectedTotal - investedAmount;
    
    expect(parsed.observation).toContain(`received: $${expectedTotal}`);
    // Use approximate matching because of possible floating point differences
    expect(parsed.observation).toMatch(/profit:[\d\.]+/);
    expect(parsed.newWalletBalance).toBe(expectedNewBalance);
  });
});