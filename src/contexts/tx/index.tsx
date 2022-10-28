import { InstantiateResult, UploadResult } from '@cosmjs/cosmwasm-stargate';
import { StdFee } from '@cosmjs/stargate';
import { createContext, ReactNode, useContext } from 'react';
import { useKeplrContext } from '../keplr';

export const TxContext = createContext<{
  instantiateContract(
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
}>({
  instantiateContract: () => Promise.resolve(undefined),
  uploadContract: () => Promise.resolve(undefined),
  simulateFee: () => Promise.resolve(undefined),
});

export const TxProvider = ({ children }: { children: ReactNode }) => {
  const { getKeplr, account, getCosmWasmClient } = useKeplrContext();
  const cosmwasmClient = getCosmWasmClient();
  const uploadContract = async (
    senderAddress: string,
    wasmCode: Uint8Array,
    fee: number | StdFee | 'auto',
    memo: string | undefined = undefined
  ) => {
    const keplr = await getKeplr();
    if (keplr === undefined || !account || !cosmwasmClient)
      return Promise.resolve(undefined);
    console.log('fee', fee);
    return await cosmwasmClient.upload(senderAddress, wasmCode, fee, memo);
  };

  const instantiateContract = async (
    codeId: number,
    msg: object,
    label: string,
    fee: StdFee
  ) => {
    const keplr = await getKeplr();
    if (keplr === undefined || !account || !cosmwasmClient)
      return Promise.resolve(undefined);
    return await cosmwasmClient.instantiate(
      account.address,
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
    const keplr = await getKeplr();
    if (keplr === undefined || !account || !cosmwasmClient)
      return Promise.resolve(undefined);
    return await cosmwasmClient.simulate(signerAddress, messages, memo);
  };

  return (
    <TxContext.Provider
      value={{ uploadContract, instantiateContract, simulateFee }}
    >
      {children}
    </TxContext.Provider>
  );
};

export const useTxContext = () => useContext(TxContext);
