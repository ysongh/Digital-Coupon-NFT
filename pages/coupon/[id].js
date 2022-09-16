import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, SimpleGrid, ButtonGroup, Image, Heading, Button, Text } from '@chakra-ui/react';

import { getDate } from '../../utils/date';

export default function CouponDetail({ ethAddress, userSigner, dcContract, sfMethods }) {
  const router = useRouter();
  const { id } = router.query;

  const [coupon, setCoupon] = useState({});
  const [showSFLink, setShowSFLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referCount, setReferCount] = useState("");

  useEffect(() => {
    if (dcContract) fetchCoupon();
  }, [dcContract])

  useEffect(() => {
    if (dcContract) fetchReferrer();
  }, [dcContract])

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
  
  return (
    <Container maxW='1300px' mt='3'>
      {loading
        ? <p>Loading...</p>
        :  <SimpleGrid minChildWidth='200px' columns={[4]} spacing={10} mb='10'>
            <Image src={coupon.cid + "/" + coupon?.couponData?.photoName} alt='Product' />
            <div>
              <Heading fontSize='2xl'>{coupon?.couponData?.title}</Heading>
              <Text>{coupon?.couponData?.description}</Text>
              <p>${coupon?.couponData?.price}</p>
              <p>{coupon?.couponData?.discount} Off</p>
              <p>Expire in {getDate(coupon?.expireDate?.toString())}</p>
              <p>From {coupon.owner}</p>
              <Button colorScheme='orange' onClick={buyProduct} mt='3'>
                Buy it
              </Button>
            </div>
          </SimpleGrid>
        }
      <ButtonGroup spacing='3'>
        <Button colorScheme='orange' onClick={streamDai}>
          Stream DAI
        </Button>
        <Button colorScheme='orange' onClick={() => router.push(`/chat/${coupon.owner}`)}>
          Chat
        </Button>
        <Button colorScheme='orange' onClick={createReferrer}>
          Be Referrer
        </Button>
      </ButtonGroup>
      <Text mt='3'>{referCount} Refers</Text>

      {showSFLink && <a href={`https://app.superfluid.finance/`} target="_blank" rel="noopener noreferrer">
        View Dashboard
      </a>}
    </Container>
  )
}
