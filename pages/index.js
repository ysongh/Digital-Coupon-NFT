import React, { useEffect, useState } from 'react';
import { Container, SimpleGrid, Heading } from '@chakra-ui/react';

import CouponCard from '../components/CouponCard';
import ChainCard from '../components/ChainCard';

export default function Home({ tokenName, dcContract }) {
  const [coupons, setCoupons] = useState([]);
  const [reciptCounts, setReciptCounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllNFTs();
  }, [])

  useEffect(() => {
    if (dcContract) fetchCoupons();
  }, [dcContract])

  const fetchCoupons = async () => {
    try{
      setLoading(true);

      const _counpons = await dcContract.getCoupons();
      console.log(_counpons);

      const temp = [];
      for (let c of _counpons) {
        const res = await fetch(c.cid + "/couponData.json");
        const couponData = await res.json();
        console.log(couponData); 
        temp.push({...c, couponData});
      }
      setCoupons(temp);

      setLoading(false);
    } catch(error) {
     console.error(error);
     setLoading(false);
    }  
  }

  const fetchAllNFTs = async () => {
    try{
      const chainList = [
        {
          id: '1313161555',
          address: process.env.NEXT_PUBLIC_AURORA_CONTRACTADDRESS,
          image: "/auroralogo.png"
        },
        {
          id: '80001',
          address: process.env.NEXT_PUBLIC_MUMBAI_CONTRACTADDRESS,
          image: "/polygonlogo.png"
        }
      ];
      const temp = [];
      chainList.map(async c => {
        const nft = await fetch(`https://api.covalenthq.com/v1/${c.id}/tokens/${c.address}/nft_token_ids/?quote-currency=USD&format=JSON&key=${process.env.NEXT_PUBLIC_COVALENT_APIKEY}`);
        const { data } = await nft.json();
        console.log(data);
        temp.push({ "count": data.items.length, "image": c.image });
      })
      temp.push({ "count": 5, "image": "skalelogo.png" });
      setReciptCounts(temp);
      
    } catch(error) {
      console.error(error);
    }
  }

  console.log(reciptCounts);
  
  return (
    <Container maxW='1100px' mt='3'>
      <Heading mb='2'>Number of Sales on these Network</Heading>
      <SimpleGrid bg='#ffe6cc' minChildWidth='250px' columns={[4]} spacing={10} mb='10'>
        {reciptCounts.map(r => <ChainCard r={r} />)}
      </SimpleGrid>
      <SimpleGrid minChildWidth='250px' columns={[4]} spacing={10} mb='10'>
        {loading
          ? <p>Loading...</p>
          : coupons.map(c => <CouponCard key={c.couponId.toString()} c={c} tokenName={tokenName} />
        )}
      </SimpleGrid>
    </Container>
  )
}
