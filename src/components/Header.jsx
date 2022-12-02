import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  return (
    <div className='header'>
        <ConnectButton showBalance={false} chainStatus="icon" />
    </div>
  )
}

export default Header