import { AppCurrency, ChainInfo } from "@keplr-wallet/types";

export type PeggedCurrency = AppCurrency & {
  originCurrency?: AppCurrency & {
    /** For assets that are pegged/stablecoins. */
    pegMechanism?: "algorithmic" | "collateralized" | "hybrid";
  };
};

export interface ChainInfoWithExplorer extends ChainInfo {
  /** Formed as "https://explorer.com/{txHash}" */
  explorerUrlToTx: string;
  /** Add optional stable coin peg info to currencies. */
  currencies: Array<
    AppCurrency & {
      pegMechanism?: "collateralized" | "algorithmic" | "hybrid";
    }
  >;
  readonly gasPriceStep?: {
    low: number;
    average: number;
    high: number;
  };
}
