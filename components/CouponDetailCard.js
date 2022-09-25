import React from 'react';
import dynamic from 'next/dynamic';
import { SimpleGrid, Image, Heading, Divider, Button, Text } from '@chakra-ui/react';
import { WidgetProps } from "@worldcoin/id";

import { getDate } from '../utils/date';

const WorldIDWidget = dynamic(
  () => import("@worldcoin/id").then((mod) => mod.WorldIDWidget),
  { ssr: false }
);

function CouponDetailCard({ tokenName, coupon, address, buyProduct, buyProductWithReferrer }) {
  return (
    <SimpleGrid minChildWidth='300px' columns={[4]} spacing={10} mb='5'>
      <Image src={coupon.cid + "/" + coupon?.couponData?.photoName} alt='Product' bg='#fff7e6' h='400' w='full' style={{ objectFit: 'contain' }} />
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

        {/* {address !== "0" && <>
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
        </>} */}
        <Divider mt='4' mb='2' />
        <Button colorScheme='orange' onClick={buyProductWithReferrer} mt='3'>
          Buy it with Referrer
        </Button>
      </div>
    </SimpleGrid>
  )
}

export default CouponDetailCard;