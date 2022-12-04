import React, {useEffect, useState} from 'react'
import { useProvider } from 'wagmi'
import {
  useAccount ,
  useSigner,
  useContract,
  useNetwork,
} from 'wagmi';
import { FaCopy, FaStopCircle, FaExternalLinkAlt} from 'react-icons/fa';
import axios from 'axios';

const ProfileData = (props) => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner();

  const [inputAddress, setinputAddress] = useState(undefined);
  const [newMessage, setnewMessage] = useState(undefined);
  const [txnStatus, setTxnStatus] = useState(undefined);
  const [amount, setamount] = useState(undefined);
  const [newIpfsHash, setnewIpfsHash] = useState(undefined);
  const [getIpfsHash, setgetIpfsHash] = useState(undefined);
  const [NoData, setNoData] = useState(true);

  const [socialData, setsocialData] = useState({
    lensHandle : undefined,
    twitterHandle : undefined,
    blogHandle : undefined,
    githubHandle : undefined,
  });

  const{ensAvatar, ensName} = props

  useEffect(() => {
    getDATA(props.inputAddress)
   
  }, [address]);

  useEffect( () => {
   
    console.log(props.ensAvatar);
    setinputAddress(props.inputAddress)
    getDATA(props.inputAddress)
    setNoData(true)
  }, [props.inputAddress]);

  const getDATA = async (address) => {
    const options = {
      method: 'GET',
      url: 'https://deep-index.moralis.io/api/v2/0x457F118DB546040a0bB8e4798d17622193b2Ff07/logs',
      params: {
        chain: 'mumbai',
        from_block: '29478720',
        topic1: `0x000000000000000000000000${address?.slice(2,42)}`
      },
      headers: {accept: 'application/json', 'X-API-Key': 'OALLEXDPSYlwQ7u2A67gUCAY0TRLM5yjAVdjwHApeS1bnAlD03keIq9KpJDi8sG7'}
    };
    
    
    axios
      .request(options)
      .then(function (response) {
        console.log('response.data.total: ', response.data.total);
        setgetIpfsHash(`https://gateway.pinata.cloud/ipfs/${hex_to_ascii(response.data?.result[0]?.data?.slice(130,258))}`);
        
        console.log('getIpfsHash: ', getIpfsHash);
        fetch(`https://gateway.pinata.cloud/ipfs/${hex_to_ascii(response.data?.result[0]?.data?.slice(130,258))}`)
        .then((response) => response.json())
        .then((data) => setsocialData(data));

        response.data.total > 0 && setNoData(false)
      
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  
  function hex_to_ascii(str1)
  {
    var hex  = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

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
          <h5 className='address'>{`Address : ${inputAddress}`} <div onClick={() =>  navigator.clipboard.writeText(inputAddress)}><FaCopy /></div></h5>

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

        {!NoData && <div className="socialMedia">

          <div>
            <img src="https://files.readme.io/a0959e6-lens-logo1.svg" alt="" /> 
            <h3>{socialData.lensHandle}</h3><div onClick={() =>  navigator.clipboard.writeText(socialData.lensHandle)}><FaCopy size={13}/></div>
            <a href={socialData.lensHandle} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt size="10.5"/></a>
          </div>

          <div>
            <img src="https://img.icons8.com/color/2x/twitter.png" alt="" /> 
            <h3>{socialData.twitterHandle}</h3><div onClick={() =>  navigator.clipboard.writeText(socialData.twitterHandle)}><FaCopy size={13}/></div>
            
            <a href={socialData.twitterHandle} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt size="10.5"/></a>
          </div>

          <div>
            <img src="https://img.icons8.com/ios-filled/2x/medium-logo.png" alt="" /> 
            <h3>{socialData.blogHandle}</h3><div onClick={() =>  navigator.clipboard.writeText(socialData.blogHandle)}><FaCopy size={13}/></div>
            <a href={socialData.blogHandle} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt size="10.5"/></a>
          </div>        

          <div>
            <img src="https://img.icons8.com/sf-regular-filled/2x/github.png" alt="" /> 
            <h3>{socialData.githubHandle}</h3><div onClick={() =>  navigator.clipboard.writeText(socialData.githubHandle)}><FaCopy size={13}/></div>
            
            <a href={socialData.githubHandle} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt size="10.5"/></a>
          </div>
          </div>}

      </div>

      <div className='protfolio'>
        <h4>Portfolio & Explorers</h4>
        <a href={`https://blockscan.com/address/${inputAddress}` } target="_blank" rel="noopener noreferrer"> <FaStopCircle /><p> Blockscan.com </p><FaExternalLinkAlt size="10.5"/></a>
        <a href={`https://portfolio.nansen.ai/dashboard/${inputAddress}` } target="_blank" rel="noopener noreferrer"> <FaStopCircle/><p> portfolio.nansen </p><FaExternalLinkAlt size="10.5"/></a>
        <a href={`https://debank.com/profile/${inputAddress}` } target="_blank" rel="noopener noreferrer"> <FaStopCircle/><p> debank.com </p><FaExternalLinkAlt size="10.5"/></a>
        <a href={`https://zapper.fi/account/${inputAddress}` } target="_blank" rel="noopener noreferrer"> <FaStopCircle/><p> zapper.fi </p><FaExternalLinkAlt size="10.5"/></a>
      </div >

      <div className='txnContainer'>        <h3>Sign a raw Transaction : </h3>
        <div className="sendTransaction">
          {/* <div>
            <input type="text" placeholder='address '/>
          </div> */}
            <label htmlFor="">{`send-to : ${inputAddress?.slice(0,10)}...${inputAddress?.slice(33,42)}`}</label>
        
          <div>
            <label htmlFor="">Amount :&nbsp; </label>
            <input type="text" placeholder='send in ETH / MATIC'  onChange={(e) => setamount(e.target.value)}/>
          </div> 
        
          <div>
            <label htmlFor="">Message:&nbsp;</label>
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


    </div>
  )
}

export default ProfileData