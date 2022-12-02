
import '@rainbow-me/rainbowkit/styles.css';
import {
  Chain,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  useContractEvent,
  useContractRead ,
  useSigner,
  useContract,
} from 'wagmi';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { useEffect, useState } from 'react';
import { ConnectButton ,lightTheme} from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import Header from './components/Header';
import Home from './components/home';
import "./App.css";

const { chains, provider } = configureChains(
  [ 
    // chain.mainnet, 
    chain.goerli, 
    // chain.sepolia,
    // chain.optimism,
    // chain.optimismGoerli,
    // chain.optimismKovan,
    // chain.polygon,
    chain.polygonMumbai,
    // chain.arbitrum,
    // chain.arbitrumRinkeby   
   ],
  [
    // alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})



function App() {
  const [activelink, setactivelink] = useState(undefined);

  useEffect(() => {
    setactivelink("0")
  }, []);
  
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact" theme={{
      lightMode: lightTheme(),
      // darkMode: darkTheme(),
       }} initialChain={chain.polygonMumbai}>

       
          <Header />
          <Home />
      

      </RainbowKitProvider>
    </WagmiConfig>
    
  );
}

export default App;

