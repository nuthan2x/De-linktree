import React, {useEffect, useState} from 'react'
import { useProvider } from 'wagmi'
import {
  useAccount ,
  useSigner,
  useContract,
  useNetwork,
} from 'wagmi';
import { FaCopy, FaStopCircle, FaExternalLinkAlt} from 'react-icons/fa';
import { ethers } from 'ethers';
import axios from 'axios';

const FormData = require('form-data');

const MyProfileData = (props) => {
    const { address, isConnecting, isDisconnected } = useAccount()
    const { data: signer, isError, isLoading } = useSigner();
    const [filteredNSnames, setfilteredNSnames] = useState(undefined);

    const{ensAvatar, ensName} = props
    const [newMessage, setnewMessage] = useState(undefined);
    const [toAddress, settoAddress] = useState(undefined);
    const [txnStatus, setTxnStatus] = useState(undefined);
    const [amount, setamount] = useState(undefined);

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

    const getDATA = async () => {
      let eventFilter = Dlink_contract.filters.NewHash()
      let events = await Dlink_contract.queryFilter(eventFilter)
      console.log('events: ', events);
    }
    

    const  postData = async  () => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //we gather a local file from the API for this example, but you can gather the file from anywhere
        let data = JSON.stringify(socialData);
        return axios.post(url,
            data,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                    'pinata_api_key': 'caf6d483c5e33445dd20',
                    'pinata_secret_api_key': `464c7551da1200d4a4842e95a01bc4f7a66b5d7377a94d7733845ea83a5b49b7`
                }
            }
        ).then(function (response) {
          console.log('response: ', response);
            //handle response here
        }).catch(function (error) {
          console.log('error: ', error);
            //handle error here
        });
     };
      
    


  return (
    <div className="profileData">
      <h5 className='address'>{`Address :  ${address}`} <div onClick={() =>  navigator.clipboard.writeText(address)}/><FaCopy /></h5>

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

          <button onClick={postData}>Save</button>
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