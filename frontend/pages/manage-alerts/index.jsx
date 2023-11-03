import { useEffect, useState } from "react";
import "./style.css";
import "../../styles/custom.scss";
import Navbar from "../../components/navbar";
import Link from "next/link";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import { useApiStore } from "../../store/apiStore";

export default function ManageAlerts() {
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

  
  function getUserId(token){
    fetch(`http://localhost:3001/auth/profile/${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if(data){
          useLoginStore.setState({
            id: data.id
          });
          getData();
        }
      });
  }

  function getData(){
    fetch(`${useApiStore.getState().apiUrl}users/admin-rejected-users`, {
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
      {isVerified ? (
        <>
          <Navbar />
          <div className="container mt-4 text-center">
            <h2>Manage Active Alerts</h2>
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
                  <h6>Title</h6>
                </div>
                <div className="col-3">
                  <h6>Description</h6>
                </div>
                <div className="col-2">
                  <h6>Level</h6>
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
                  <p>Hazard Alert</p>
                </div>
                <div className="col-3">
                  <p>Pioduran Town Municipal Water</p>
                </div>
                <div className="col-2">
                  <p>Low</p>
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
                        Suspend
                      </button>
                    </div>
                    <div className="col">
                      <button className="btn btn-danger px-4 text-white rounded-5 fw-semibold ">
                        Delete
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
              <div className="col-4"></div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={null}
                >
                  Create New Alerts
                </button>
              </div>
              <div className="col-2">
                <Link
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={null}
                  href="/manage-distress-calls"
                >
                  Distress Call Logs
                </Link>
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
