import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Web3Storage } from 'web3.storage';
import { FormControl, FormLabel, Box, ButtonGroup, Spinner, Input, Textarea, Heading, Button } from '@chakra-ui/react';

const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_APIKEY });

function CreateCoupon({ tokenName, dcContract }) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(null);
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');

  const handleUpload = async (event) => {
    const image = event.target.files[0];
    console.log(image);
    setPhoto(image);
  }

  const handleSubmit = async () => {
    try{
      setLoading(true);

      console.log(title, description, photo, price, discount);
      const couponData = JSON.stringify({ title, description, photoName: photo.name, price, discount });
      const blob = new Blob([couponData], {type: 'text/plain'});
      const couponDataFile = new File([ blob ], 'couponData.json');

      const cid = await client.put([couponDataFile, photo], {
        onRootCidReady: localCid => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `)
          console.log('> 📡 sending files to web3.storage ')
        },
        onStoredChunk: bytes => console.log(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`)
      })

      console.log(`https://dweb.link/ipfs/${cid}`);
      setCid(`https://dweb.link/ipfs/${cid}`);

      const priceToETH = +price * 10 ** 18;
      const transaction = await dcContract.createCoupon(`https://dweb.link/ipfs/${cid}`, days, priceToETH.toString(), discount);
      const tx = await transaction.wait();
      console.log(tx);
      setTransactionHash(tx.transactionHash);

      setLoading(false);
    } catch(error) {
     console.error(error);
     setLoading(false);
    }  
  }

  return (
    <div>
      <center>
        <Box borderWidth='1px' borderRadius='lg' borderColor='orange' overflow='hidden' p='5' width='500px' mt='5'>
          <Heading fontSize='2xl' mb='3'>Create Coupon</Heading>
          <FormControl mb='3'>
            <FormLabel htmlFor='title'>Title</FormLabel>
            <Input id='title' onChange={(e) => setTitle(e.target.value)}/>
          </FormControl>
          <FormControl mb='3'>
            <FormLabel htmlFor='description'>Description</FormLabel>
            <Textarea id='description' onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <FormControl mb='3'>
            <FormLabel htmlFor='description'>Choose Photo</FormLabel>
            <input type='file' id='photo' onChange={handleUpload}/>
          </FormControl>
          <FormControl mb='3'>
            <FormLabel htmlFor='Expire Date'>Number of Days for expire</FormLabel>
            <Input id='Expire Date' onChange={(e) => setDays(e.target.value)}/>
          </FormControl>
          <FormControl mb='3'>
            <FormLabel htmlFor='price'>Price (In {tokenName})</FormLabel>
            <Input id='price' onChange={(e) => setPrice(e.target.value)}/>
          </FormControl>
          <FormControl mb='5'>
            <FormLabel htmlFor='discount'>Reward for Referrer (In %)</FormLabel>
            <Input id='discount' onChange={(e) => setDiscount(e.target.value)}/>
          </FormControl>

          {loading
            ? <Spinner color='orange' mt='4' />
            : <ButtonGroup spacing='6' mt='4'>
                <Button colorScheme='orange' onClick={handleSubmit}>
                  Create
                </Button>
                <Button onClick={() => router.push('/')}>Cancel</Button>
              </ButtonGroup>
          }
          <br />
          <br />
          <p>{cid}</p>
          {transactionHash &&
            <p>
              Success, {' '}
              {transactionHash.substring(0, 10) + '...' + transactionHash.substring(56, 66)}
            </p>
          }
        </Box>
      </center>
    </div>
  )
}

export default CreateCoupon;