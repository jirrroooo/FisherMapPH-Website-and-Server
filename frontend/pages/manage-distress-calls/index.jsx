import { useEffect, useState } from "react";
import "./style.css";
import "../../styles/custom.scss";
import Link from "next/link";
import Navbar from "../../components/navbar";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import { useApiStore } from "../../store/apiStore";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import FormattedDate, {
  FormattedDateTime,
} from "../../components/formatted-date";
import ListFormat from "../../components/list";

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

              {data.map((info) => {
                return (
                  <div className="row student-data mb-3">
                    <div className="col-2">
                      {info.report.status == "no_response" && (
                        <p className="text-uppercase ">
                          {info.report.type}{" "}
                          <span className="badge bg-danger">ASAP</span>
                        </p>
                      )}

                      {info.report.status == "forwarded" && (
                        <p className="text-uppercase ">
                          {info.report.type}{" "}
                          <span className="badge bg-warning text-black">
                            FWD
                          </span>
                        </p>
                      )}

                      {info.report.status == "responded" && (
                        <p className="text-uppercase ">
                          {info.report.type}{" "}
                          <span className="badge bg-success text-white">
                            OK
                          </span>
                        </p>
                      )}

                      {info.report.status == "archive" && (
                        <p className="text-uppercase ">
                          {info.report.type}{" "}
                          <span className="badge bg-light text-black">
                            ARCH
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="col-3">
                      <p>{info.report.content}</p>
                    </div>
                    <div className="col-2">
                      <p className="text-capitalize">
                        {info.userInfo.fishing_vessel_type}
                      </p>
                      <p></p>
                    </div>
                    <div className="col-2">
                      <button
                        className="btn btn-success px-4 rounded-5 fw-semibold text-white"
                        onClick={() => {
                          setSelectedUser(info);
                          setIsViewModal(true);
                        }}
                      >
                        View
                      </button>
                    </div>
                    <div className="col-3">
                      <div className="row">
                        <div className="col">
                          {info.report.status == "responded" ? (
                            <button
                              className="btn btn-light px-3 rounded-5 fw-semibold"
                              disabled
                            >
                              Responded
                            </button>
                          ) : info.report.status == "archive" ? (
                            <button
                              className="btn btn-light px-3 rounded-5 fw-semibold"
                              disabled
                            >
                              Archived
                            </button>
                          ) : (
                            <button className="btn btn-secondary px-3 rounded-5 fw-semibold">
                              Respond
                            </button>
                          )}
                        </div>

                        <div className="col">
                          {info.report.status == "archive" ? (
                            <button className="btn btn-light px-4 text-black rounded-5 fw-semibold ">
                              Unarchive
                            </button>
                          ) : (
                            <button className="btn btn-danger px-4 text-white rounded-5 fw-semibold ">
                              Archive
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isViewModal && (
                <>
                  <Modal
                    toggle={() => setIsViewModal(!isViewModal)}
                    isOpen={isViewModal}
                  >
                    <div className=" modal-header">
                      <h5
                        className=" modal-title text-center m-auto fw-bold"
                        id="viewModal"
                      >
                        DISTRESS CALL INFORMATION
                      </h5>
                    </div>
                    <ModalBody>
                      <table className="table">
                        <tbody>

                          <tr>
                            <td className="fw-bold">Date and Time:</td>
                            <td>
                              <FormattedDateTime
                                date={selectedUser.report.createdAt}
                              />
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-bold">Type:</td>
                            <td>{selectedUser.report.type}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Message:</td>
                            <td>{selectedUser.report.content}</td>
                          </tr>

                          {selectedUser.report.status == "no_response" && (
                            <tr>
                              <td className="fw-bold">Status:</td>
                              <td>Not Responded Yet</td>
                            </tr>
                          )}

                          {selectedUser.report.status != "no_response" && (
                            <tr>
                              <td className="fw-bold">Status:</td>
                              <td className="text-capitalize">
                                {selectedUser.report.status}
                              </td>
                            </tr>
                          )}

                          <tr>
                            <td className="fw-bold">Location:</td>
                            <td>
                              ({selectedUser.positionInfo.longitude},{" "}
                              {selectedUser.positionInfo.longitude})
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-bold">Fishing Vessel Type:</td>
                            <td className="text-capitalize">
                              {selectedUser.userInfo.fishing_vessel_type}
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-bold">Sea Depth</td>
                            <td>{selectedUser.positionInfo.sea_depth}</td>
                          </tr>

                          <tr>
                            <td className="fw-bold">Fisherfolk Name:</td>
                            <td className="text-capitalize">
                              {selectedUser.userInfo.first_name}{" "}
                              {selectedUser.userInfo.last_name}
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-bold">Contact Number:</td>
                            <td>{selectedUser.userInfo.contact_number}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Person to Notify: </td>
                            <td>{selectedUser.userInfo.person_to_notify}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Address:</td>
                            <td>{selectedUser.userInfo.address}</td>
                          </tr>
                        </tbody>
                      </table>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-light m-auto px-5"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsViewModal(false);
                        }}
                      >
                        Back
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

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
