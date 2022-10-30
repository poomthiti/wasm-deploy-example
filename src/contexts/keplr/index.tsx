import { BroadcastMode, StdTx } from '@cosmjs/launchpad';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getKeplrFromWindow } from '@keplr-wallet/stores';
import { Keplr } from '@keplr-wallet/types';
import Axios from 'axios';
import big from 'big.js';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { ChainInfos } from '../../config/chain-info';
import { MICRO } from '../../config/constants';

export async function sendTxWC(
  chainId: string,
  tx: StdTx | Uint8Array,
  mode: BroadcastMode
): Promise<Uint8Array> {
  const restInstance = Axios.create({
    baseURL: ChainInfos.find((chainInfo) => chainInfo.chainId === chainId)!
      .rest,
  });

  const isProtoTx = Buffer.isBuffer(tx) || tx instanceof Uint8Array;

  const params = isProtoTx
    ? {
        tx_bytes: Buffer.from(tx as any).toString('base64'),
        mode: (() => {
          switch (mode) {
            case 'async':
              return 'BROADCAST_MODE_ASYNC';
            case 'block':
              return 'BROADCAST_MODE_BLOCK';
            case 'sync':
              return 'BROADCAST_MODE_SYNC';
            default:
              return 'BROADCAST_MODE_UNSPECIFIED';
          }
        })(),
      }
    : {
        tx,
        mode: mode,
      };

  const result = await restInstance.post(
    isProtoTx ? '/cosmos/tx/v1beta1/txs' : '/txs',
    params
  );

  const txResponse = isProtoTx ? result.data['tx_response'] : result.data;

  if (txResponse.code != null && txResponse.code !== 0) {
    throw new Error(txResponse['raw_log']);
  }

  return Buffer.from(txResponse.txhash, 'hex');
}

export const GetKeplrContext = createContext<{
  account: {
    address: string;
    balance: string;
    accountNumber: number | undefined;
    pubKey: string;
  } | null;
  getKeplr(): Promise<Keplr | undefined>;
  connectKeplr(): Promise<void>;
  disconnectKeplr(): void;
  getCosmWasmClient(): SigningCosmWasmClient | undefined;
}>({
  account: null,
  getKeplr: () => Promise.resolve(undefined),
  connectKeplr: () => Promise.resolve(undefined),
  disconnectKeplr: () => null,
  getCosmWasmClient: () => undefined,
});

export const GetKeplrProvider = ({ children }: { children: ReactNode }) => {
  const lastUsedKeplrRef = useRef<Keplr | undefined>();
  const cosmwasmClientRef = useRef<SigningCosmWasmClient | undefined>();
  const [account, setAccount] = useState<{
    name: string;
    address: string;
    balance: string;
    accountNumber: number | undefined;
    pubKey: string;
  } | null>(null);

  const [getKeplr] = useState(() => () => {
    if (typeof window === 'undefined') {
      return Promise.resolve(undefined);
    }
    if (lastUsedKeplrRef.current)
      return Promise.resolve(lastUsedKeplrRef.current);

    const keplr = getKeplrFromWindow();

    return Promise.resolve(keplr);
  });

  const [getCosmWasmClient] = useState(() => () => {
    if (!cosmwasmClientRef.current) return undefined;
    return cosmwasmClientRef.current;
  });

  const currentChain = ChainInfos[0];

  const connectKeplr = async () => {
    const keplr = await getKeplr();
    if (keplr === undefined) return alert('Keplr extension not installed');
    lastUsedKeplrRef.current = keplr;
    await keplr.enable(currentChain.chainId);
    const key = await keplr.getKey(currentChain.chainId);
    const offlineSigner = keplr.getOfflineSigner(currentChain.chainId);
    const client = await SigningCosmWasmClient.connectWithSigner(
      currentChain.rpc,
      offlineSigner
    );
    cosmwasmClientRef.current = client;
    const stakeCurrencyBalance = await client.getBalance(
      key.bech32Address,
      currentChain.stakeCurrency.coinMinimalDenom
    );
    const account = await client.getAccount(key.bech32Address);

    setAccount({
      name: key.name,
      accountNumber: account?.accountNumber,
      address: key.bech32Address,
      balance: big(stakeCurrencyBalance.amount).div(MICRO).toFixed(),
      pubKey: account?.pubkey?.value,
    });
  };

  const disconnectKeplr = () => {
    cosmwasmClientRef.current?.disconnect();
    lastUsedKeplrRef.current = undefined;
    cosmwasmClientRef.current = undefined;
    setAccount(null);
  };

  return (
    <GetKeplrContext.Provider
      value={{
        account,
        getKeplr,
        connectKeplr,
        disconnectKeplr,
        getCosmWasmClient,
      }}
    >
      {children}
    </GetKeplrContext.Provider>
  );
};

export const useKeplrContext = () => useContext(GetKeplrContext);
