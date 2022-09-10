import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';

function MyApp({ Component, pageProps }) {
  const [ethAddress, setETHAddress] = useState('');
  const [userSigner, setUserSigner] = useState(null);
  const [domainData, setDomainData] = useState(null);
  const [dcContract, setDCContract] = useState(null);
  const [sfMethods, setsfMethods] = useState(null);

  return (
    <div>
      <Navbar
        domainData={domainData}
        ethAddress={ethAddress}
        setDomainData={setDomainData}
        setETHAddress={setETHAddress}
        setUserSigner={setUserSigner}
        setDCContract={setDCContract}
        setsfMethods={setsfMethods} />
      <Component
        {...pageProps}
        userSigner={userSigner}
        domainData={domainData}
        dcContract={dcContract}
        sfMethods={sfMethods} />
    </div>
  )
}

export default MyApp;
