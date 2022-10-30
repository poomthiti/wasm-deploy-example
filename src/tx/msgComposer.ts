import { cosmwasm } from 'osmojs';
import {
  MsgInstantiateContract,
  MsgStoreCode,
  MsgExecuteContract,
} from '../types';

const { storeCode, instantiateContract, executeContract } =
  cosmwasm.wasm.v1.MessageComposer.withTypeUrl;

export const MsgStoreCodeComposer = (msg: MsgStoreCode) => {
  return storeCode(msg);
};

export const MsgInstantiateComposer = (msg: MsgInstantiateContract) => {
  return instantiateContract(msg);
};

export const MsgExecuteContractComposer = (msg: MsgExecuteContract) => {
  return executeContract(msg);
};
