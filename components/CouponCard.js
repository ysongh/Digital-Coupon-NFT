import React from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Center, Spacer, Image, Heading, Button, Text } from '@chakra-ui/react';

import { getDate } from '../utils/date';

function CouponCard({ c, tokenName }) {
  const router = useRouter();

  return (
    <Box borderWidth='1px' borderRadius='lg' overflow='hidden' p='4'>
      <Image src={c.cid + "/" + c.couponData.photoName} alt="Product" />
      <Flex>
        <Heading fontSize='lg' mt='3' mb='3'>{c.couponData.title}</Heading>
        <Spacer />
        <Center>
          <Text fontSize='md'>{c.couponData.discount} Off</Text>
        </Center>
      </Flex>
      <Text>Expire in {getDate(c.expireDate.toString())}</Text>
      <Flex>
        <Button mt='2' colorScheme='orange' onClick={() => router.push(`/coupon/${c.couponId.toString()}/0`)}>
          View 
        </Button>
        <Spacer />
        <Center>
          <Text fontSize='lg'>{c.price.toString() / 10 ** 18} {tokenName}</Text>
        </Center>
      </Flex>
    </Box>
  )
}

export default CouponCard;