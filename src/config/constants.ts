import { StdFee } from '@cosmjs/stargate';

export const MICRO = 1000000;

export const FEE: StdFee = {
  amount: [
    {
      denom: 'uosmo',
      amount: '1000000',
    },
  ],
  gas: '4000000',
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
