"use client";
import Navbar from "../components/navbar";
import "./style.css";
import "../styles/custom.scss";
import { useEffect, useState } from "react";
import AdminCarousel from "../components/admin-carousel";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLoginStore } from "../store/loginStore";
import { useApiStore } from "../store/apiStore";

export default function Homepage() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(
    useLoginStore.getState().isLoggedIn
  );

  const router = useRouter();

  useEffect(() => {
    useLoginStore.setState({ isLoggedIn: isLoggedIn });

    if (useLoginStore.getState().isLoggedIn) {
      router.push("/homepage");
    }
  }, [isLoggedIn]);

  // Set cookie for token
  function setCookie(){
    fetch("/api/manage-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: useLoginStore.getState().token,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);

        if (body.status == "success") {
          console.log("status is success");
          useLoginStore.setState({ isVerifiedCookie: true });
        } else {
          console.log("status is not success");
          useLoginStore.setState({ isVerifiedCookie: false });
          // router.push("/login");
        }
      });
  }

  function logIn(e) {
    e.preventDefault();

    console.log(document.getElementById("email").value);
    console.log(document.getElementById("password").value);

    fetch(`${useApiStore.getState().apiUrl}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.token) {
          setIsLoggedIn(true);
          useLoginStore.setState({ token: body.token });
          setCookie();
        } else {
          alert("Unsuccessful Login Try Again.");
        }
      });
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-sm-4">
            <div className="text-center loginForm">
              <h5>Register an Administrator Account</h5>
              <form action="" id="signupForm">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter Address"
                  required
                />
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  id="submitBtn"
                  onClick={logIn}
                >
                  LOGIN
                </button>
              </form>
              <p>
                No account yet? Signup <Link href="/signup">here</Link>.
              </p>
            </div>
          </div>
          <div className="col-sm-8">
            <AdminCarousel />
          </div>
        </div>
      </div>
    </>
  );
}
