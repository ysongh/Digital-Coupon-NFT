import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import UAuth from '@uauth/js';
import { Box, Container, Flex, Spacer, Link, Button } from '@chakra-ui/react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { Framework } from "@superfluid-finance/sdk-core";

import DigitalCoupon from '../../artifacts/contracts/DigitalCoupon.sol/DigitalCoupon.json';

const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_UNSTOPPABLEDOMAINS_CLIENTID,
  redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLEDOMAINS_REDIRECT_URI,
  scope: "openid wallet"
});

function Navbar({ ethAddress, setDomainData, setETHAddress, setUserSigner, setDCContract, setsfMethods }) {
  const [balance, setBalance] = useState('');
  const [chainName, setChainName] = useState('');

  const loginWithUnstoppableDomains = async () => {
    try {
      const authorization = await uauth.loginWithPopup();
      authorization.sub = authorization.idToken.sub;
      console.log(authorization);

      setDomainData(authorization);
      connectWallet();
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
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_SKALE_CONTRACTADDRESS, DigitalCoupon.abi, signer);
      setDCContract(contract);
      setChainName("Skale");
    }
    else if(chainId === 80001){
      const sf = await Framework.create({
        chainId: 80001,
        provider: provider
      });
      console.log(sf);
      setsfMethods(sf);
    }
  }

  return (
    <div>
       <Head>
        <title>Digital Coupon NFT</title>
        <meta name="description" content="Digital Coupon NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW='1300px' p={2}>
        <Flex minWidth='max-content' alignItems='center' gap='2'>
          <Box p='2'>
            <NextLink href='/' passHref>
              <img src="/logo.png" alt="Logo" style={{ width: "200px" }}/>
            </NextLink>
          </Box>
          <NextLink href='/' passHref>
            <Link>Home</Link>
          </NextLink>
          <NextLink href='/my-coupons' passHref>
            <Link>My Coupons</Link>
          </NextLink>
          <NextLink href='/create-coupon' passHref>
            <Link>Create Coupon</Link>
          </NextLink>
          <Spacer />
          {ethAddress && <p>{chainName} {balance / 10 ** 18} ETH</p>}
          <Button colorScheme='orange' onClick={loginWithUnstoppableDomains}>
            Login with Unstoppable
          </Button>
          <Button colorScheme='orange' onClick={connectMetamask}>
            {ethAddress ? ethAddress : "Connect Wallet"}
          </Button>
        </Flex>
      </Container>
    </div>
  )
}

export default Navbar;