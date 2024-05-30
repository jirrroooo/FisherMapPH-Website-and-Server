import React from "react";
import Link from "next/link";
import "./style.css";
import Image from "next/image";
import { useLoginStore } from "../store/loginStore";
import { useRouter } from "next/router";

const Sidebar = ({ isOpen, toggleSidebar, userType }) => {
  const router = useRouter();

  function logOut() {
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

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button
        className="close-btn btn btn-close btn-close-white mt-0"
        onClick={toggleSidebar}
      />

      <div className="text-center mt-0">
        <Image src="/images/FisherMapPH.png" width={150} height={150} />
        <h4 className="text-white fw-bold">FisherMap PH</h4>
      </div>

      <hr className="horizontal-line" />

      <ul className="sidebar-nav">
        <Link href="/homepage" className="link">
          Homepage
        </Link>

        {userType == "superadmin" && (
          <>
            <Link href="/manage-accounts/admin-accounts" className="link">
              Manage Admin Accounts
            </Link>
            <Link href="/manage-accounts/admin-applications" className="link">
              Manage Admin Account Applications
            </Link>
          </>
        )}

        <Link href="/manage-accounts/fisherfolk-accounts" className="link">
          Manage Fisherfolk Accounts
        </Link>
        <Link href="/manage-accounts/fisherfolk-applications" className="link">
          Manage Fisherfolk Account Applications
        </Link>
        <Link href="/manage-alerts" className="link">
          Manage Alerts
        </Link>
        <Link href="/manage-distress-calls" className="link">
          Manage Distress Calls
        </Link>

        <Link href="/map" className="link">
          View Sea Map
        </Link>
        <Link href="/map" className="link">
          View Profile
        </Link>
        <hr className="horizontal-line" />
        <Link href="#" onClick={logOut} className="link">
          Logout
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
