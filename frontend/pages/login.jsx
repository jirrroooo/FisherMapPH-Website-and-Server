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
      <div className="container mt-4">
        <div className="row">
          <div className="col-sm-6">
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
                >
                  LOGIN
                </button>
              </form>
              <p>
                No account yet? Signup <Link href="/signup">here</Link>.
              </p>
            </div>
          </div>
          <div className="col-sm-6">
            <AdminCarousel />
          </div>
        </div>
      </div>
    </>
  );
}
