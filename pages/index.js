import React, { useEffect, useState } from 'react';
import { Container, SimpleGrid } from '@chakra-ui/react';

import CouponCard from '../components/CouponCard';

export default function Home({ domainData, dcContract }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

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
  
  return (
    <Container maxW='1100px' mt='3'>
      <p>{JSON.stringify(domainData)}</p>
      <SimpleGrid minChildWidth='200px' columns={[4]} spacing={10} mb='10'>
        {loading
          ? <p>Loading...</p>
          : coupons.map(c => <CouponCard key={c.couponId.toString()} c={c} />
        )}
      </SimpleGrid>
    </Container>
  )
}
