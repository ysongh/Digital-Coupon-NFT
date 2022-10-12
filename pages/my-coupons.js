import React, { useEffect, useState } from 'react';
import { Container, Heading, SimpleGrid } from '@chakra-ui/react';

import CouponCard from '../components/CouponCard';

export default function MyCoupons({ ethAddress, tokenName, dcContract }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dcContract) fetchCoupons();
  }, [dcContract])

  const fetchCoupons = async () => {
    try{
      setLoading(true);

      const _counpons = await dcContract.getOwnerCoupons(ethAddress);
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
      <SimpleGrid minChildWidth='250px' columns={[3]} spacing={10} mb='10'>
      {loading
        ? <p>Loading...</p>
        : coupons.length
          ? coupons.map(c => <CouponCard key={c.couponId.toString()} c={c} tokenName={tokenName} />)
          : <Heading mt='5' textAlign='center'>
              You do not create any coupon
            </Heading>
        }
      </SimpleGrid>
    </Container>
  )
}
