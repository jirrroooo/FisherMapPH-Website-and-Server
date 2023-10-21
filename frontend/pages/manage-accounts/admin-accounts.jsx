"use client";
import { useEffect, useState } from "react";
import "./style.css";
import "../../styles/custom.scss";
import Link from "next/link";
import Navbar from "../../components/navbar";
import { useLoginStore } from "../../store/loginStore";
import Router, { useRouter } from "next/router";
import { useApiStore } from "../../store/apiStore";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import FormattedDate from "../../components/formatted-date";

export default function AdminAccounts() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModal, setIsViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [isEditModal, setIsEditModal] = useState(false);
  const [isSuspendModal, setIsSuspendModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);

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
            id: body.id,
          });
          getData();
        } else {
          setIsVerified(false);
          useLoginStore.setState({ isVerifiedCookie: false });
          router.push("/login");
        }
      });
  }, []);

  async function getData() {
    await fetch(`${useApiStore.getState().apiUrl}users/admin-users`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        setData(body);
        setIsLoading(false);
      });
  }

  function fetchDate(date) {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = yyyy + "-" + mm + "-" + dd;

    console.log(formattedToday);

    return formattedToday;
  }

  function editUser() {
    fetch(`${useApiStore.getState().apiUrl}users/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
      body: JSON.stringify({
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email_address: document.getElementById("email_address").value,
        contact_number: document.getElementById("contact_number").value,
        address: document.getElementById("address").value,
        birthday: document.getElementById("birthday").value,
        civil_status: document.getElementById("civil_status").value,
        user_type: document.getElementById("user_type").value,
        isAuthenticated: selectedUser.isAuthenticated,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        // alert("Edit Successful!");
        // router.refresh();
        window.location.reload();
      });
  }

  function createAccount() {
    fetch(`${useApiStore.getState().apiUrl}auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: document.getElementById("c_first_name").value,
        last_name: document.getElementById("c_last_name").value,
        email_address: document.getElementById("c_email_address").value,
        contact_number: document.getElementById("c_contact_number").value,
        address: document.getElementById("c_address").value,
        birthday: document.getElementById("c_birthday").value,
        password: document.getElementById("c_password").value,
        civil_status: document.getElementById("c_civil_status").value,
        user_type: document.getElementById("c_user_type").value,
        isAuthenticated: true,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        // alert("Edit Successful!");
        // router.refresh();
        window.location.reload();
      });
  }

  function suspendUser() {
    fetch(`${useApiStore.getState().apiUrl}users/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
      body: JSON.stringify({
        isAuthenticated: false,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        window.location.reload();
      });
  }

  return (
    <>
      {!isLoading ? (
        <>
          <Navbar />
          <div className="container mt-4 text-center">
            <h2>Administrator Accounts</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque
              iusto ipsam maxime nostrum commodi dolorum quisquam ex nam
              repudiandae tenetur quia, minima vero odio totam at sint
              assumenda, excepturi consequatur.
            </p>

            <form className="my-4">
              <div className="row">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    name="search"
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
                          Email Address
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#" onClick={null}>
                          Application Date
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
                  <h6>Email Address</h6>
                </div>
                <div className="col-2">
                  <h6>Type</h6>
                </div>
                <div className="col-2">
                  <h6>Details</h6>
                </div>
                <div className="col-3">
                  <h6>Action</h6>
                </div>
              </div>
              <br />

              {data.map((info, i) => {
                if (info._id != useLoginStore.getState().id) {
                  return (
                    <>
                      <div className="row student-data mt-2">
                        <div className="col-2">
                          <p>
                            {info.first_name} {info.last_name}
                          </p>
                        </div>
                        <div className="col-3">
                          <p>{info.email_address}</p>
                        </div>
                        <div className="col-2">
                          {info.user_type == "superadmin" ? (
                            <p>Super Administrator</p>
                          ) : (
                            <p>Administrator</p>
                          )}
                        </div>
                        <div className="col-2">
                          <button
                            className="btn btn-success px-4 rounded-5 fw-semibold text-white"
                            onClick={() => {
                              setIsViewModal(!isViewModal);
                              setSelectedUser(info);
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
                                  setIsSuspendModal(!isSuspendModal);
                                  setSelectedUser(info);
                                }}
                              >
                                Suspend
                              </button>
                            </div>
                            <div className="col">
                              <button
                                className="btn btn-light px-4 text-black rounded-5 fw-semibold "
                                onClick={() => {
                                  setIsEditModal(!isEditModal);
                                  setSelectedUser(info);
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }
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
                            <td className="fw-bold">User type:</td>
                            {selectedUser.user_type == "admin" ? (
                              <td>Administrator</td>
                            ) : (
                              <td>Super Administrator</td>
                            )}
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

              {isEditModal && (
                <>
                  <Modal
                    toggle={() => setIsEditModal(!isEditModal)}
                    isOpen={isEditModal}
                  >
                    <div className=" modal-header">
                      <h5
                        className=" modal-title text-center m-auto fw-bold"
                        id="editModal"
                      >
                        EDIT ACCOUNT INFORMATION
                      </h5>
                    </div>
                    <ModalBody>
                      <div className="container">
                        <form>
                          <div className="mb-3 mt-3">
                            <label htmlFor="last_name" className="label">
                              Last Name:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              className="form-control"
                              placeholder={selectedUser.last_name}
                              defaultValue={selectedUser.last_name}
                              name="last_name"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="first_name" className="label">
                              First Name:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              className="form-control"
                              placeholder={selectedUser.first_name}
                              defaultValue={selectedUser.first_name}
                              name="first_name"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="email_address" className="label">
                              Email Address:
                            </label>
                            <input
                              type="email"
                              id="email_address"
                              className="form-control"
                              placeholder={selectedUser.email_address}
                              defaultValue={selectedUser.email_address}
                              name="email_address"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="emp_num" className="label">
                              Contact Number:
                            </label>
                            <input
                              type="text"
                              id="contact_number"
                              className="form-control"
                              placeholder={selectedUser.contact_number}
                              defaultValue={selectedUser.contact_number}
                              name="contact_number"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="email" className="label">
                              Address
                            </label>
                            <input
                              type="text"
                              id="address"
                              className="form-control"
                              placeholder={selectedUser.address}
                              defaultValue={selectedUser.address}
                              name="address"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="pwd" className="label">
                              Birthday
                            </label>
                            <input
                              type="date"
                              id="birthday"
                              className="form-control"
                              placeholder={selectedUser.birthday}
                              defaultValue={fetchDate(selectedUser.birthday)}
                              name="birthday"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="civil_status" className="label">
                              Civil Status
                            </label>
                            <br />
                            <select
                              id="civil_status"
                              name="civil_status"
                              defaultValue={selectedUser.civil_status}
                            >
                              {selectedUser.civil_status == "single" ? (
                                <>
                                  <option value="single" selected>
                                    Single
                                  </option>
                                  <option value="married">Married</option>
                                  <option value="widowed">Widowed</option>
                                  <option value="separated">
                                    Legally Separated
                                  </option>
                                </>
                              ) : selectedUser.civil_status == "married" ? (
                                <>
                                  <option value="single">Single</option>
                                  <option value="married" selected>
                                    Married
                                  </option>
                                  <option value="widowed">Widowed</option>
                                  <option value="separated">
                                    Legally Separated
                                  </option>
                                </>
                              ) : selectedUser.civil_status == "widowed" ? (
                                <>
                                  <option value="single">Single</option>
                                  <option value="married">Married</option>
                                  <option value="widowed" selected>
                                    Widowed
                                  </option>
                                  <option value="separated">
                                    Legally Separated
                                  </option>
                                </>
                              ) : (
                                <>
                                  <option value="single">Single</option>
                                  <option value="married">Married</option>
                                  <option value="widowed">Widowed</option>
                                  <option value="separated" selected>
                                    Legally Separated
                                  </option>
                                </>
                              )}
                            </select>
                          </div>
                          <div className="mb-3">
                            <label for="user_type">User Type: </label>
                            <br />
                            <select
                              id="user_type"
                              name="user_type"
                              defaultValue={selectedUser.user_type}
                            >
                              {selectedUser.user_type == "admin" ? (
                                <>
                                  <option value="superadmin">
                                    Super Administrator
                                  </option>
                                  <option value="admin" selected>
                                    Administrator
                                  </option>
                                </>
                              ) : (
                                <>
                                  <option value="superadmin" selected>
                                    Super Administrator
                                  </option>
                                  <option value="admin">Administrator</option>
                                </>
                              )}
                            </select>
                          </div>
                        </form>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold "
                        color="secondary"
                        type="button"
                        onClick={() => {
                          editUser();
                          setIsEditModal(false);
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsEditModal(false);
                        }}
                      >
                        Back
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              {isSuspendModal && (
                <>
                  <Modal
                    toggle={() => setIsSuspendModal(!isSuspendModal)}
                    isOpen={isSuspendModal}
                  >
                    <div className=" modal-header">
                      <h5
                        className=" modal-title text-center m-auto fw-bold text-uppercase"
                        id="viewModal"
                      >
                        ARE YOU SURE YOU WANT TO SUSPEND{" "}
                        {selectedUser.first_name}'s ACCOUNT?
                      </h5>
                    </div>
                    <ModalBody>
                      <p className="text-center">
                        Suspending {selectedUser.first_name}'s account will turn
                        it to pending status. This account will be transferred
                        to the pending account if you continue.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-danger text-white m-auto px-5"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsSuspendModal(false);
                          suspendUser();
                        }}
                      >
                        Proceed Suspension
                      </Button>
                      <Button
                        className="btn-light m-auto px-5"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsSuspendModal(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              {isCreateModal && (
                <>
                  <Modal
                    toggle={() => setIsCreateModal(!isCreateModal)}
                    isOpen={isCreateModal}
                  >
                    <div className=" modal-header">
                      <h5
                        className=" modal-title text-center m-auto fw-bold"
                        id="editModal"
                      >
                        CREATE AN ADMINISTRATOR ACCOUNT
                      </h5>
                    </div>
                    <ModalBody>
                      <div className="container">
                        <form>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_last_name" className="label">
                              Last Name:
                            </label>
                            <input
                              type="text"
                              id="c_last_name"
                              className="form-control"
                              placeholder="Last Name"
                              name="c_last_name"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_first_name" className="label">
                              First Name:
                            </label>
                            <input
                              type="text"
                              id="c_first_name"
                              className="form-control"
                              placeholder="First Name"
                              name="c_first_name"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_email_address" className="label">
                              Email Address:
                            </label>
                            <input
                              type="email"
                              id="c_email_address"
                              className="form-control"
                              placeholder="Email Address"
                              name="c_email_address"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_contact_number" className="label">
                              Contact Number:
                            </label>
                            <input
                              type="text"
                              id="c_contact_number"
                              className="form-control"
                              placeholder="Contact Number"
                              name="c_contact_number"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_address" className="label">
                              Address
                            </label>
                            <input
                              type="text"
                              id="c_address"
                              className="form-control"
                              placeholder="Address"
                              name="c_address"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="c_birthday" className="label">
                              Birthday
                            </label>
                            <input
                              type="date"
                              id="c_birthday"
                              className="form-control"
                              name="c_birthday"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_password" className="label">
                              Password
                            </label>
                            <input
                              type="password"
                              id="c_password"
                              className="form-control"
                              placeholder="Password"
                              name="c_password"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="c_civil_status" className="label">
                              Civil Status
                            </label>
                            <br />
                            <select id="c_civil_status" name="c_civil_status">
                              <option value="single">Single</option>
                              <option value="married">Married</option>
                              <option value="widowed">Widowed</option>
                              <option value="separated">
                                Legally Separated
                              </option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label for="c_user_type">User Type: </label>
                            <br />
                            <select id="c_user_type" name="c_user_type">
                              <option value="superadmin">
                                Super Administrator
                              </option>
                              <option value="admin">Administrator</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold "
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsCreateModal(false);
                          createAccount();
                        }}
                      >
                        Create Admin Account
                      </Button>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsCreateModal(false);
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
                <button
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={() => {
                    setIsCreateModal(true);
                  }}
                >
                  Create New Account
                </button>
              </div>
              <div className="col-3">
                <Link
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={null}
                  href="/manage-accounts/admin-applications"
                >
                  View Pending Accounts
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
