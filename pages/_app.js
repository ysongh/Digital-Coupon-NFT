import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '../components/layout/Navbar';

function MyApp({ Component, pageProps }) {
  const [ethAddress, setETHAddress] = useState('');
  const [userSigner, setUserSigner] = useState(null);
  const [domainData, setDomainData] = useState(null);
  const [dcContract, setDCContract] = useState(null);
  const [sfMethods, setsfMethods] = useState(null);

  return (
    <ChakraProvider>
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
        ethAddress={ethAddress}
        userSigner={userSigner}
        domainData={domainData}
        dcContract={dcContract}
        sfMethods={sfMethods} />
    </ChakraProvider>
  )
}

export default MyApp;
