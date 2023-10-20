import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useLoginStore } from "../store/loginStore";

export default function Navbar() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  const router = useRouter();

  function logOut(){
    useLoginStore.setState({isLoggedIn : false, authToken: "" })
    router.push("/login");
  }

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
      <div className="container-fluid">
        {/* <a className="navbar-brand" href="#"> */}
          <Link className="text-decoration-none text-white" href="/homepage">
            <h4>FisherMap PH</h4>
          </Link>
        {/* </a> */}

        {router.pathname != "/login" && router.pathname != "/signup" && (
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
              >
                Super Administrator
              </a>

              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <a className="text-decoration-none text-black px-3" onClick={logOut}>Log Out</a>
                  {/* <Link className="text-decoration-none text-black px-3 " href="/signup">Log Out</Link> */}
                </li>
              </ul>
            </li>
          </ul>
        )}

      </div>
    </nav>
  );
}
