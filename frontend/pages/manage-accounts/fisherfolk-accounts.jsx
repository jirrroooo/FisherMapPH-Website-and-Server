import { useEffect, useState } from "react";
import "./style.css";
import "../../styles/custom.scss";
import Navbar from "../../components/navbar";
import Link from "next/link";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import { useApiStore } from "../../store/apiStore";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import FormattedDate from "../../components/formatted-date";
import LoadingPage from "../../components/loading_page";

export default function FisherfolkAccount() {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModal, setIsViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [isEditModal, setIsEditModal] = useState(false);
  const [isSuspendModal, setIsSuspendModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
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
    fetch(`${useApiStore.getState().apiUrl}users/fisherfolk-users`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
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
        }users/fisherfolk-users?sort=${sortBy}&searchBy=${searchBy}&search=${search}&page=${page}`,
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
        }users/fisherfolk-users?searchBy=${searchBy}&search=${search}&page=${page}`,
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

  function fetchDate(date) {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = yyyy + "-" + mm + "-" + dd;

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
        region: document.getElementById("region").value,
        birthday: document.getElementById("birthday").value,
        civil_status: document.getElementById("civil_status").value,
        region: document.getElementById("region").value,
        user_type: "user",
        fishing_vessel_type: document.getElementById("fishing_vessel_type")
          .value,
        isAuthenticated: selectedUser.isAuthenticated,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
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
        user_type: "user",
        fishing_vessel_type: document.getElementById("c_fishing_vessel_type")
          .value,
        isAuthenticated: true,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
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
        fishing_vessel_type: selectedUser.fishing_vessel_type,
        isAuthenticated: false,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        window.location.reload();
      });
  }

  function getDataByPage(pageNumber) {
    setPage(pageNumber);
    setIsLoading(true);

    fetch(
      `${
        useApiStore.getState().apiUrl
      }users/fisherfolk-users?page=${pageNumber}`,
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

  function getFilteredDataByPageNumber(pageNumber) {
    setPage(pageNumber);

    const search = document.getElementById("search").value;

    if (sortBy != "Sort By" && searchBy != "Search by") {
      fetch(
        `${
          useApiStore.getState().apiUrl
        }users/fisherfolk-users?sort=${sortBy}&searchBy=${searchBy}&search=${search}&page=${pageNumber}`,
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
        }users/fisherfolk-users?searchBy=${searchBy}&search=${search}&page=${pageNumber}`,
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
      getDataByPage(pageNumber);
    }
  }

  const handleNextPage = () => {
    if (searchBy != "Search by") {
      getFilteredDataByPageNumber(page + 1);
    } else {
      getDataByPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (searchBy != "Search by") {
      getFilteredDataByPageNumber(page - 1);
    } else {
      getDataByPage(page - 1);
    }
  };

  return (
    <>
      {!isLoading ? (
        <>
          <Navbar />
          <div className="container mt-4 text-center">
            <h2>Fisherfolk Accounts</h2>
            <p>
              The list of verified fisherfolk accounts is shown below. Make sure to send them a notification whenever
               they need to update their information. Noted that creating a user account will not automatically make 
               the account verified.
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

              {data.map((info, i) => {
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
                      <div className="col-2 text-capitalize">
                        {info.fishing_vessel_type}
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
                            <td className="fw-bold">Region:</td>
                            <td>
                              {selectedUser.region}
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
                            <td className="fw-bold">Vessel Type:</td>
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
                            <label htmlFor="region" className="label">
                              Region
                            </label>
                            <br />
                            <select
                              id="region"
                              name="region"
                              defaultValue={selectedUser.region}
                            >
                              <option value="Ilocos Region">
                                Ilocos Region
                              </option>
                              <option value="Cagayan Valley">
                                Cagayan Valley
                              </option>
                              <option value="Central Luzon">
                                Central Luzon
                              </option>
                              <option value="CALABARZON">CALABARZON</option>
                              <option value="MIMAROPA">MIMAROPA</option>
                              <option value="Bicol Region">Bicol Region</option>
                              <option value="Western Visayas">
                                Western Visayas
                              </option>
                              <option value="Central Visayas">
                                Central Visayas
                              </option>
                              <option value="Eastern Visayas">
                                Eastern Visayas
                              </option>
                              <option value="Zamboanga Peninsula">
                                Zamboanga Peninsula
                              </option>
                              <option value="Northern Mindanao">
                                Northern Mindanao
                              </option>
                              <option value="Davao Region">Davao Region</option>
                              <option value="SOCCSKSARGEN">SOCCSKSARGEN</option>
                              <option value="Caraga">Caraga</option>
                              <option value="BARMM">BARMM</option>
                              <option value="National Capital Region">
                                National Capital Region
                              </option>
                              <option value="Cordillera Administrative Region">
                                Cordillera Administrative Region
                              </option>
                            </select>
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
                            <label for="fishing_vessel_type">
                              Fishing Vessel Type{" "}
                            </label>
                            <br />
                            <select
                              id="fishing_vessel_type"
                              name="fishing_vessel_type"
                              defaultValue={selectedUser.fishing_vessel_type}
                            >
                              {selectedUser.fishing_vessel_type == "small" ? (
                                <>
                                  <option value="small" selected>
                                    Small
                                  </option>
                                  <option value="medium">Medium</option>
                                  <option value="large">Large</option>
                                </>
                              ) : selectedUser.fishing_vessel_type ==
                                "medium" ? (
                                <>
                                  <option value="small">Small</option>
                                  <option value="medium" selected>
                                    Medium
                                  </option>
                                  <option value="large">Large</option>
                                </>
                              ) : (
                                <>
                                  <option value="small">Small</option>
                                  <option value="medium">Medium</option>
                                  <option value="large" selected>
                                    Large
                                  </option>
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
                        CREATE AN FISHERFOLK ACCOUNT
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
                            <label for="c_fishing_vessel_type">
                              Fishing Vessel Type{" "}
                            </label>
                            <br />
                            <select
                              id="c_fishing_vessel_type"
                              name="c_fishing_vessel_type"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
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
                        Create User Account
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
                  {page != 1 ? (
                    <button
                      className="btn btn-light"
                      onClick={() => {
                        if (page > 0) {
                          handlePrevPage();
                        }
                      }}
                    >
                      Previous
                    </button>
                  ) : (
                    <button
                      className="btn btn-light"
                      onClick={() => {
                        if (page > 0) {
                          handlePrevPage();
                        }
                      }}
                      disabled
                    >
                      Previous
                    </button>
                  )}
                </li>
                <li className="page-item">
                  <a className="page-link text-white pg-active" href="#">
                    {page}
                  </a>
                </li>
                <li className="page-item">
                  {
                    // kapag lima ang data sa page
                    Object.keys(data).length == 5 ? (
                      <button
                        className="btn btn-light"
                        onClick={() => {
                          handleNextPage();
                        }}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn btn-light"
                        onClick={() => {
                          handleNextPage();
                        }}
                        disabled
                      >
                        Next
                      </button>
                    )
                  }
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
                  href="/manage-accounts/fisherfolk-applications"
                >
                  Pending Accounts
                </Link>
              </div>
              <div className="col-3"></div>
            </div>
          </div>
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}
