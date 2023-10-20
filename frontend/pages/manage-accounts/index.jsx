import { useEffect, useState } from "react";
import "./style.css";
import "../../styles/custom.scss";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";

export default function ManageAccounts() {
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
      {isVerified ? (
        <>
          <div>Hello World!</div>
        </>
      ) : (
        <div className="loader m-auto mt-5"></div>
      )}
    </>
  );
}
