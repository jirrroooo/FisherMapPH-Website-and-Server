import { useEffect, useState } from "react";
import "./style.css";
import "../../styles/custom.scss";
import Link from "next/link";
import Navbar from "../../components/navbar";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import { useApiStore } from "../../store/apiStore";

export default function ManageDistressCalls() {
  const router = useRouter();

  const [isVerified, setIsVerified] = useState(false);
  const [data, setData] = useState();
  const [isViewModal, setIsViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [isRevertModal, setIsRevertModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    fetch("/api/verify")
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        if (body.status == "success") {
          setIsVerified(true);
          useLoginStore.setState({
            isVerifiedCookie: true,
            token: body.token,
          });
          getUserId(body.id);
        } else {
          setIsVerified(false);
          useLoginStore.setState({ isVerifiedCookie: false });
          router.push("/login");
        }
      });
  }, []);

  function getUserId(token) {
    fetch(`http://localhost:3001/auth/profile/${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          useLoginStore.setState({
            id: data.id,
          });
          getData();
        }
      });
  }

  function getData() {
    fetch(`${useApiStore.getState().apiUrl}reports`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        setData(body);
        setIsLoading(false);
      });
  }

  return (
    <>
      {!isLoading ? (
        <>
          <Navbar />
          <div className="container mt-4 text-center">
            <h2>Manage Distress Call Logs</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque
              iusto ipsam maxime nostrum commodi dolorum quisquam ex nam
              repudiandae tenetur quia, minima vero odio totam at sint
              assumenda, excepturi consequatur.
            </p>

            <form className="my-5">
              <div className="row">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    name="seach"
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
                  <h6>Type</h6>
                </div>
                <div className="col-3">
                  <h6>Message</h6>
                </div>
                <div className="col-2">
                  <h6>Location</h6>
                </div>
                <div className="col-2">
                  <h6>Details</h6>
                </div>
                <div className="col-3">
                  <h6>Action</h6>
                </div>
              </div>
              <br />

              {data.map((info) => {
                return (
                  <div className="row student-data mb-3">
                    <div className="col-2">
                      <p className="text-uppercase ">
                        {info.type}{" "}
                        <span className="badge bg-success text-white">OK</span>
                        <span className="badge bg-warning text-black">FWD</span>
                        <span className="badge bg-danger">ASAP</span>
                      </p>
                    </div>
                    <div className="col-3">
                      <p>{info.content}</p>
                    </div>
                    <div className="col-2">
                      <p>150 km West of Palawan</p>
                    </div>
                    <div className="col-2">
                      <button className="btn btn-success px-4 rounded-5 fw-semibold text-white">
                        View
                      </button>
                    </div>
                    <div className="col-3">
                      <div className="row">
                        <div className="col">
                          <button className="btn btn-light px-3 rounded-5 fw-semibold">
                            Respond
                          </button>
                        </div>
                        <div className="col">
                          <button className="btn btn-danger px-4 text-white rounded-5 fw-semibold ">
                            Archive
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

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
              <div className="col-4"></div>
              <div className="col-2">
                <Link
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={null}
                  href="#"
                >
                  View Sea Map
                </Link>
              </div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={null}
                >
                  Send All Data
                </button>
              </div>
              <div className="col-4"></div>
            </div>
          </div>
        </>
      ) : (
        <div className="loader m-auto mt-5"></div>
      )}
    </>
  );
}
