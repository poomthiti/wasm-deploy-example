import './Main.css';
import { useKeplrContext } from '../contexts/keplr';
import { useCallback, useState } from 'react';
import { DropZone } from '../components/dropzone';
import {
  MsgInstantiateComposer,
  MsgStoreCodeComposer,
} from '../tx/msgComposer';
import { cosmwasm, estimateOsmoFee } from 'osmojs';
import { toUtf8 } from '@cosmjs/encoding';
import { StdFee } from '@cosmjs/stargate';
import Long from 'long';
import { FEE, INIT_MSG } from '../config/constants';
import { useTxContext } from '../contexts/tx';

function MainPage() {
  const { account, connectKeplr, disconnectKeplr } = useKeplrContext();
  const { uploadContract, instantiateContract, simulateFee } = useTxContext();
  const [wasmFile, setWasmFile] = useState<Uint8Array | undefined>();
  const [codeId, setCodeId] = useState<string>('');
  const sendStoreCodeTx = useCallback(async () => {
    if (!account || !wasmFile) {
      return alert('Keplr not connected or file not uploaded');
    }
    const msg = MsgStoreCodeComposer({
      sender: account.address,
      wasmByteCode: wasmFile,
      instantiatePermission: {
        permission: cosmwasm.wasm.v1.AccessType.ACCESS_TYPE_ONLY_ADDRESS,
        address: account.address,
      },
    });

    const estimatedFee = await simulateFee(account.address, [msg]);
    if (!estimatedFee) return alert('Cannot estimate fee');
    // const res = (await sendTxKeplr(msg, FEE)) as Object;
    const res = await uploadContract(account.address, wasmFile, FEE);
    console.log(res);
    // setCodeId(
    //   res.events.find((el) => el.type === 'store_code').attributes[0].value
    // );
    // console.log('TX Store Code Response', res);
  }, [account, wasmFile]);

  const instantiateContractTx = useCallback(async () => {
    // "3349"
    if (!account) {
      return alert('Keplr not connected');
    }
    const res = await instantiateContract(3349, INIT_MSG, 'beeb', FEE);
    console.log('TX Instantiate Response', res);
  }, [account, codeId]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="Container">
          {/* Keplr Connect Section */}
          <button
            onClick={async () => {
              if (account) {
                return disconnectKeplr();
              }
              await connectKeplr();
            }}
          >
            {account ? 'disconnect keplr' : 'CONNECT TO KEPLR'}
          </button>
          <h6>
            Bech32 Address: {account?.address}
            <br />
            Native Balance: {account?.balance} OSMO
          </h6>
          <div style={{ borderBottom: '1px solid #E5E5E5', margin: '8px 0' }} />
          {/* StoreCode Section */}
          <h6>Store Code</h6>
          <DropZone setFile={(file) => setWasmFile(file)} />
          {wasmFile && (
            <button style={{ marginTop: 16 }} onClick={sendStoreCodeTx}>
              Send Store Code Transaction
            </button>
          )}
          <h6>{codeId}</h6>
          {/* Instantiate Contract Section */}
          <div
            style={{ borderBottom: '1px solid #E5E5E5', margin: '32px 0 8px' }}
          />
          <h6>Instantiate Contract</h6>
          {
            <button style={{ marginTop: 16 }} onClick={instantiateContractTx}>
              Send Instantiate Code Transaction
            </button>
          }
        </div>
      </header>
    </div>
  );
}

export default MainPage;
