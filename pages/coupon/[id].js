import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CouponDetail({ dcContract }) {
  const router = useRouter();
  const { id } = router.query;

  const [coupon, setCoupon] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dcContract) fetchCoupon();
  }, [dcContract])

  const fetchCoupon = async () => {
    try{
      setLoading(true);

      const _counpon = await dcContract.couponList(id);
      console.log(_counpon);

      const res = await fetch(_counpon.cid + "/couponData.json");
      const couponData = await res.json();
      console.log(couponData); 

      setCoupon({..._counpon, couponData});

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
        : <div>
            <img src={coupon.cid + "/" + coupon?.couponData?.photoName} alt="Product" style={{ width: "200px"}} />
            <p>{coupon?.couponData?.title}</p>
            <p>{coupon?.couponData?.description}</p>
            <p>${coupon?.couponData?.price}</p>
            <p>{coupon?.couponData?.discount}</p>
            <p>{coupon.owner}</p>
          </div>}
    </div>
  )
}
