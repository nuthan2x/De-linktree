import React, { useEffect, useState } from 'react'
import {
  useAccount ,
  useSigner,
  useContract,
  useNetwork,
} from 'wagmi';
import { FaSearch } from 'react-icons/fa';
import ProfileData from './profileData';
import { useProvider } from 'wagmi'
import { ethers } from 'ethers';
import MyProfileData from './myAccount';
import { Alchemy, Network } from "alchemy-sdk";
import axios from 'axios';

const Home = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner();
  const provider = useProvider()

  const [inputAddress, setinputAddress] = useState(undefined);
  const [searchAddress, setsearchAddress] = useState(false);
  const [ensAvatar, setensAvatar] = useState(undefined);
  const [ensName, setensName] = useState(undefined);
  const [MAon, setMAon] = useState(true);
  const [EOA, setEOAon] = useState(false);

  const config = {
    apiKey: "yCsyT__AiAEImRomu0wLm1thqMJkMG8E",
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  // useEffect(() => {
  //   setinputAddress(address)
   
  // }, [address]);

  const ensResolve = async () => {
    
    if (inputAddress?.length !== 42) {
      setsearchAddress(true)
      
      await alchemy.core.resolveName(inputAddress).then(res => {setinputAddress(res); console.log('res: ', res);});

      axios.get(`https://metadata.ens.domains/mainnet/avatar/${inputAddress}`) 
      .then(res => {
        console.log(res)
        setensAvatar(`https://metadata.ens.domains/mainnet/avatar/${inputAddress}`)
      }) 
      .catch(err => {console.log(err); setensAvatar(false)})

    }else{
      console.log('addr: ', inputAddress);
      axios.get(`https://metadata.ens.domains/mainnet/avatar/${inputAddress}`) 
      .then(res => {
        console.log(res)
        setensAvatar(`https://metadata.ens.domains/mainnet/avatar/${inputAddress}`)
      }) 
      .catch(err => {console.log(err); setensAvatar(false)})
      setinputAddress(inputAddress)

      
      
    }
    const ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
    const nfts = await alchemy.nft.getNftsForOwner(inputAddress, {
      contractAddresses: [ensContractAddress],
    });
    console.log('nfts: ', nfts);

    nfts ? setensName(nfts.ownedNfts?.map((each, i) => {return `${each.title } `})) : setensName([])
  }

  useEffect(() => {

     MAon && 
     ensResolve(address); 
    //  setEOAon(false)
  }, [ MAon]);

  useEffect(() => {
    
    setinputAddress(undefined)
  }, [EOA]);

 

  return (
    <div className='home'>
      <div className="switches">
        <button className= {MAon ? 'selected' : 'notSelected' }
         onClick={() => {
          setMAon(true);
          setEOAon(false);
         }
         }>My account
        </button>

        <button className= {!MAon ? 'selected' : 'notSelected' } 
         onClick={() => {
          setMAon(false);
          setEOAon(true);
         }
         }>External account
        </button>
      </div>

      {EOA && <div className="search">
        <input type="text" placeholder={`search with public address / ens`} onChange={(e) => setinputAddress(e.target.value)} />
        <button onClick={() => ensResolve()}><FaSearch /></button>
      </div>}

  { ( EOA ) ? 
    inputAddress && <ProfileData inputAddress={inputAddress} ensAvatar={ensAvatar} ensName={ensName}/> :
    <MyProfileData ensAvatar={ensAvatar} ensName={ensName}/>
    
  }
  
    </div>
  )
}

export default Home