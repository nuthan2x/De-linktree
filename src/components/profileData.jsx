import React, {useEffect, useState} from 'react'

const ProfileData = (props) => {
  const [inputAddress, setinputAddress] = useState(undefined);

  useEffect(() => {
    setinputAddress(props.inputAddress)
    
  }, [props.inputAddress]);

  return (
    <div className="profileData">

      <div className="socials">
        <h4>Socials</h4>
        
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