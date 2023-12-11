import { useEffect, useState } from "react";
import "./style.css";
import "../../styles/custom.scss";
import Link from "next/link";
import Navbar from "../../components/navbar";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import { useApiStore } from "../../store/apiStore";
import FormattedDate from "../../components/formatted-date";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useUserDataStore } from "../../store/userDataStore";

export default function AdminApplications() {
  const router = useRouter();

  const [isVerified, setIsVerified] = useState(false);
  const [data, setData] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [action, setAction] = useState();
  const [isViewModal, setIsViewModal] = useState(false);
  const [isApprovedRejectModal, setIsApprovedRejectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("Search by");
  const [sortBy, setSortBy] = useState("Sort by");

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

  useEffect(() => {
    if (useUserDataStore.getState().pageData != null) {
      console.log("this executes");
      console.log(useUserDataStore.getState().pageData);
      setIsLoading(true);
      setData(useUserDataStore.getState().pageData);
      setIsLoading(false);
    }
  }, [useUserDataStore.getState().pageData]);

  function getUserId(token) {
    fetch(`${useApiStore.getState().apiUrl}auth/profile/${token}`, {
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
    setIsLoading(true);

    fetch(
      `${useApiStore.getState().apiUrl}users/admin-pending-users?page=${page}`,
      {
        headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
      }
    )
      .then((response) => response.json())
      .then((body) => {
        setData(body);
        setIsLoading(false);
      });
  }

  function getFilteredData() {

    const search = document.getElementById("search").value;

    if (sortBy != "Sort By" && searchBy != "Search by") {
      fetch(
        `${
          useApiStore.getState().apiUrl
        }users/admin-pending-users?sort=${sortBy}&searchBy=${searchBy}&search=${search}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setIsLoading(true);
          setData(body);
          setIsLoading(false);
        });
    } else if (sortBy == "Sort by" && searchBy != "Search by") {
      fetch(
        `${
          useApiStore.getState().apiUrl
        }users/admin-pending-users?searchBy=${searchBy}&search=${search}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setIsLoading(true);
          setData(body);
          setIsLoading(false);
        });
    } else if (searchBy == "Search by") {
      getData();
    }
  }

  function approve() {
    fetch(`${useApiStore.getState().apiUrl}users/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
      body: JSON.stringify({
        isAuthenticated: true,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        window.location.reload();
      });
  }

  function reject() {
    if (selectedUser.user_type == "admin") {
      selectedUser.user_type = "admin-rejected";
    } else {
      selectedUser.user_type = "superadmin-rejected";
    }

    fetch(`${useApiStore.getState().apiUrl}users/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
      body: JSON.stringify({
        user_type: selectedUser.user_type,
        isAuthenticated: false,
      }),
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
            <h2>Administrator Account Applications</h2>
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
                    placeholder="Enter Search Query"
                    name="search"
                    id="search"
                  />
                </div>

                <div className="col-2">
                  <div className="dropdown">
                    <button
                      type="button"
                      className="btn btn-light dropdown-toggle px-5 fw-bold "
                      data-bs-toggle="dropdown"
                      id="searchBy"
                    >
                      {searchBy == "first_name"
                        ? "First Name"
                        : searchBy == "last_name"
                        ? "Last Name"
                        : searchBy == "email"
                        ? "Email Address"
                        : searchBy}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("first_name")}
                          value="first_name"
                        >
                          First Name
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("last_name")}
                          value="last_name"
                        >
                          Last Name
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("email")}
                          value="email_address"
                        >
                          Email Address
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("Search by")}
                          value="email_address"
                        >
                          Remove Filter
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
                      {sortBy == "alphabetical"
                        ? "Alphabetical"
                        : sortBy == "reverse_alphabetical"
                        ? "Reverse Order"
                        : "Sort by"}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSortBy("alphabetical")}
                        >
                          Alphabetical
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSortBy("reverse_alphabetical")}
                        >
                          Reverse Alphabetical
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSortBy("Sort by")}
                        >
                          Remove Filter
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-2">
                  <button
                    type="button"
                    className="btn btn-primary px-5 fw-bold"
                    onClick={getFilteredData}
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
                  <h6>Application Date</h6>
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
                    <div className="col-2">
                      <FormattedDate date={info.createdAt} />
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
                            className="btn btn-success px-3 rounded-5 fw-semibold text-white"
                            onClick={() => {
                              setSelectedUser(info);
                              setAction("approve");
                              setIsApprovedRejectModal(true);
                            }}
                          >
                            Accept
                          </button>
                        </div>
                        <div className="col">
                          <button
                            className="btn btn-danger px-4 text-white rounded-5 fw-semibold "
                            onClick={() => {
                              setSelectedUser(info);
                              setAction("reject");
                              setIsApprovedRejectModal(true);
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isApprovedRejectModal && (
                <>
                  <Modal
                    toggle={() =>
                      setIsApprovedRejectModal(!isApprovedRejectModal)
                    }
                    isOpen={isApprovedRejectModal}
                  >
                    <div className=" modal-header">
                      {action == "approve" ? (
                        <h5
                          className=" modal-title text-center m-auto fw-bold text-uppercase"
                          id="viewModal"
                        >
                          Do you want to Approve {selectedUser.first_name}'s
                          Account?
                        </h5>
                      ) : (
                        <h5
                          className=" modal-title text-center m-auto fw-bold text-uppercase"
                          id="viewModal"
                        >
                          Do you want to Reject {selectedUser.first_name}'s
                          Account?
                        </h5>
                      )}
                    </div>
                    <ModalBody></ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          if (action == "approve") {
                            approve();
                          } else {
                            reject();
                          }
                          setIsApprovedRejectModal(false);
                        }}
                      >
                        Yes
                      </Button>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsApprovedRejectModal(false);
                        }}
                      >
                        No
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

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

              <ul className="pagination m-auto mt-5">
                <li className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => {
                      if (page > 0) {
                        setPage(page - 1);

                        if (searchBy != "Search by") {
                          getFilteredData();
                        } else {
                          getData();
                        }
                      }
                    }}
                  >
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
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => {
                      setPage(page + 1);

                      if (searchBy != "Search by") {
                        getFilteredData();
                      } else {
                        setIsLoading(true);
                        getData();
                      }
                    }}
                  >
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
                  href="/manage-accounts/admin-rejected-applications"
                >
                  View Rejected Accounts
                </Link>
              </div>
              <div className="col-3">
                <Link
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={null}
                  href="/manage-accounts/admin-accounts"
                >
                  View Admin Accounts
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
