import { useEffect } from "react";
import "./style.css";
import "../../styles/custom.scss";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function FisherfolkAccount(){
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
      }, []);
    
    return(
        <>
        <Navbar />
        <div className="container mt-4 text-center">
          <h2>Fisherfolk Accounts</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque iusto
            ipsam maxime nostrum commodi dolorum quisquam ex nam repudiandae
            tenetur quia, minima vero odio totam at sint assumenda, excepturi
            consequatur.
          </p>
  
          <form className="my-5">
            <div className="row">
              <div className="col-6">
                <input
                  type="text"
                  className="form-control student-input"
                  placeholder="Enter Name"
                  name="student"
                />
              </div>
  
              <div className="col-2">
                <div className="dropdown">
                  <button
                    type="button"
                    className="btn btn-light dropdown-toggle px-5 fw-bold "
                    data-bs-toggle="dropdown"
                  >
                    Search by
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#" onClick={null}>
                        Name
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={null}>
                        Vessel Type
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={null}>
                        Location
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
  
              <div className="col-2">
                <div className="dropdown">
                  <button
                    type="button"
                    className="btn btn-light dropdown-toggle px-5 fw-bold"
                    data-bs-toggle="dropdown"
                  >
                    Sort by
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#" onClick={null}>
                        Ascending Alphabetical
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={null}>
                        Descending Alphabetical
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
  
              <div className="col-2">
                <button
                  type="button"
                  className="btn btn-primary px-5 fw-bold"
                  onClick={null}
                >
                  Search
                </button>
              </div>
            </div>
          </form>
  
          <div className="card mt-3 p-2">
            <div className="row">
              <div className="col-2">
                <h6>Name</h6>
              </div>
              <div className="col-3">
                <h6>Email</h6>
              </div>
              <div className="col-2">
                <h6>Vessel Type</h6>
              </div>
              <div className="col-2">
                <h6>Details</h6>
              </div>
              <div className="col-3">
                <h6>Action</h6>
              </div>
            </div>
            <br />
  
            <div className="row student-data">
              <div className="col-2">
                <p>John Rommel Octavo</p>
              </div>
              <div className="col-3">
                <p>jboctavo@up.edu.ph</p>
              </div>
              <div className="col-2">
                <p>Small</p>
              </div>
              <div className="col-2">
                <button className="btn btn-success px-4 rounded-5 fw-semibold text-white">View</button>
              </div>
              <div className="col-3">
                <div className="row">
                  <div className="col">
                    <button className="btn btn-light px-3 rounded-5 fw-semibold">Suspend</button>
                  </div>
                  <div className="col">
                    <button className="btn btn-light px-4 text-black rounded-5 fw-semibold ">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <ul className="pagination m-auto mt-5">
              <li className="page-item">
                <a className="page-link disabled" href="#">
                  Previous
                </a>
              </li>
              <li className="page-item">
                <a className="page-link text-white pg-active" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link disabled " href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link disabled" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link disabled" href="#">
                  Next
                </a>
              </li>
            </ul>
          </div>
  
          <div className="row">
            <div className="col-3"></div>
            <div className="col-3">
              <button
                type="button"
                className="btn btn-primary mt-5"
                onClick={null}
              >
                Create New Account
              </button>
            </div>
            <div className="col-3">
              <Link
                type="button"
                className="btn btn-primary mt-5"
                onClick={null}
                href="/manage-accounts/fisherfolk-applications"
              >
                Pending Accounts
              </Link>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </>
    );
}