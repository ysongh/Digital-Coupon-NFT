import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '../components/layout/Navbar';

function MyApp({ Component, pageProps }) {
  const [ethAddress, setETHAddress] = useState('');
  const [userSigner, setUserSigner] = useState(null);
  const [domainData, setDomainData] = useState(null);
  const [dcContract, setDCContract] = useState(null);
  const [tokenName, setTokenName] = useState("");

  return (
    <ChakraProvider>
      <Navbar
        domainData={domainData}
        ethAddress={ethAddress}
        tokenName={tokenName}
        setDomainData={setDomainData}
        setETHAddress={setETHAddress}
        setUserSigner={setUserSigner}
        setDCContract={setDCContract}
        setTokenName={setTokenName} />
      <Component
        {...pageProps}
        tokenName={tokenName}
        ethAddress={ethAddress}
        userSigner={userSigner}
        domainData={domainData}
        dcContract={dcContract} />
    </ChakraProvider>
  )
}

export default MyApp;
