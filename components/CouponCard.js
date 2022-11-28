import React from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardFooter, Heading, Image, Button, Text } from '@chakra-ui/react'

import { getDate } from '../utils/date';

function CouponCard({ c, tokenName }) {
  const router = useRouter();

  return (
    <Card>
      <CardBody>
        <Image src={c.cid + "/" + c.couponData.photoName} alt="Product" h='250' w='full' style={{ objectFit: 'contain' }} />
        <Heading fontSize='lg' mb='3'>{c.couponData.title}</Heading>
        <Text>Expire in {getDate(c.expireDate.toString())}</Text>
      </CardBody>
      <CardFooter>
        <Button mr='2' colorScheme='orange' onClick={() => router.push(`/coupon/${c.couponId.toString()}/0`)}>
          View 
        </Button>
        <Text fontSize='lg' mt='1'>{c.price.toString() / 10 ** 18} {tokenName}</Text>
      </CardFooter>
    </Card>
  )
}

export default CouponCard;