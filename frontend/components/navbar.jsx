import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useLoginStore } from "../store/loginStore";
import { useApiStore } from "../store/apiStore";
import { useUserDataStore } from "../store/userDataStore";
import Image from "next/image";
import Sidebar from "./side-navigation";
import "./style.css";

export default function Navbar() {
  const [userType, setUserType] = useState();
  const [region, setRegion] = useState();
  const [isVerified, setIsVerified] = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  function getUserId(token) {
    fetch(`${useApiStore.getState().apiUrl}auth/profile/${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        useLoginStore.setState({
          id: data.id,
        });
        getData();
      });
  }

  function getData() {
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
          setRegion(user.region);
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
          useLoginStore.setState({
            isLoggedIn: false,
            isVerifiedCookie: false,
            token: "",
            id: "",
          });
          router.push("/login");
        } else {
          alert("Error Logging Out!");
        }
      });
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        userType={userType}
      />
      <nav
        className="navbar navbar-expand-sm bg-dark navbar-dark"
        style={{ width: "100%" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {router.pathname !== "/login" && router.pathname !== "/signup" && (
              <Image
                src="/images/sidenav-icon.png"
                width={15}
                height={15}
                alt="Sidebar Navigation"
                className="mb-1 mx-3"
                onClick={toggleSidebar}
              />
            )}

            <Link
              className="text-decoration-none text-white ms-2"
              href="/homepage"
            >
              {router.pathname !== "/login" && router.pathname !== "/signup" ? (
                <h4>FisherMap PH</h4>
              ) : (
                <h4 className="text-dark">FisherMap PH</h4>
              )}
            </Link>
          </div>
          {router.pathname !== "/login" && router.pathname !== "/signup" && (
            <div className="d-flex align-items-center">
              <p className="mb-0 me-3 text-white">
                {userType === "superadmin"
                  ? "Super Administrator | " + region
                  : userType === "admin"
                  ? "Administrator | " + region
                  : "Menu"}
              </p>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
