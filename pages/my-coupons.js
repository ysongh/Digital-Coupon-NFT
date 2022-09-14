import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { getDate } from '../utils/date';

export default function MyCoupons({ ethAddress, dcContract }) {
  const router = useRouter();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dcContract) fetchCoupons();
  }, [dcContract])

  const fetchCoupons = async () => {
    try{
      setLoading(true);

      const _counpons = await dcContract.getOwnerCoupons(ethAddress);
      console.log(_counpons);

      const temp = [];
      for (let c of _counpons) {
        const res = await fetch(c.cid + "/couponData.json");
        const couponData = await res.json();
        console.log(couponData); 
        temp.push({...c, couponData});
      }
      setCoupons(temp);

      setLoading(false);
    } catch(error) {
     console.error(error);
     setLoading(false);
    }  
  }
  
  return (
    <div>
      {loading
        ? <p>Loading...</p>
        : coupons.map(c => (
          <div key={c.tokenId.toString()}>
            <img src={c.cid + "/" + c.couponData.photoName} alt="Product" style={{ width: "200px"}} />
            <p>{c.couponData.title}</p>
            <p>${c.couponData.price}</p>
            <p>{c.couponData.discount} Off</p>
            <p>Expire in {getDate(c.expireDate.toString())}</p>
            <button onClick={() => router.push(`/coupon/${c.tokenId.toString()}`)}>
              View 
            </button>
          </div>
        ))}
    </div>
  )
}
