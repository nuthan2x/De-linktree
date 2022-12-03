import React, { useEffect, useState } from 'react'
import {
  useAccount ,
  useSigner,
  useContract,
  useNetwork,
} from 'wagmi';
import { FaSearch } from 'react-icons/fa';
import ProfileData from './profileData';

const Home = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner();

  const [inputAddress, setinputAddress] = useState(undefined);
  const [searchAddress, setsearchAddress] = useState(true);

  return (
    <div className='home'>
      <div className="search">
        <input type="text" placeholder={`search with public address / ens`} onChange={(e) => setinputAddress(e.target.value)}/>
        <button onClick={(e) => setsearchAddress(e.target.value)}><FaSearch /></button>
      </div>

{   ( address && inputAddress == undefined)  && <ProfileData inputAddress={address}/>}

{   ( inputAddress) &&  <ProfileData inputAddress={inputAddress} /> }

       
    </div>
  )
}

export default Home