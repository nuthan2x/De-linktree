import React, {useEffect, useState} from 'react'
import { useProvider } from 'wagmi'
import {
  useAccount ,
  useSigner,
  useContract,
  useNetwork,
} from 'wagmi';
import { FaCopy } from 'react-icons/fa';

const ProfileData = (props) => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner();

  const [inputAddress, setinputAddress] = useState(undefined);
  const [newMessage, setnewMessage] = useState(undefined);
  const [txnStatus, setTxnStatus] = useState(undefined);
  const [amount, setamount] = useState(undefined);

  const{ensAvatar, ensName} = props

  useEffect( () => {
   
    console.log(props.ensAvatar);
    setinputAddress(props.inputAddress)
  }, [props.inputAddress]);

  const getHexMessage = (str) => {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n ++) 
      {
      var hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    console.log(`0x${arr1.join('')}`);
    return arr1.join('');
  }

  const sendMessage = async () => {
    setTxnStatus(undefined)
      const tx = {
          to : inputAddress,
          value : amount,
          data: `0x${getHexMessage(newMessage)}`,
      }
      const txn = await  signer.sendTransaction(tx);
      setTxnStatus(txn.hash)
      console.log('txn: ', txn);

  }

  return (
    <div className="profileData">
          <h5 className='address'>{`Address : ${inputAddress}`} <button onClick={() =>  navigator.clipboard.writeText(inputAddress)}><FaCopy /></button></h5>

      <div className="socials">
        <h4>Socials</h4>
        {ensName?.length !== 0 && 
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

      <h3>Sign a raw Transaction : </h3>
      <div className="sendTransaction">
        {/* <div>
          <input type="text" placeholder='address '/>
        </div> */}
          <label htmlFor="">{`sending to :  ${inputAddress?.slice(0,10)}...${inputAddress?.slice(33,42)}`}</label>

        <div>
          <label htmlFor="">Amount : &nbsp; </label>
          <input type="text" placeholder='send in ETH / MATIC'  onChange={(e) => setamount(e.target.value)}/>
        </div> 

        <div>
          <label htmlFor="">Message : &nbsp;</label>
          <textarea  type="text" placeholder='type message...' onChange={(e) => setnewMessage(e.target.value)}  rows="4" cols="50"/>
        </div>

        <div>
          <button onClick={sendMessage}>send Transaction</button> 
          {txnStatus && 
            <a href={`https://mumbai.polygonscan.com/tx/${txnStatus}`} target="_blank" rel="noopener noreferrer"><button>View Transaction</button></a>     
          }
        </div>
      </div>


    </div>
  )
}

export default ProfileData