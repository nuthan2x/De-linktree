import React, {useEffect, useState} from 'react'
import {
  useAccount ,
  useSigner,
  useContract,
  useNetwork,
} from 'wagmi';
import { FaCopy, FaStopCircle, FaExternalLinkAlt} from 'react-icons/fa';
import { ethers } from 'ethers';
import axios from 'axios';



const MyProfileData = (props) => {
    const { address, isConnecting, isDisconnected } = useAccount()
    const { data: signer, isError, isLoading } = useSigner();
    const [filteredNSnames, setfilteredNSnames] = useState(undefined);

    const{ensAvatar, ensName} = props
    const [newMessage, setnewMessage] = useState(undefined);
    const [toAddress, settoAddress] = useState(undefined);
    const [txnStatus, setTxnStatus] = useState(undefined);
    const [amount, setamount] = useState(undefined);
    const [newIpfsHash, setnewIpfsHash] = useState(undefined);
    const [getIpfsHash, setgetIpfsHash] = useState(undefined);
    const [saveStatus, setsaveStatus] = useState(false);

    const dlink_add = "0x457F118DB546040a0bB8e4798d17622193b2Ff07";
    const dlink__ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"hash","type":"string"}],"name":"NewHash","type":"event"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"string","name":"hash","type":"string"}],"name":"storeHash","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    const Dlink_contract = new ethers.Contract(dlink_add, dlink__ABI, signer);
    
    const [socialData, setsocialData] = useState({
      lensHandle : undefined,
      twitterHandle : undefined,
      blogHandle : undefined,
      githubHandle : undefined,
    });

    useEffect(() => {
        setfilteredNSnames(ensName?.map(each => `${each } `))
    }, [ensName]);

    useEffect(() => {
      getDATA()
     
    }, [address]);


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
            value : ethers.utils.parseEther(amount),
            data: `0x${getHexMessage(newMessage)}`,
        }
        const txn = await  signer.sendTransaction(tx);
        setTxnStatus(txn.hash)
        console.log('txn: ', txn);

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

    const getDATA = async () => {
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
        
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    const updateOnContract =async (hash) => {
      console.log('hash: ', hash);
        const dlink_add = "0x457F118DB546040a0bB8e4798d17622193b2Ff07";
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai')
        const signerx = new ethers.Wallet(process.env.REACT_APP_PRIVATEKEY, provider);
        const dlink__ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"hash","type":"string"}],"name":"NewHash","type":"event"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"string","name":"hash","type":"string"}],"name":"storeHash","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        const Dlink_contract = new ethers.Contract(dlink_add, dlink__ABI, signerx);
        
        const txn = await Dlink_contract.storeHash(address, hash.toString());
        console.log('txn: ', `https://mumbai.polygonscan.com/tx/${txn.hash}`);
        const receipt = await txn.wait();
    }


    const  postData = async  () => {
      console.log('socialData: ', socialData);
      var metadataUploaded = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", socialData, 
      {
        headers:{
          'pinata_api_key': "282676e08c3d10a5b8b7",
          'pinata_secret_api_key': "3eecc1f64f87b943d222bc4b749ab752f14422c32f7accf1f92e52d85d8837f5",
          'path': "metadata.json"
        }
      }).then(function (response) {
        console.log('metadataUploaded fgh: ', metadataUploaded);
        console.log('metadataUploaded: ', response);
        setnewIpfsHash(`https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
        setsaveStatus(true)
        updateOnContract(response.data.IpfsHash)
        setTimeout(() => {
          setsaveStatus(false)
          
        }, 2000);
      return response;
    }).catch(function (error) {
      console.log(error);
    });
    
     };
      
    


  return (
    <div className="profileData">
      {address && <h5 className='address'>{`Address :  ${address}`} <div onClick={() =>  navigator.clipboard.writeText(address)}/><FaCopy /></h5>}

      <div className="socials">
        {/* {ensName?.length && 
            <h4>{`ENS names : ${filteredNSnames?.map((each,i) => each)}`}</h4>
        } */}
        <h4>Socials</h4>
       { ensAvatar &&
        <div className="ensAvatar">
            <img src={ensAvatar} alt="" />
        </div>}

        <div className="socialMedia">

          <div>
            <img src="https://files.readme.io/a0959e6-lens-logo1.svg" alt="" /> 
            <input type="text" 
              placeholder='.lens handle' 
              value={socialData.lensHandle}
              onChange={(e) => setsocialData(prev => {
                return {...prev, lensHandle : e.target.value}     
              })}
            />
            <a href={socialData.lensHandle} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt size="10.5"/></a>
          </div>

          <div>
            <img src="https://img.icons8.com/color/2x/twitter.png" alt="" /> 
            <input type="text" 
              placeholder='twitter handle' 
              value={socialData.twitterHandle}
              onChange={(e) => setsocialData(prev => {
                  return {...prev, twitterHandle : e.target.value}     
                })}
            />
            <a href={socialData.twitterHandle} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt size="10.5"/></a>
          </div>

          <div>
            <img src="https://img.icons8.com/ios-filled/2x/medium-logo.png" alt="" /> 
            <input type="text"
              placeholder='blogs page' 
              value={socialData.blogHandle}
              onChange={(e) => setsocialData(prev => { 
                return {...prev, blogHandle : e.target.value}     
              })}
             />
            <a href={socialData.blogHandle} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt size="10.5"/></a>
          </div>        

          <div>
            <img src="https://img.icons8.com/sf-regular-filled/2x/github.png" alt="" /> 
            <input type="text" 
              placeholder='github profile' 
              value={socialData.githubHandle}
               onChange={(e) => setsocialData(prev => {
                return {...prev, githubHandle : e.target.value}     
              })}
            />
            <a href={socialData.githubHandle} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt size="10.5"/></a>
          </div>

          <button onClick={postData}>{saveStatus ? 'Saved' : 'Save'}</button>
        </div>

      </div>

      <div className='protfolio'>
        <h4>Portfolio & Explorers</h4>
        <a href={`https://blockscan.com/address/${address}` } target="_blank" rel="noopener noreferrer"> <FaStopCircle /><p> Blockscan.com </p><FaExternalLinkAlt size="10.5"/></a>
        <a href={`https://portfolio.nansen.ai/dashboard/${address}` } target="_blank" rel="noopener noreferrer"> <FaStopCircle/><p> portfolio.nansen </p><FaExternalLinkAlt size="10.5"/></a>
        <a href={`https://debank.com/profile/${address}` } target="_blank" rel="noopener noreferrer"> <FaStopCircle/><p> debank.com </p><FaExternalLinkAlt size="10.5"/></a>
        <a href={`https://zapper.fi/account/${address}` } target="_blank" rel="noopener noreferrer"> <FaStopCircle/><p> zapper.fi </p><FaExternalLinkAlt size="10.5"/></a>
      </div >

      <div className='txnContainer'>
        <h4>Sign a raw Transaction  </h4>
        <div className="sendTransaction"> 
          <div>
            <label htmlFor="">send to:&nbsp; </label>
            <input type="text" placeholder='address '  onChange={(e) => settoAddress(e.target.value)}/>
          </div>
        
          <div>
            <label htmlFor="">Amount :&nbsp;  </label>
            <input type="text" placeholder='send in ETH / MATIC'  onChange={(e) => setamount(e.target.value)}/>
          </div> 
        
          <div>
            <label htmlFor="">Message:&nbsp;  </label>
            <textarea  type="text" placeholder='type message...' onChange={(e) => setnewMessage(e.target.value)}  rows="5" cols="41"/>
          </div>
        
          <div className='txnButtons'>
            <button onClick={sendMessage}>send Transaction</button> 
            {txnStatus && 
              <a href={`https://mumbai.polygonscan.com/tx/${txnStatus}`} target="_blank" rel="noopener noreferrer"><button>View Transaction</button></a>     
            }
          </div>
        </div>
      </div >


    </div>
  )
}

export default MyProfileData