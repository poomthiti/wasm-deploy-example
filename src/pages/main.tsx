import './Main.css';
import { useKeplrContext } from '../contexts/keplr';
import { useCallback, useState } from 'react';
import { DropZone } from '../components/dropzone';
import {
  MsgExecuteContractComposer,
  MsgInstantiateComposer,
  MsgStoreCodeComposer,
} from '../tx/msgComposer';
import { cosmwasm } from 'osmojs';
import Long from 'long';
import { getFee, INIT_MSG, mintMsg } from '../config/constants';
import { useTxContext } from '../contexts/tx';

function MainPage() {
  const { account, connectKeplr, disconnectKeplr } = useKeplrContext();
  const { uploadContract, instantiateContract, simulateFee, executeContract } =
    useTxContext();
  const [wasmFile, setWasmFile] = useState<Uint8Array | undefined>();
  const [inputMsg, setInputMsg] = useState(
    JSON.stringify(mintMsg, undefined, 2)
  );
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
    const res = await uploadContract(
      account.address,
      wasmFile,
      getFee(estimatedFee)
    );
    console.log('TX Store Code Response', res);
  }, [account, wasmFile]);

  const instantiateContractTx = useCallback(async () => {
    // "3380"
    if (!account) {
      return alert('Keplr not connected');
    }
    const msg = MsgInstantiateComposer({
      sender: account.address,
      admin: account.address,
      codeId: Long.fromNumber(3349),
      label: 'beeb',
      msg: Buffer.from(JSON.stringify(INIT_MSG)),
      funds: [],
    });
    const estimatedFee = await simulateFee(account.address, [msg]);
    if (!estimatedFee) return alert('Cannot estimate fee');
    const res = await instantiateContract(
      account.address,
      3380,
      INIT_MSG,
      'beeb',
      getFee(estimatedFee)
    );
    console.log('TX Instantiate Response', res);
  }, [account]);

  const executeContractTx = useCallback(async () => {
    // contract: osmo1agptdpegjlq2fgkufaclpjw9p7u50smakwn8e3h54u4ugjml4tyq25q8k7
    if (!account) {
      return alert('Keplr not connected');
    }
    const msg = MsgExecuteContractComposer({
      sender: account.address,
      contract:
        'osmo1agptdpegjlq2fgkufaclpjw9p7u50smakwn8e3h54u4ugjml4tyq25q8k7',
      msg: Buffer.from(inputMsg, 'utf-8'),
      funds: [],
    });
    const estimatedFee = await simulateFee(account.address, [msg]);
    if (!estimatedFee) return alert('Cannot estimate fee');
    const res = await executeContract(
      account.address,
      'osmo1agptdpegjlq2fgkufaclpjw9p7u50smakwn8e3h54u4ugjml4tyq25q8k7',
      JSON.parse(inputMsg),
      getFee(estimatedFee)
    );
    console.log('EXECUTE CONTRACT RESPONSE', res);
  }, [account]);

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
          {/* Instantiate Contract Section */}
          <div
            style={{ borderBottom: '1px solid #E5E5E5', margin: '32px 0 8px' }}
          />
          <h6>Instantiate Contract</h6>
          <button onClick={instantiateContractTx}>
            Send Instantiate Code Transaction
          </button>
          {/* Execute Contract Section */}
          <div
            style={{ borderBottom: '1px solid #E5E5E5', margin: '32px 0 8px' }}
          />
          <h6>Execute Contract</h6>
          <textarea
            rows={8}
            name="text"
            placeholder="Enter JSON message here..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <button style={{ marginTop: 16 }} onClick={executeContractTx}>
            Execute Contract
          </button>
        </div>
      </header>
    </div>
  );
}

export default MainPage;
