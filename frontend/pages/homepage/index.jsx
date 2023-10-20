import Navbar from "/components/navbar";
import "./style.css";
import "../../styles/custom.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import { useApiStore } from "/store/apiStore";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

export default function Homepage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(useLoginStore.getState().isVerifiedCookie);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    console.log(useLoginStore.getState().token);

    // Verify the the cookie
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
      { isVerified ? (
        <>
          <Navbar />
          <div className="container mt-4 text-center">
            <h2>WELCOME SUPER ADMINISTRATOR!</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi
              voluptas, dolore, similique velit rerum neque minima delectus illo
              consequatur sequi id ad laborum error nesciunt dicta quasi
              molestiae aspernatur incidunt!
            </p>
            <div className="row mt-4">
              <div className="col-6 container-fluid">
                <div className="row mt-2">
                  <div className="col-6">
                    <div className="card" style={{ width: "16rem" }}>
                      <div className="card-body">
                        <h1>143</h1>
                        <p>Pending Fisherfolk Accounts</p>
                        <Link
                          className="btn btn-warning admin-btn"
                          href="/manage-accounts/fisherfolk-applications"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="card" style={{ width: "16rem" }}>
                      <div className="card-body">
                        <h1>32</h1>
                        <p>Pending Admin Accounts</p>
                        <Link
                          className="btn btn-warning admin-btn"
                          href="/manage-accounts/admin-applications"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-3 ">
                  <div className="col-6">
                    <div className="card" style={{ width: "16rem" }}>
                      <div className="card-body">
                        <h1>60</h1>
                        <p>Current Active Alerts</p>
                        <Link
                          className="btn btn-warning admin-btn"
                          href="/manage-alerts"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="card" style={{ width: "16rem" }}>
                      <div className="card-body">
                        <h1>2</h1>
                        <p>Distress Call Logs</p>
                        <Link
                          className="btn btn-warning admin-btn"
                          href="/manage-distress-calls"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 container">
                <div className="row mt-1">
                  <div className="col-6">
                    <Image
                      src="/images/1.jpg"
                      width={550}
                      height={350}
                      alt="..."
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    className="btn btn-secondary px-4 py-2 fw-bold"
                    onClick={null}
                  >
                    View Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="loader text-center m-auto m-5"></div>
      )
      
      }
    </>
  );
}
