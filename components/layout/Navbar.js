import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import UAuth from '@uauth/js';
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

    const address = await signer.getAddress();
    setETHAddress(address);

    const _balance = await provider.getBalance(address);
    setBalance(_balance.toString());

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_SKALE_CONTRACTADDRESS, DigitalCoupon.abi, signer);
    setDCContract(contract);

    const sf = await Framework.create({
      chainId: 80001,
      provider: provider
    });
    console.log(sf);

    setsfMethods(sf);
  }

  return (
    <div>
       <Head>
        <title>Digital Coupon NFT</title>
        <meta name="description" content="Digital Coupon NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head> 
      <Link href="/">
        <img src="/logo.png" alt="Logo" style={{ width: "250px" }}/>
      </Link>
      <Link href="/">
        Home
      </Link>
      <Link href="/create-coupon">
        Create Coupon
      </Link>
      <button onClick={loginWithUnstoppableDomains}>
        Login with Unstoppable
      </button>
      <button onClick={connectMetamask}>
        {ethAddress ? ethAddress : "Connect Wallet"}
      </button>
      <p>{balance / 10 ** 18} ETH</p>
      <br />
      <br />
    </div>
  )
}

export default Navbar;