import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useLoginStore } from "../store/loginStore";
import { useApiStore } from "../store/apiStore";
import { useUserDataStore } from "../store/userDataStore";

export default function Navbar() {
  const [userType, setUserType] = useState();
  const [isVerified, setIsVerified] = useState();

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    fetch("/api/verify")
      .then((response) => response.json())
      .then((body) => {
        if (body.status == "success") {
          setIsVerified(true);
          useLoginStore.setState({
            isVerifiedCookie: true,
            token: body.token,
          });
          getUserId(body.token);
        } else {
          setIsVerified(false);
          useLoginStore.setState({ isVerifiedCookie: false });
          // router.push("/login");
        }
      });
    // Fetch User Data
  }, []);

  function getUserId(token){
    fetch(`${useApiStore.getState().apiUrl}auth/profile/${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        useLoginStore.setState({
          id: data.id
        });
        getData();
      });

  }

  function getData(){
    fetch(
      `${useApiStore.getState().apiUrl}users/${useLoginStore.getState().id}`,
      {
        headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const { password, ...user } = data;
          useUserDataStore.setState({ userData: user });
          setUserType(user.user_type);
        }
      });
  }

  const router = useRouter();

  function logOut() {
    useLoginStore.setState({
      isLoggedIn: false,
      token: "",
      isVerifiedCookie: false,
    });

    fetch("/api/manage-cookie", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((body) => {

        if (body.status == "success") {
          useLoginStore.setState({  isLoggedIn: false, isVerifiedCookie: false, token: "", id: ""})
          router.push("/login");
        } else {
          alert("Error Logging Out!")
        }
      });

  }

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark" style={{width:"100%"}}>
      <div className="container-fluid">
      <Link className="text-decoration-none text-white" href="/homepage">
          {router.pathname != "/login" && router.pathname != "/signup" ?
            <h4>FisherMap PH</h4> : <h4 className="text-dark">FisherMap PH</h4>}
        </Link>

        {router.pathname != "/login" && router.pathname != "/signup" && (
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              {(userType  == "superadmin") ? (
                <a
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Super Administrator
                </a>
              ) : (userType  == "admin") ? (
                <a
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Administrator
                </a>
              ) : <a 
              className="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              >Menu</a>
            }

              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" id="profile" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    id="logout"
                    className="text-decoration-none text-black px-3"
                    onClick={logOut}
                  >
                    Log Out
                  </a>
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
