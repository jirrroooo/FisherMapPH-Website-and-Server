import { useEffect, useState } from "react";
import "./style.css";
import "../../styles/custom.scss";
import Link from "next/link";
import Navbar from "../../components/navbar";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import { useApiStore } from "../../store/apiStore";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import FormattedDate from "../../components/formatted-date";

export default function FisherfolkRejectedApplications() {
  const router = useRouter();

  const [isVerified, setIsVerified] = useState(false);
  const [data, setData] = useState();
  const [isViewModal, setIsViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [isRevertModal, setIsRevertModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    fetch(`${useApiStore.getState().apiUrl}users/fisherfolk-rejected-users`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
      .then((response) => response.json())
      .then((body) => {
        setData(body);
        setIsLoading(false);
      });
  }

  function revertUser() {
    fetch(`${useApiStore.getState().apiUrl}users/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
      body: JSON.stringify({
        fishing_vessel_type: selectedUser.fishing_vessel_type,
        user_type: "user",
        isAuthenticated: false,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        window.location.reload();
      });
  }

  function deleteUser() {
    fetch(`${useApiStore.getState().apiUrl}users/${selectedUser._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
    })
      .then((response) => response.json())
      .then((body) => {
        window.location.reload();
      });
  }

  return (
    <>
      {!isLoading ? (
        <>
          <Navbar />
          <div className="container mt-4 text-center">
            <h2>Rejected Fisherfolk Account Applications</h2>
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

              {data.map((info) => {
                return (
                  <div className="row student-data" key={info._id}>
                    <div className="col-2">
                      <p>
                        {info.first_name} {info.last_name}
                      </p>
                    </div>
                    <div className="col-3">
                      <p>{info.email_address}</p>
                    </div>
                    <div className="col-2 text-capitalize">
                      {info.fishing_vessel_type}
                    </div>
                    <div className="col-2">
                      <button
                        className="btn btn-light px-4 rounded-5 fw-semibold text-black"
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
                          <button
                            className="btn btn-warning px-3 rounded-5 fw-semibold text-black"
                            onClick={() => {
                              setSelectedUser(info);
                              setIsRevertModal(!isRevertModal);
                            }}
                          >
                            Revert
                          </button>
                        </div>
                        <div className="col">
                          <button
                            className="btn btn-danger px-4 text-white rounded-5 fw-semibold "
                            onClick={() => {
                              setSelectedUser(info);
                              setIsDeleteModal(!isDeleteModal);
                            }}
                          >
                            Delete
                          </button>
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
                        ACCOUNT INFORMATION
                      </h5>
                    </div>
                    <ModalBody>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Name:</td>
                            <td>
                              {selectedUser.first_name} {selectedUser.last_name}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Email Address:</td>
                            <td>{selectedUser.email_address}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Contact Number:</td>
                            <td>{selectedUser.contact_number}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Address:</td>
                            <td>{selectedUser.address}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Birthday:</td>
                            <td>
                              <FormattedDate date={selectedUser.birthday} />
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Civil Status:</td>
                            {selectedUser.civil_status == "single" ? (
                              <td>Single</td>
                            ) : selectedUser.civil_status == "married" ? (
                              <td>Married</td>
                            ) : selectedUser.civil_status == "separated" ? (
                              <td>Separated</td>
                            ) : (
                              <td>Widowed</td>
                            )}
                          </tr>
                          <tr>
                            <td className="fw-bold">Vessel type:</td>
                            <td className="text-capitalize">
                              {selectedUser.fishing_vessel_type}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Membership Date:</td>
                            <td>
                              <FormattedDate date={selectedUser.createdAt} />
                            </td>
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

              {isRevertModal && (
                <>
                  <Modal
                    toggle={() => setIsRevertModal(!isRevertModal)}
                    isOpen={isRevertModal}
                  >
                    <div className=" modal-header">
                      <h5
                        className=" modal-title text-center m-auto fw-bold text-uppercase"
                        id="viewModal"
                      >
                        ARE YOU SURE YOU WANT TO REVERT{" "}
                        {selectedUser.first_name}'s ACCOUNT?
                      </h5>
                    </div>
                    <ModalBody>
                      <p className="text-center">
                        Reverting {selectedUser.first_name}'s account will turn
                        it to pending status. This account will be transferred
                        to the pending account list if you continue.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-warning text-black m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsRevertModal(false);
                          revertUser();
                        }}
                      >
                        Proceed Reverting
                      </Button>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsRevertModal(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              {isDeleteModal && (
                <>
                  <Modal
                    toggle={() => setIsDeleteModal(!isDeleteModal)}
                    isOpen={isDeleteModal}
                  >
                    <div className=" modal-header">
                      <h5
                        className=" modal-title text-center m-auto fw-bold text-uppercase"
                        id="viewModal"
                      >
                        ARE YOU SURE YOU WANT TO DELETE{" "}
                        {selectedUser.first_name}'s ACCOUNT?
                      </h5>
                    </div>
                    <ModalBody>
                      <p className="text-center">
                        Deleting {selectedUser.first_name}'s account will erase
                        all the account information. This action is
                        irreversible.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-danger text-white m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsDeleteModal(false);
                          deleteUser();
                        }}
                      >
                        Proceed Deleting
                      </Button>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsDeleteModal(false);
                        }}
                      >
                        Cancel
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
              <div className="col-3"></div>
              <div className="col-3">
                <Link
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={null}
                  href="/manage-accounts/fisherfolk-applications"
                >
                  Manage Pending Applications
                </Link>
              </div>
              <div className="col-3">
                <Link
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={null}
                  href="/manage-accounts/fisherfolk-accounts"
                >
                  Manage Approved Accounts
                </Link>
              </div>
              <div className="col-3"></div>
            </div>
          </div>
        </>
      ) : (
        <div className="loader m-auto mt-5"></div>
      )}
    </>
  );
}
