import Head from 'next/head';
import Link from 'next/link';
import UAuth from '@uauth/js';

const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_UNSTOPPABLEDOMAINS_CLIENTID,
  redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLEDOMAINS_REDIRECT_URI,
  scope: "openid wallet"
});

function Navbar({ setDomainData }) {
  const loginWithUnstoppableDomains = async () => {
    try {
      const authorization = await uauth.loginWithPopup();
      authorization.sub = authorization.idToken.sub;
      console.log(authorization);

      setDomainData(authorization);
      connectWallet();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
       <Head>
        <title>Digital Coupon NFT</title>
        <meta name="description" content="Digital Coupon NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/">
        Home
      </Link>
      <Link href="/create-coupon">
        Create Coupon
      </Link>
      <button onClick={loginWithUnstoppableDomains}>
        Login with Unstoppable
      </button>
      <br />
      <br />
    </div>
  )
}

export default Navbar;