import Navbar from "@/components/navbar";
import "./style.css";
import "../styles/custom.scss";
import { useEffect } from "react";
import AdminCarousel from "@/components/admin-carousel";
import Link from "next/link";

export default function Homepage() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4 ">
        <div className="row">
          <div className="col-sm-4">
            <div className="text-center">
              <h5>Register an Administrator Account</h5>
              <form action="" id="signupForm">
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
                  placeholder="Enter Address"
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
                <input
                  type="text"
                  className="form-control"
                  id="civilStatus"
                  name="civilStatus"
                  placeholder="Civil Status"
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
                >
                  CREATE AN ACCOUNT
                </button>
              </form>
              <p>
                Already have an aacount? Login <Link href="/login">here</Link>.
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
