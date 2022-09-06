import React, { useState } from 'react';

function createCoupon() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    const image = event.target.files[0];
    console.log(image);
    setPhoto(image);
  }

  const handleSubmit = async () => {
    try{
      setLoading(true);

      console.log(title, description, photo, price, discount);

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
    </div>
  )
}

export default createCoupon;