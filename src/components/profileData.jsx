import React, {useEffect, useState} from 'react'
import { useProvider } from 'wagmi'

const ProfileData = (props) => {
  const provider = useProvider()
  const [inputAddress, setinputAddress] = useState(undefined);

  const{ensAvatar, ensName} = props

  useEffect( () => {
   
    console.log(props.ensAvatar);
    setinputAddress(props.inputAddress)
  }, [props.inputAddress]);

  return (
    <div className="profileData">
          <h5>{`EOA : ${inputAddress}`}</h5>

      <div className="socials">
        <h4>Socials</h4>
        {ensName && 
          <h4>{`ENS names : ${ensName?.filter((each,i) => i < 3)}`}&nbsp;</h4>
        }
      { ensAvatar &&
        <div className="ensAvatar">
        <h4>ENS avatar : </h4>
            <img src={props.ensAvatar} alt="" />
        </div>}

      </div>

      <div className='protfolio'>
        <h4>Portfolio & Explorers</h4>
        <a href={`https://blockscan.com/address/${inputAddress}` }  target="_blank" rel="noopener noreferrer"> <p>Blockscan.com </p></a>
        <a href={`https://portfolio.nansen.ai/dashboard/${inputAddress}` } target="_blank" rel="noopener noreferrer"> <p>portfolio.nansen </p></a>
        <a href={`https://debank.com/profile/${inputAddress}` } target="_blank" rel="noopener noreferrer"> <p>debank.com </p></a>
        <a href={`https://zapper.fi/account/${inputAddress}` } target="_blank" rel="noopener noreferrer"> <p>zapper.fi </p></a>
      </div >


    </div>
  )
}

export default ProfileData