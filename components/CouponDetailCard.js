import React from 'react';
import { SimpleGrid, Image, InputGroup, InputRightElement, Input, Tooltip, Heading, Button, Text } from '@chakra-ui/react';

import { getDate } from '../utils/date';

function CouponDetailCard({ coupon, isCopy, url, id, ethAddress, buyProduct, copyReferrerLink }) {
  return (
    <SimpleGrid minChildWidth='200px' columns={[4]} spacing={10} mb='10'>
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

        <Text fontSize='lg' mt='10' mb='1'>Share this with your friends</Text>
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
    </SimpleGrid>
  )
}

export default CouponDetailCard;