import React from 'react';
import { Box, Flex, Center, Image, Text } from '@chakra-ui/react';

function ChainCard({ r }) {
  return (
    <Box overflow='hidden' p='4'>
      <Flex>
        <Center>
          <Text fontSize='2xl' mb='0'>{r.count} NFTs Minted</Text>
        </Center>
        <Image src={r.image} alt="Logo" ml='2' style={{ width: "40px", cursor: "pointer" }}/>
      </Flex>
    </Box>
  )
}

export default ChainCard;