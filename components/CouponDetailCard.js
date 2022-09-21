import React from 'react';
import dynamic from 'next/dynamic';
import { SimpleGrid, Image, InputGroup, InputRightElement, Input, Tooltip, Heading, Divider,Button, Text } from '@chakra-ui/react';
import { WidgetProps } from "@worldcoin/id";

import { getDate } from '../utils/date';

const WorldIDWidget = dynamic(
  () => import("@worldcoin/id").then((mod) => mod.WorldIDWidget),
  { ssr: false }
);

function CouponDetailCard({ tokenName, coupon, isCopy, url, id, ethAddress, buyProduct, buyProductWithReferrer, copyReferrerLink }) {
  return (
    <SimpleGrid minChildWidth='200px' columns={[4]} spacing={10} mb='10'>
      <Image src={coupon.cid + "/" + coupon?.couponData?.photoName} alt='Product' />
      <div>
        <Heading fontSize='2xl'>{coupon?.couponData?.title}</Heading>
        <Text>{coupon?.couponData?.description}</Text>
        <p>{coupon?.price?.toString() / 10 ** 18} {tokenName}</p>
        <p>{coupon?.couponData?.discount} Off</p>
        <p>Expire in {getDate(coupon?.expireDate?.toString())}</p>
        <p>From {coupon.owner}</p>
        <Button colorScheme='orange' onClick={buyProduct} mt='3'>
          Buy it
        </Button>

        <Divider mt='4' mb='5' />

        <WorldIDWidget
          actionId={process.env.NEXT_PUBLIC_WORLDCOIN_ACTIONID} // obtain this from developer.worldcoin.org
          signal="my_signal"
          enableTelemetry
          onSuccess={(verificationResponse) => console.log(verificationResponse)}
          onError={(error) => console.error(error)}
        />

        <Button colorScheme='orange' onClick={buyProductWithReferrer} mt='3'>
          Buy it with Referrer
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