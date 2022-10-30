import {
  ExecuteResult,
  InstantiateResult,
  UploadResult,
} from '@cosmjs/cosmwasm-stargate';
import { StdFee, Coin } from '@cosmjs/stargate';
import { createContext, ReactNode, useContext } from 'react';
import { useKeplrContext } from '../keplr';

export const TxContext = createContext<{
  instantiateContract(
    senderAddress: string,
    codeId: number,
    msg: object,
    label: string,
    fee: StdFee
  ): Promise<InstantiateResult | undefined>;
  uploadContract(
    senderAddress: string,
    wasmCode: Uint8Array,
    fee: number | StdFee | 'auto',
    memo?: string | undefined
  ): Promise<UploadResult | undefined>;
  simulateFee(
    signerAddress: string,
    messages: { typeUrl: string; value: any }[],
    memo?: string | undefined
  ): Promise<number | undefined>;
  executeContract(
    senderAddress: string,
    contractAddress: string,
    msg: object,
    fee: number | 'auto' | StdFee,
    memo?: string | undefined,
    funds?: Coin[] | undefined
  ): Promise<ExecuteResult | undefined>;
}>({
  instantiateContract: () => Promise.resolve(undefined),
  uploadContract: () => Promise.resolve(undefined),
  simulateFee: () => Promise.resolve(undefined),
  executeContract: () => Promise.resolve(undefined),
});

export const TxProvider = ({ children }: { children: ReactNode }) => {
  const { getCosmWasmClient } = useKeplrContext();
  const cosmwasmClient = getCosmWasmClient();
  const uploadContract = async (
    senderAddress: string,
    wasmCode: Uint8Array,
    fee: number | StdFee | 'auto',
    memo: string | undefined = undefined
  ) => {
    if (!cosmwasmClient) return Promise.resolve(undefined);
    return await cosmwasmClient.upload(senderAddress, wasmCode, fee, memo);
  };

  const instantiateContract = async (
    senderAddress: string,
    codeId: number,
    msg: object,
    label: string,
    fee: StdFee
  ) => {
    if (!cosmwasmClient) return Promise.resolve(undefined);
    return await cosmwasmClient.instantiate(
      senderAddress,
      codeId,
      msg,
      label,
      fee
    );
  };

  const simulateFee = async (
    signerAddress: string,
    messages: { typeUrl: string; value: any }[],
    memo: string | undefined = undefined
  ) => {
    if (!cosmwasmClient) return Promise.resolve(undefined);
    return await cosmwasmClient.simulate(signerAddress, messages, memo);
  };

  const executeContract = async (
    senderAddress: string,
    contractAddress: string,
    msg: object,
    fee: number | 'auto' | StdFee,
    memo: string | undefined = undefined,
    funds: Coin[] | undefined = undefined
  ) => {
    if (!cosmwasmClient) return Promise.resolve(undefined);
    return await cosmwasmClient.execute(
      senderAddress,
      contractAddress,
      msg,
      fee,
      memo,
      funds
    );
  };

  return (
    <TxContext.Provider
      value={{
        uploadContract,
        instantiateContract,
        simulateFee,
        executeContract,
      }}
    >
      {children}
    </TxContext.Provider>
  );
};

export const useTxContext = () => useContext(TxContext);
