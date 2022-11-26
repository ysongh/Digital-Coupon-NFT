import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container, SimpleGrid, ButtonGroup, Box, Button, Text, InputGroup, InputRightElement, Input, Tooltip, useToast } from '@chakra-ui/react';
import { Web3Storage } from 'web3.storage';
import { WidgetProps } from "@worldcoin/id";
import { ethers, utils } from 'ethers';

import CouponDetailCard from '../../../components/CouponDetailCard';

const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_APIKEY });

const WorldIDWidget = dynamic(
  () => import("@worldcoin/id").then((mod) => mod.WorldIDWidget),
  { ssr: false }
);

export default function CouponDetail({ tokenName, ethAddress, userSigner, dcContract }) {
  const router = useRouter();
  const { id, address } = router.query;

  const toast = useToast()

  const [coupon, setCoupon] = useState({});
  const [loading, setLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [referCount, setReferCount] = useState("");
  const [isCopy, setIsCopy] = useState(false);
  const [url, setUrl] = useState("");
  const [worldcoinData, setWorldcoinData] = useState({});

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

      const referrer = await dcContract.referrersList(ethAddress, id);
      console.warn(referrer);
      console.warn(referrer.nullifierHash.toString());
      setReferCount(referrer.nullifierHash.toString());
      
      setLoading(false);
    } catch(error) {
     console.error(error);
     setLoading(false);
    }  
  }

  const createReferrer = async () => {
    try {
      console.log(worldcoinData);
      const abi = ethers.utils.defaultAbiCoder;
      const unpackedProof = abi.decode(["uint256[8]"], worldcoinData.proof)[0];
      const transaction = await dcContract.createReferrer(
        ethAddress,
        worldcoinData.merkle_root,
        worldcoinData.nullifier_hash,
        unpackedProof,
        id,
        {gasLimit: 1e7}
      );
      const tx = await transaction.wait();
      console.log(tx);
      setReferCount("1");
    } catch (error) {
      console.error(error);
    }
  }

  const buyProduct = async () => {
    try {
      setBuyLoading(true);
      const transaction = await dcContract.addRefer(id, ethAddress);
      const tx = await transaction.wait();
      console.log(tx);
      setBuyLoading(false);
    } catch (error) {
      console.error(error);
      setBuyLoading(false);
    }
  }

  const buyProductWithReferrer = async () => {
    try {
      const receiptData = JSON.stringify({ 
        title: coupon?.couponData?.titl,
        description: coupon?.couponData?.description,
        photoURL: coupon.cid + "/" + coupon?.couponData?.photoName,
        price: coupon?.couponData?.price,
        referrer: address,
        couponId: id,
        date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
      });
      const blob = new Blob([receiptData], {type: 'text/plain'});
      const receiptDataFile = new File([ blob ], 'receiptData.json');

      const cid = await client.put([receiptDataFile], {
        onRootCidReady: localCid => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `)
          console.log('> 📡 sending files to web3.storage ')
        },
        onStoredChunk: bytes => console.log(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`)
      })

      console.log(`https://dweb.link/ipfs/${cid}`);
      const url = `https://dweb.link/ipfs/${cid}`;

      let tx;

      if(tokenName === "MATIC"){
        const transaction = await dcContract.purchaseWithReferrer(id, address, url, worldcoinData.nullifier_hash, { value: coupon.price.toString() });
        tx = await transaction.wait();
        console.log(tx);
      } else {
        const transaction = await dcContract.purchaseWithReferrer(id, address, url, { value: coupon.price.toString() });
        tx = await transaction.wait();
        console.log(tx);
      }
      

      toast({
        title: 'Transaction Success!',
        description: tx.transactionHash,
        status: 'success',
        position: 'top-right',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })

    } catch (error) {
      console.error(error);
    }
  }

  const copyReferrerLink = () => {
    navigator.clipboard.writeText(`${url}/coupon/${id}/${ethAddress}`);
    setIsCopy(true)
  }
  
  return (
    <Container maxW='1300px' mt='5'>
      {loading
        ? <p>Loading...</p>
        :  <CouponDetailCard
            tokenName={tokenName}
            address={address}
            coupon={coupon}
            buyLoading={buyLoading}
            buyProduct={buyProduct}
            buyProductWithReferrer={buyProductWithReferrer}
            setWorldcoinData={setWorldcoinData} />
        }
      <SimpleGrid minChildWidth='350px' columns={[4]} spacing={10}>
        {referCount !== "0"
          ? <div>
            <Text fontSize='lg' mb='1'>Share this with your friends and earn {coupon?.couponData?.discount}% of the sale</Text>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                value={`${url}/coupon/${id}/${ethAddress}`}
              />
              <InputRightElement width='4.5rem'>
                <Tooltip label={isCopy ? "Copied" : "Copy"} closeOnClick={false}>
                  <Button h='1.75rem' size='sm' onClick={copyReferrerLink}>
                    Copy
                  </Button>
                </Tooltip>
              </InputRightElement>
            </InputGroup>
          </div>
          : <div>
            <Text fontSize='lg' mb='2'>Create Referrer Link to Share</Text>
            <WorldIDWidget
              actionId={process.env.NEXT_PUBLIC_WORLDCOIN_ACTIONID} // obtain this from developer.worldcoin.org
              signal={ethAddress}
              enableTelemetry
              onSuccess={(verificationResponse) => setWorldcoinData(verificationResponse)}
              onError={(error) => console.error(error)}
            />
            <Button colorScheme='orange' mt='2' onClick={createReferrer}>
              Create Referrer
            </Button>
          </div>
        }
        <div>
          <ButtonGroup spacing='3'>
            <Button colorScheme='orange' onClick={() => router.push(`/send-nft/${coupon.owner}`)}>
              Send NFT
            </Button>
            <Button colorScheme='orange' onClick={() => router.push(`/chat/${coupon.owner}`)}>
              Chat
            </Button>
          </ButtonGroup>
        </div>
      </SimpleGrid>
    </Container>
  )
}
