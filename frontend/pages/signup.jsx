import Navbar from "../components/navbar";
import "./style.css";
import "../styles/custom.scss";
import { useEffect, useState } from "react";
import AdminCarousel from "../components/admin-carousel";
import Link from "next/link";
import { useLoginStore } from "../store/loginStore";
import { useRouter } from "next/router";
import { useApiStore } from "../store/apiStore";

export default function Homepage() {
  const [isVerified, setIsVerified] = useState(true);

  const router = useRouter();

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    // Verify the the cookie
    fetch("/api/verify")
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        if (body.status == "success") {
          setIsVerified(true);
          useLoginStore.setState({ isLoggedIn: true, token: body.token });
          router.push("/homepage");
        } else {
          setIsVerified(false);
        }
      });
  }, []);

  function signup(e) {
    e.preventDefault();
    fetch(`${useApiStore.getState().apiUrl}auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: document.getElementById("fname").value,
        last_name: document.getElementById("lname").value,
        email_address: document.getElementById("email").value,
        password: document.getElementById("password").value,
        profile_picture: null,
        contact_number: document.getElementById("contact").value,
        address: document.getElementById("address").value,
        birthday: document.getElementById("bday").value,
        civil_status: document.getElementById("civilStatus").value,
        user_type: "admin",
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);

        if (body.status == "success") {
          alert("Signup Successful! Your account will be reviewed for approval.");
          document.getElementById("fname").value = '';
          document.getElementById("lname").value = '';
          document.getElementById("email").value = '';
          document.getElementById("bday").value = '';
          document.getElementById("contact").value = '';
          document.getElementById("address").value = '';
          document.getElementById("civilStatus").value = 'Please Select';
          document.getElementById("password").value = '';
        } else {
          useLoginStore.setState({ isVerifiedCookie: false });
          alert("Signing up unsuccessful");
        }
      });
  }

  return (
    <>
      {isVerified ? (
        <div className="loader text-center m-auto m-5"></div>
      ) : (
        <>
          <Navbar />
          <div className="container mt-4 ">
            <div className="row">
              <div className="col-sm-4">
                <div className="text-center">
                  <h5>Register an Administrator Account</h5>
                  <form id="signupForm">
                    <input
                      type="text"
                      className="form-control"
                      id="fname"
                      name="fname"
                      placeholder="First Name"
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      id="lname"
                      name="lname"
                      placeholder="Last Name"
                      required
                    />
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter Email Address"
                      required
                    />
                    <label className="text-start mb-2 fst-italic" name="bday">
                      Please Enter your Birthday
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="bday"
                      name="bday"
                      placeholder="Birthday"
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      id="contact"
                      name="contact"
                      placeholder="Contact Number"
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      placeholder="Complete Address"
                      required
                    />
                    <label htmlFor="civilStatus" className="label mb-2 fst-italic pb-2 px-3">
                      Civil Status
                    </label>
                    <select id="civilStatus" name="civilStatus" className="px-5 py-2 border-1">
                      <option value="single" className="text-center" selected>
                        Single
                      </option>
                      <option value="married" className="text-center" >Married</option>
                      <option value="widowed" className="text-center" >Widowed</option>
                      <option value="separated" className="text-center" >Legally Separated</option>
                    </select>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                    />

                    <button
                      // type="submit"
                      className="btn btn-primary"
                      id="submitBtn"
                      onClick={signup}
                    >
                      CREATE AN ACCOUNT
                    </button>
                  </form>
                  <p>
                    Already have an aacount? Login{" "}
                    <Link href="/login">here</Link>.
                  </p>
                </div>
              </div>
              <div className="col-sm-8">
                <AdminCarousel />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
