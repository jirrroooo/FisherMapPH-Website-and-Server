import Image from 'next/image'
import React from 'react'

export default function LoadingPage() {
  return (
    <div className="m-auto mt-5 text-center mt-5">
    <Image
      src="/images/fisherman.gif"
      width={550}
      height={350}
      alt="..."
    />
    <h3 className="text-center" style={{ marginTop: "10px" }}>
      FisherMap Loading...
    </h3>
  </div>
  );
}
