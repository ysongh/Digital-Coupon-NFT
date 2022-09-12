import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CouponDetail({ userSigner, dcContract, sfMethods }) {
  const router = useRouter();
  const { id } = router.query;

  const [coupon, setCoupon] = useState({});
  const [showSFLink, setShowSFLink] = useState(false);
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

  const streamDai = async () => {
    try {
      const DAIxContract = await sfMethods.loadSuperToken("fDAIx");
      const DAIx = DAIxContract.address;
      console.log(DAIx);

      const createFlowOperation = sfMethods.cfaV1.createFlow({
        receiver: coupon.owner,
        flowRate: "1",
        superToken: DAIx,
      });

      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(userSigner);
      console.log(result);
      setShowSFLink(true);
    } catch (error) {
      console.error(error);
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
            <p>{coupon?.couponData?.discount} Off</p>
            <p>Expire in {coupon?.expireDate?.toString()}</p>
            <p>From {coupon.owner}</p>
          </div>}
      <button onClick={streamDai}>
       Stream DAI
      </button>
      <button onClick={() => router.push(`/chat/${coupon.owner}`)}>
        Chat 
      </button>
      {showSFLink && <a href={`https://app.superfluid.finance/`} target="_blank" rel="noopener noreferrer">
        View Dashboard
      </a>}
    </div>
  )
}
