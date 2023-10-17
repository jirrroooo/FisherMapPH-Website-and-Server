// import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import { useEffect } from "react";
import "../styles/custom.scss";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    router.push('login');
  }, []);

  return (
    <>
      <div className="m-auto mt-5">
        <h1 className="text-center" style={{marginTop: '150px'}}>FisherMap PH</h1>
      </div>
      <div className="loader m-auto mt-5"></div>
    </>
  );
}
