import React from 'react';
import { Box, Flex, Center, Image, Text } from '@chakra-ui/react';

function ChainCard({ r }) {
  return (
    <Box overflow='hidden' p='4'>
      <Flex>
        <Center>
          <Text fontSize='2xl'>{r.count} NFTs Minted on</Text>
        </Center>
        <Image src={r.image} alt="Logo" ml='3' style={{ width: "50px", cursor: "pointer" }}/>
      </Flex>
    </Box>
  )
}

export default ChainCard;