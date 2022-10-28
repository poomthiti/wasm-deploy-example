import { cosmwasm, cosmos } from 'osmojs';
import { MsgSend } from 'osmojs/types/codegen/cosmos/bank/v1beta1/tx';
import { MsgInstantiateContract, MsgStoreCode } from '../types';

const { storeCode, instantiateContract } =
  cosmwasm.wasm.v1.MessageComposer.withTypeUrl;
const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;

export const MsgStoreCodeComposer = (msg: MsgStoreCode) => {
  return storeCode(msg);
};

export const MsgInstantiateComposer = (msg: MsgInstantiateContract) => {
  return instantiateContract(msg);
};

export const MsgSendComposer = (msg: MsgSend) => {
  return send(msg);
};
