import { GetKeplrProvider } from './contexts/keplr';
import { TxProvider } from './contexts/tx';
import MainPage from './pages/main';

function App() {
  return (
    <GetKeplrProvider>
      <TxProvider>
        <MainPage />
      </TxProvider>
    </GetKeplrProvider>
  );
}

export default App;
