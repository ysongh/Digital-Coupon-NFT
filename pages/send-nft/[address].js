import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FormControl, FormLabel, Box, ButtonGroup, Spinner, Input, Heading, Text, Button, Link } from '@chakra-ui/react';
import axios from "axios";

function SendNFT() {
  const router = useRouter();
  const { address } = router.query;

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [cardURL, setCardURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionUrl, setTransactionUrl] = useState('');

  async function sendCard({  }) {
    try{
      setLoading(true);
      const options = {
        method: 'POST',
        url: 'https://api.nftport.xyz/v0/mints/easy/urls',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.NEXT_PUBLIC_NFTPORT_API
        },
        data: {
          chain: 'polygon',
          name: name,
          description: text,
          file_url: cardURL,
          mint_to_address: address
        }
      };

      axios.request(options).then(function (response) {
        console.log(response.data);
        setTransactionUrl(response.data.transaction_external_url);
        setLoading(false);
      }).catch(function (error) {
        console.error(error);
        setLoading(false);
      });
      
    } catch(error) {
       console.error(error)
       setLoading(false);
    }  
  }

  return (
    <div>
      <center>
        <Box borderWidth='1px' borderRadius='lg' borderColor='orange' overflow='hidden' p='5' width='500px' mt='5'>
          <Heading fontSize='2xl' mb='3'>Send Thank You Card</Heading>
          <p>* Free Minting on Polygon</p>
          <FormControl mb='3'>
            <FormLabel htmlFor='name'>Name</FormLabel>
            <Input id="name" onChange={(e) => setName(e.target.value)}/>
          </FormControl>
          <FormControl mb='3'>
            <FormLabel htmlFor='description'>Description</FormLabel>
            <Input id="description" onChange={(e) => setText(e.target.value)}/>
          </FormControl>
          <FormControl mb='3'>
            <FormLabel htmlFor='url'>URL of the Card</FormLabel>
            <Input id="url" onChange={(e) => setCardURL(e.target.value)}/>
          </FormControl>

          {loading
            ? <Spinner color='orange' mt='4' />
            : <ButtonGroup spacing='6' mt='4'>
                <Button colorScheme='orange' onClick={sendCard}>
                  Send
                </Button>
                <Button onClick={() => router.push('/')}>Cancel</Button>
              </ButtonGroup>
          }
          {transactionUrl &&
            <Text mt='3'>
              Success, see transaction {" "}
              <Link href={transactionUrl} target="_blank" rel="noopener noreferrer">
                  {transactionUrl}
              </Link>
            </Text>
          }
        </Box>
      </center>
    </div>
  )
}

export default SendNFT;