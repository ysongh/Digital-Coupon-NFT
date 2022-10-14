import React from 'react';
import { Center, CircularProgress } from '@chakra-ui/react';

function Spinner() {
  return (
    <Center mt='10'>
      <CircularProgress isIndeterminate color='orange' size='200px' />
    </Center>
  )
}

export default Spinner;