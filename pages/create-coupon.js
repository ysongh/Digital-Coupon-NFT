import React, { useState } from 'react';
import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_APIKEY });

function CreateCoupon({ dcContract }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(null);
  const [days, setDays] = useState("");
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
      const blob = new Blob([couponData], {type: "text/plain"});
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

      const transaction = await dcContract.createCoupon(`https://dweb.link/ipfs/${cid}`, days);
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
      <label htmlFor="title">Title</label>
      <input id="title" onChange={(e) => setTitle(e.target.value)}/>
      <br />
      <label htmlFor="description">Description</label>
      <input id="description" onChange={(e) => setDescription(e.target.value)}/>
      <br />
      <span>Choose profile photo</span>
      <input type="file" id="photo" onChange={handleUpload}/>
      <br />
      <label htmlFor="Expire Date">Number of Days for expire</label>
      <input id="Expire Date" onChange={(e) => setDays(e.target.value)}/>
      <br />
      <label htmlFor="price">Price</label>
      <input id="price" onChange={(e) => setPrice(e.target.value)}/>
      <br />
      <label htmlFor="discount">Discount</label>
      <input id="discount" onChange={(e) => setDiscount(e.target.value)}/>
      <br />
      {!loading
        ? <button onClick={handleSubmit}>
            Create
          </button>
       : <p>Loading...</p>
      }
      <p>{cid}</p>
      {transactionHash &&
          <p>
            Success, {" "}
            {transactionHash.substring(0, 10) + '...' + transactionHash.substring(56, 66)}
          </p>
        }
    </div>
  )
}

export default CreateCoupon;