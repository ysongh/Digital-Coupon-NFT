import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';

function MyApp({ Component, pageProps }) {
  const [domainData, setDomainData] = useState(null);

  return (
    <div>
      <Navbar
        domainData={domainData}
        setDomainData={setDomainData} />
      <Component
        {...pageProps}
        domainData={domainData} />
    </div>
  )
}

export default MyApp;
