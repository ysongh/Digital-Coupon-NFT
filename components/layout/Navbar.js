import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import UAuth from '@uauth/js';
import { Box, Container, Flex, Image, Badge, Spacer, Link, Button } from '@chakra-ui/react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import DigitalCoupon from '../../artifacts/contracts/DigitalCoupon.sol/DigitalCoupon.json';
import DigitalCouponV1 from '../../artifacts/contracts/DigitalCouponV1.sol/DigitalCouponV1.json';
import { formatAddress } from '../../utils/formatAddress';

const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_UNSTOPPABLEDOMAINS_CLIENTID,
  redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLEDOMAINS_REDIRECT_URI,
  scope: "openid wallet"
});

function Navbar({ ethAddress, tokenName, domainData, setDomainData, setETHAddress, setUserSigner, setDCContract, setTokenName }) {
  const [balance, setBalance] = useState('');
  const [chainName, setChainName] = useState('');

  const loginWithUnstoppableDomains = async () => {
    try {
      const authorization = await uauth.loginWithPopup();
      authorization.sub = authorization.idToken.sub;
      console.log(authorization);

      setDomainData(authorization);
      connectMetamask();
    } catch (error) {
      console.error(error);
    }
  }

  const connectMetamask = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);  
    console.log(provider);

    const signer = provider.getSigner();
    setUserSigner(signer);

    const { chainId } = await provider.getNetwork();
    console.log(chainId)

    const address = await signer.getAddress();
    setETHAddress(address);

    const _balance = await provider.getBalance(address);
    setBalance(_balance.toString());

    if(chainId === 647426021){
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_SKALE_CONTRACTADDRESS, DigitalCouponV1.abi, signer);
      setDCContract(contract);
      setChainName("Skale");
      setTokenName("SFUEL");
    }
    else if(chainId === 1313161555){
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_AURORA_CONTRACTADDRESS, DigitalCouponV1.abi, signer);
      setDCContract(contract);
      setChainName("Aurora");
      setTokenName("ETH");
    }
    else if(chainId === 338){
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CRONO_CONTRACTADDRESS, DigitalCouponV1.abi, signer);
      setDCContract(contract);
      setChainName("Cronos");
      setTokenName("CRO");
    }
    else if(chainId === 80001){
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MUMBAI_CONTRACTADDRESS, DigitalCoupon.abi, signer);
      setDCContract(contract);
      setChainName("Mumbai");
      setTokenName("MATIC");
    }
    else if(chainId === 9000){
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_EVMOS_CONTRACTADDRESS, DigitalCouponV1.abi, signer);
      setDCContract(contract);
      setChainName("Evmos");
      setTokenName("EVMOS");
    }
    else if(chainId === 1287){
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MOONBASE_CONTRACTADDRESS, DigitalCouponV1.abi, signer);
      setDCContract(contract);
      setChainName("Moonbase");
      setTokenName("DEV");
    }
  }

  return (
    <Box bg='#f5eedf' p={2}>
       <Head>
        <title>Digital Coupon NFT</title>
        <meta name="description" content="Digital Coupon NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW='1300px'>
        <Flex minWidth='max-content' alignItems='center' gap='2'>
          <Box>
            <NextLink href='/' passHref>
              <Image src="/logo.png" alt="Logo" style={{ width: "200px", cursor: "pointer" }}/>
            </NextLink>
          </Box>
          <NextLink href='/' passHref>
            <Link>Home</Link>
          </NextLink>
          {ethAddress && <NextLink href='/my-coupons' passHref>
            <Link>My Coupons</Link>
          </NextLink>}
          {ethAddress && <NextLink href='/create-coupon' passHref>
            <Link>Create Coupon</Link>
          </NextLink>}
          <Spacer />
          {ethAddress && <p><Badge colorScheme='orange' fontSize='.9rem'>{chainName}</Badge> {balance / 10 ** 18} {tokenName}</p>}
          {!ethAddress && !domainData?.sub && <Button colorScheme='orange' onClick={loginWithUnstoppableDomains}>
            Login with Unstoppable
          </Button>}
          <Button colorScheme='orange' onClick={connectMetamask}>
            {domainData?.sub ? domainData?.sub : ethAddress ? formatAddress(ethAddress) : 'Connect Wallet'}
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar;