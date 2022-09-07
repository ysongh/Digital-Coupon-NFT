import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';

function MyApp({ Component, pageProps }) {
  const [ethAddress, setETHAddress] = useState('');
  const [userSigner, setUserSigner] = useState(null);
  const [domainData, setDomainData] = useState(null);

  return (
    <div>
      <Navbar
        domainData={domainData}
        ethAddress={ethAddress}
        setDomainData={setDomainData}
        setETHAddress={setETHAddress}
        setUserSigner={setUserSigner} />
      <Component
        {...pageProps}
        userSigner={userSigner}
        domainData={domainData} />
    </div>
  )
}

export default MyApp;
