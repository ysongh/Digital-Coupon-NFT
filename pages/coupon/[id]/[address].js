import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, ButtonGroup, Button, Text } from '@chakra-ui/react';

import CouponDetailCard from '../../../components/CouponDetailCard';

export default function CouponDetail({ ethAddress, userSigner, dcContract, sfMethods }) {
  const router = useRouter();
  const { id, address } = router.query;

  const [coupon, setCoupon] = useState({});
  const [showSFLink, setShowSFLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referCount, setReferCount] = useState("");
  const [isCopy, setIsCopy] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (dcContract) fetchCoupon();
  }, [dcContract])

  useEffect(() => {
    if (dcContract) fetchReferrer();
  }, [dcContract])

  useEffect(() => {
    setUrl(window.location.origin);
  }, [])

  const fetchCoupon = async () => {
    try{
      setLoading(true);

      const _counpon = await dcContract.couponList(id);
      console.log(_counpon);

      const res = await fetch(_counpon.cid + "/couponData.json");
      const couponData = await res.json();
      console.log(couponData); 

      setCoupon({..._counpon, couponData});

      setLoading(false);
    } catch(error) {
     console.error(error);
     setLoading(false);
    }  
  }

  const fetchReferrer = async () => {
    try{
      setLoading(true);

      const referrer = await dcContract.getAddressFromReferrer(id, ethAddress);
      console.log(referrer);
      setReferCount(referrer.length);

      setLoading(false);
    } catch(error) {
     console.error(error);
     setLoading(false);
    }  
  }

  const streamDai = async () => {
    try {
      const DAIxContract = await sfMethods.loadSuperToken("fDAIx");
      const DAIx = DAIxContract.address;
      console.log(DAIx);

      const createFlowOperation = sfMethods.cfaV1.createFlow({
        receiver: coupon.owner,
        flowRate: "1",
        superToken: DAIx,
      });

      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(userSigner);
      console.log(result);
      setShowSFLink(true);
    } catch (error) {
      console.error(error);
    }
  }

  const createReferrer = async () => {
    try {
      const transaction = await dcContract.createReferrer(id);
      const tx = await transaction.wait();
      console.log(tx);
    } catch (error) {
      console.error(error);
    }
  }

  const buyProduct = async () => {
    try {
      const transaction = await dcContract.addRefer(id, ethAddress);
      const tx = await transaction.wait();
      console.log(tx);
    } catch (error) {
      console.error(error);
    }
  }

  const buyProductWithReferrer = async () => {
    try {
      const transaction = await dcContract.purchaseWithReferrer(id, address, { value: coupon.price.toString() });
      const tx = await transaction.wait();
      console.log(tx);
    } catch (error) {
      console.error(error);
    }
  }

  const copyReferrerLink = () => {
    navigator.clipboard.writeText(`${url}/coupon/${id}/${ethAddress}`);
    setIsCopy(true)
  }
  
  return (
    <Container maxW='1300px' mt='3'>
      {loading
        ? <p>Loading...</p>
        :  <CouponDetailCard
            coupon={coupon}
            isCopy={isCopy}
            id={id}
            ethAddress={ethAddress}
            url={url}
            buyProduct={buyProduct}
            buyProductWithReferrer={buyProductWithReferrer}
            copyReferrerLink={copyReferrerLink} />
        }
      <ButtonGroup spacing='3'>
        <Button colorScheme='orange' onClick={streamDai}>
          Stream DAI
        </Button>
        <Button colorScheme='orange' onClick={() => router.push(`/send-nft/${coupon.owner}`)}>
          Send NFT
        </Button>
        <Button colorScheme='orange' onClick={() => router.push(`/chat/${coupon.owner}`)}>
          Chat
        </Button>
      </ButtonGroup>
      <Text mt='3'>{referCount} Refers</Text>

      {showSFLink && <a href={`https://app.superfluid.finance/`} target="_blank" rel="noopener noreferrer">
        View Dashboard
      </a>}
    </Container>
  )
}
