import React, { useEffect, useState } from 'react'
import {
  useAccount ,
  useSigner,
  useContract,
  useNetwork,
} from 'wagmi';

const Home = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner();

  const [newMessage, setnewMessage] = useState(undefined);
  const [toAddress, settoAddress] = useState(undefined);
  const [prevData, setprevData] = useState(undefined);

  useEffect(() => {
    getPrevData()
 
  }, [toAddress]);

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
    const tx = {
      to : toAddress,
      data: `0x${getHexMessage(newMessage)}`,
    }
      const txn = await  signer.sendTransaction(tx);
      console.log('txn: ', txn);

  }

  const getPrevData = () => {
    const options = {method: 'GET', headers: {accept: 'application/json', 'X-API-Key': 'OALLEXDPSYlwQ7u2A67gUCAY0TRLM5yjAVdjwHApeS1bnAlD03keIq9KpJDi8sG7'}};

    fetch(`https://deep-index.moralis.io/api/v2/{toAddress}/verbose?chain=0x13881`, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }



  return (
    <div className='home'>
        <div className="inputform">
          <label htmlFor="">send to : </label>
          <input type="text" name="" id="" placeholder='public address' onChange={(e) => settoAddress(e.target.value)}/>
          <label htmlFor=""> message : </label>
          <input type="text" placeholder='type message...' onChange={(e) => setnewMessage(e.target.value)}/>
          <button onClick={sendMessage}>send Message</button>
        </div>

        <div className="prevMessage">
          <h3>{`preChat with : ${toAddress}`}</h3>
          <h3>{`me : ${address}`}</h3>

          <p></p>
        </div>
    </div>
  )
}

export default Home