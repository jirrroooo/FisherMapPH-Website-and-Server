import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <>
        <div className="text-center" style={{ marginTop: "100px" }}>
      <Image src="/images/error.jpg" width={550} height={350} alt="..." />
      <h2 className="text-center fw-bold" style={{ marginTop: "30px" }}>
        ERROR 404 | PAGE NOT FOUND
      </h2>
      <p className="fw-bold mt-4"><Link href="/">GO BACK</Link></p>
    </div>
    </>

  );
}
