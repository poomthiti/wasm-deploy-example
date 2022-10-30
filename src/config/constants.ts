import { StdFee } from '@cosmjs/stargate';
import big from 'big.js';

export const MICRO = 1000000;

export const GAS_ADJUSTMENT = 1.2;

export const getFee = (estimatedGas: number): StdFee => {
  const adjustedGas = big(estimatedGas).mul(GAS_ADJUSTMENT).toFixed(0);
  return {
    amount: [
      {
        denom: 'uosmo',
        amount: '1000000',
      },
    ],
    gas: adjustedGas,
  };
};

export const INIT_MSG = {
  name: 'Golden Stars',
  symbol: 'STAR',
  decimals: 2,
  initial_balances: [],
  mint: {
    minter: 'osmo1wke7j8f5kgnnacs3avchcj6fvvdtvrsalzmddx',
  },
};

export const mintMsg = {
  mint: {
    recipient: 'osmo1wke7j8f5kgnnacs3avchcj6fvvdtvrsalzmddx',
    amount: '1',
  },
};
