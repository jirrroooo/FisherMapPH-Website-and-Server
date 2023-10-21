// import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import { useEffect, useState } from "react";
import "../styles/custom.scss";
import { useRouter } from "next/router";
import { useLoginStore } from "../store/loginStore";

export default function Index() {
  const router = useRouter();

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    fetch("/api/verify")
    .then(response => response.json())
    .then(body => {
        console.log(body);
        if(body.status == "success"){
          setIsVerified(true);
          useLoginStore.setState({isVerifiedCookie: true, token: body.token, id: body.id});
          router.push('/homepage')
        }
        else{
          setIsVerified(false);
          useLoginStore.setState({isVerifiedCookie: false});
          router.push("/login");
        }
    })
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
