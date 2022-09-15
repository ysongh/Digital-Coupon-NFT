import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, SimpleGrid, Box, Flex, Center, Spacer, Image, Heading, Button, Text } from '@chakra-ui/react';

import { getDate } from '../utils/date';

export default function Home({ domainData, dcContract }) {
  const router = useRouter();

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
        : coupons.map(c => (
            <Box key={c.tokenId.toString()} borderWidth='1px' borderRadius='lg' overflow='hidden' p='4'>
              <Image src={c.cid + "/" + c.couponData.photoName} alt="Product" />
              <Flex>
                <Heading fontSize='lg' mt='3' mb='3'>{c.couponData.title}</Heading>
                <Spacer />
                <Center>
                  <Text mb='2' fontSize='md'>{c.couponData.discount} Off</Text>
                </Center>
              </Flex>
              <Text>Expire in {getDate(c.expireDate.toString())}</Text>
              <Button mt='2' colorScheme='orange' onClick={() => router.push(`/coupon/${c.tokenId.toString()}`)}>
                View 
              </Button>
            </Box>
        ))}
      </SimpleGrid>
    </Container>
  )
}
