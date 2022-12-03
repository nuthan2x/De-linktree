import React, {useEffect, useState} from 'react'
import { useProvider } from 'wagmi'
import {
    useAccount ,
    useSigner,
    useContract,
    useNetwork,
  } from 'wagmi';

const MyProfileData = (props) => {
    const { address, isConnecting, isDisconnected } = useAccount()
    const { data: signer, isError, isLoading } = useSigner();
    const [filteredNSnames, setfilteredNSnames] = useState(undefined);

    const{ensAvatar, ensName} = props
    const [newMessage, setnewMessage] = useState(undefined);
    const [toAddress, settoAddress] = useState(undefined);
    const [txnStatus, setTxnStatus] = useState(undefined);

    useEffect(() => {
        setfilteredNSnames(ensName?.map(each => `${each } `))
    }, [ensName]);

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
            to : toAddress,
            data: `0x${getHexMessage(newMessage)}`,
        }
        const txn = await  signer.sendTransaction(tx);
        setTxnStatus(txn.hash)
        console.log('txn: ', txn);

    }

  return (
    <div className="profileData">
      <h5>{`My Account :  ${address}`}</h5>

      <div className="socials">
        {/* {ensName?.length && 
            <h4>{`ENS names : ${filteredNSnames?.map((each,i) => each)}`}</h4>
        } */}
       { ensAvatar &&
        <div className="ensAvatar">
            <img src={ensAvatar} alt="" />
        </div>}
        <h4>Socials</h4>

      </div>

      <div className='protfolio'>
        <h4>Portfolio & Explorers</h4>
        <a href={`https://blockscan.com/address/${address}` } target="_blank" rel="noopener noreferrer"> <p>Blockscan.com </p></a>
        <a href={`https://portfolio.nansen.ai/dashboard/${address}` } target="_blank" rel="noopener noreferrer"> <p>portfolio.nansen </p></a>
        <a href={`https://debank.com/profile/${address}` } target="_blank" rel="noopener noreferrer"> <p>debank.com </p></a>
        <a href={`https://zapper.fi/account/${address}` } target="_blank" rel="noopener noreferrer"> <p>zapper.fi </p></a>
      </div >

      <h3>Sign a raw Transaction : </h3>
      <div className="sendTransaction">
        <div>
          <label htmlFor="">send to: </label>
          <input type="text" placeholder='address '/>
        </div>

        <div>
          <label htmlFor="">Amount : </label>
          <input type="text" placeholder='send in ETH / MATIC' />
        </div>

        <div>
          <label htmlFor="">Message : </label>
          <input type="text" placeholder='type message...' onChange={(e) => setnewMessage(e.target.value)}/>
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

export default MyProfileData