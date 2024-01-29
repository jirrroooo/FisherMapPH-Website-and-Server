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
import ListFormat from "../../components/list";

export default function ManageAlerts() {
  const router = useRouter();

  const [isVerified, setIsVerified] = useState(false);
  const [data, setData] = useState();
  const [isViewModal, setIsViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("Search by");
  const [sortBy, setSortBy] = useState("Sort by");

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
    fetch(`${useApiStore.getState().apiUrl}alerts`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
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
        }alerts?sort=${sortBy}&searchBy=${searchBy}&search=${search}&page=${page}`,
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
        }alerts?searchBy=${searchBy}&search=${search}&page=${page}`,
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

  function createAlert() {
    const isSpecific = document.getElementById("yes").checked ? true : false;

    fetch(`${useApiStore.getState().apiUrl}alerts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
      body: JSON.stringify({
        title: document.getElementById("c_title").value,
        description: document.getElementById("c_description").value,
        location: document.getElementById("c_location").value,
        level: document.getElementById("c_level").value,
        isSpecific: isSpecific,
        // specified_user: document.getElementById("c_specified_user").value,
        // notified_user: document.getElementById("c_notified_useer").value,
        effective: document.getElementById("c_effective").value,
        expires: document.getElementById("c_expiry").value,
        instruction: document.getElementById("c_instruction").value,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        // alert("Edit Successful!");
        // router.refresh();
        window.location.reload();
      });
  }

  function deleteAlert() {
    fetch(`${useApiStore.getState().apiUrl}alerts/${selectedUser._id}`, {
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

  function editAlert() {
    const isSpecific = document.getElementById("yes").checked ? true : false;

    fetch(`${useApiStore.getState().apiUrl}alerts/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
      body: JSON.stringify({
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        level: document.getElementById("level").value,
        isSpecific: isSpecific,
        // specified_user: document.getElementById("c_birthday").value,
        // notified_user: document.getElementById("c_password").value,
        effective: document.getElementById("effective").value,
        expires: document.getElementById("expiry").value,
        instruction: document.getElementById("instruction").value,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        // alert("Edit Successful!");
        // router.refresh();
        window.location.reload();
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

    return formattedToday;
  }

  function getDataByPage(pageNumber) {
    setPage(pageNumber);
    setIsLoading(true);

    fetch(`${useApiStore.getState().apiUrl}alerts?page=${pageNumber}`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
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
        }alerts?sort=${sortBy}&searchBy=${searchBy}&search=${search}&page=${pageNumber}`,
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
        }alerts?searchBy=${searchBy}&search=${search}&page=${pageNumber}`,
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
            <h2>Manage Alerts</h2>
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
                      {searchBy == "title"
                        ? "Title"
                        : searchBy == "description"
                        ? "Description"
                        : searchBy == "level"
                        ? "Level"
                        : searchBy}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("title")}
                          value="title"
                        >
                          Title
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("description")}
                          value="description"
                        >
                          Description
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("level")}
                          value="level"
                        >
                          Level
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("search by")}
                          value=""
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

              {data.map((info, i) => {
                return (
                  <div className="row student-data mb-2">
                    <div className="col-2">
                      {new Date() >= Date.parse(info.effective) &&
                        new Date() < Date.parse(info.expires) && (
                          <p>
                            {info.title}{" "}
                            <span className="badge bg-success">Active</span>
                          </p>
                        )}

                      {new Date() > Date.parse(info.expires) && (
                        <p>
                          {info.title}{" "}
                          <span className="badge bg-danger text-danger text-white">
                            {" "}
                            Expires
                          </span>
                        </p>
                      )}

                      {new Date() < Date.parse(info.effective) && (
                        <p>
                          {info.title}{" "}
                          <span className="badge bg-dark text-white ">
                            {" "}
                            Scheduled
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="col-3">
                      <p>{info.description}</p>
                    </div>
                    <div className="col-2 text-capitalize">
                      <p>{info.level}</p>
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
                          <button
                            className="btn btn-light px-3 rounded-5 fw-semibold"
                            onClick={() => {
                              setSelectedUser(info);
                              setIsEditModal(true);
                            }}
                          >
                            Edit Alert
                          </button>
                        </div>
                        <div className="col">
                          <button
                            className="btn btn-danger px-4 text-white rounded-5 fw-semibold "
                            onClick={() => {
                              setIsDeleteModal(true);
                              setSelectedUser(info);
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
                        ALERT INFORMATION
                      </h5>
                    </div>
                    <ModalBody>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Title:</td>
                            <td>{selectedUser.title}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Description:</td>
                            <td>{selectedUser.description}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Location:</td>
                            <td>{selectedUser.location}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Alert Level:</td>
                            <td className="text-capitalize">
                              {selectedUser.level}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Specific:</td>
                            {selectedUser.isSpecific ? (
                              <td>True</td>
                            ) : (
                              <td>False</td>
                            )}
                            <td>{selectedUser.isSpecific}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Target Users:</td>
                            <td>Feature to be followed</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Notified Users:</td>
                            <td>Feature to be followed</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Effectivity Date:</td>
                            <td>
                              <FormattedDate date={selectedUser.effective} />
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Expiry Date:</td>
                            <td>
                              <FormattedDate date={selectedUser.expires} />
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Instruction:</td>
                            <td>{selectedUser.instruction}</td>
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

              {isCreateModal && (
                <>
                  <Modal
                    toggle={() => setIsCreateModal(!isCreateModal)}
                    isOpen={isCreateModal}
                  >
                    <div className="modal-header">
                      <h5
                        className=" modal-title text-center m-auto fw-bold"
                        id="editModal"
                      >
                        CREATE A NEW ALERT
                      </h5>
                    </div>
                    <ModalBody>
                      <div className="container">
                        <form>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_title" className="label">
                              Enter Alert Title
                            </label>
                            <input
                              type="text"
                              id="c_title"
                              className="form-control"
                              placeholder="Title"
                              name="c_title"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_description" className="label">
                              Enter Description
                            </label>
                            <input
                              type="text"
                              id="c_description"
                              className="form-control"
                              placeholder="Description"
                              name="c_description"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_location" className="label">
                              Enter Location
                            </label>
                            <input
                              type="text"
                              id="c_location"
                              className="form-control"
                              placeholder="Location"
                              name="c_location"
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="c_level" className="label">
                              Select Alert Level
                            </label>
                            <br />
                            <select id="c_level" name="level" className="px-3">
                              <option value="low">Low</option>
                              <option value="moderate">Moderate</option>
                              <option value="high">High</option>
                            </select>
                          </div>

                          <div className="mb-3 mt-3">
                            <label for="c_specific_user">Specific User: </label>
                            <br />
                            <div className="px-3">
                              <div>
                                <input
                                  type="radio"
                                  id="yes"
                                  name="c_specific_user"
                                  value="true"
                                />{" "}
                                Yes
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  id="no"
                                  name="c_specific_user"
                                  value="false"
                                />{" "}
                                No
                              </div>
                            </div>
                            <br />
                          </div>

                          <div className="mb-3 mt-3">
                            <label htmlFor="" className="label">
                              Specified Users
                            </label>
                            <input
                              type="text"
                              id="c_specified_users"
                              className="form-control"
                              placeholder="Specified User - Feature Not Working"
                              name="c_specified_users"
                              readOnly
                            />
                          </div>

                          <div className="mb-3 mt-3">
                            <label htmlFor="c_notified_users" className="label">
                              Notified Users
                            </label>
                            <input
                              type="text"
                              id="c_notified_users"
                              className="form-control"
                              placeholder="Notified User - Feature Not Working"
                              name="c_notified_users"
                              readOnly
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="c_effective" className="label">
                              Effectivity Date
                            </label>
                            <input
                              type="date"
                              id="c_effective"
                              className="form-control"
                              name="c_effective"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="c_expiry" className="label">
                              Expiry Date
                            </label>
                            <input
                              type="date"
                              id="c_expiry"
                              className="form-control"
                              name="c_expiry"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="c_instruction" className="label">
                              Instruction
                            </label>
                            <input
                              type="text"
                              id="c_instruction"
                              className="form-control"
                              placeholder="Instruction"
                              name="c_instruction"
                            />
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
                          createAlert();
                        }}
                      >
                        Create New Alert
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

              {isDeleteModal && (
                <>
                  <Modal
                    toggle={() => setIsDeleteModal(!isDeleteModal)}
                    isOpen={isDeleteModal}
                  >
                    <div className="modal-header">
                      <h5
                        className="modal-title text-center m-auto fw-bold text-uppercase"
                        id="viewModal"
                      >
                        ARE YOU SURE YOU WANT TO DELETE {selectedUser.title}?
                      </h5>
                    </div>
                    <ModalBody>
                      <p className="text-center">
                        Deleting {selectedUser.title} will erase all the alert
                        information. This action is irreversible.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-danger text-white m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsDeleteModal(false);
                          deleteAlert();
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
                        EDIT ALERT INFORMATION
                      </h5>
                    </div>
                    <ModalBody>
                      <div className="container">
                        <form>
                          <div className="mb-3 mt-3">
                            <label htmlFor="title" className="label">
                              Enter Alert Title
                            </label>
                            <input
                              type="text"
                              id="title"
                              className="form-control"
                              placeholder={selectedUser.title}
                              defaultValue={selectedUser.title}
                              name="title"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="description" className="label">
                              Enter Description
                            </label>
                            <input
                              type="text"
                              id="description"
                              className="form-control"
                              placeholder={selectedUser.title}
                              defaultValue={selectedUser.description}
                              name="description"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="location" className="label">
                              Enter Location
                            </label>
                            <input
                              type="text"
                              id="location"
                              className="form-control"
                              placeholder={selectedUser.location}
                              defaultValue={selectedUser.location}
                              name="location"
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="level" className="label">
                              Select Alert Level
                            </label>

                            <br />

                            {selectedUser.level == "high" && (
                              <select
                                id="level"
                                name="level"
                                className="px-3"
                                defaultChecked={selectedUser.level}
                              >
                                <option value="low">Low</option>
                                <option value="moderate">Moderate</option>
                                <option value="high" selected>
                                  High
                                </option>
                              </select>
                            )}

                            {selectedUser.level == "low" && (
                              <select id="level" name="level" className="px-3">
                                <option value="low" selected>
                                  Low
                                </option>
                                <option value="moderate">Moderate</option>
                                <option value="high">High</option>
                              </select>
                            )}

                            {selectedUser.level == "moderate" && (
                              <select id="level" name="level" className="px-3">
                                <option value="low">Low</option>
                                <option value="moderate" selected>
                                  Moderate
                                </option>
                                <option value="high">High</option>
                              </select>
                            )}
                          </div>

                          <div className="mb-3 mt-3">
                            <label for="specific_user">Specific User: </label>
                            <br />
                            {selectedUser.isSpecific ? (
                              <>
                                <div className="px-3">
                                  <div>
                                    <input
                                      type="radio"
                                      id="yes"
                                      name="specific_user"
                                      value="true"
                                      checked
                                    />{" "}
                                    Yes
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      id="no"
                                      name="specific_user"
                                      value="false"
                                    />{" "}
                                    No
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="px-3">
                                <div>
                                  <input
                                    type="radio"
                                    id="yes"
                                    name="specific_user"
                                    value="true"
                                  />{" "}
                                  Yes
                                </div>
                                <div>
                                  <input
                                    type="radio"
                                    id="no"
                                    name="specific_user"
                                    value="false"
                                    checked
                                  />{" "}
                                  No
                                </div>
                              </div>
                            )}

                            <br />
                          </div>

                          <div className="mb-3 mt-3">
                            <label htmlFor="" className="label">
                              Specified Users
                            </label>
                            <input
                              type="text"
                              id="specified_users"
                              className="form-control"
                              placeholder="Specified User - Feature Not Working"
                              name="specified_users"
                              readOnly
                            />
                          </div>

                          <div className="mb-3 mt-3">
                            <label htmlFor="notified_users" className="label">
                              Notified Users
                            </label>
                            <input
                              type="text"
                              id="notified_users"
                              className="form-control"
                              placeholder="Notified User - Feature Not Working"
                              name="notified_users"
                              readOnly
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="effective" className="label">
                              Effectivity Date
                            </label>
                            <input
                              type="date"
                              id="effective"
                              className="form-control"
                              defaultValue={fetchDate(selectedUser.effective)}
                              name="effective"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="expiry" className="label">
                              Expiry Date
                            </label>
                            <input
                              type="date"
                              id="expiry"
                              className="form-control"
                              defaultValue={fetchDate(selectedUser.expires)}
                              name="expiry"
                            />
                          </div>
                          <div className="mb-3 mt-3">
                            <label htmlFor="instruction" className="label">
                              Instruction
                            </label>
                            <input
                              type="text"
                              id="instruction"
                              className="form-control"
                              placeholder={selectedUser.instruction}
                              defaultValue={selectedUser.instruction}
                              name="instruction"
                            />
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
                          editAlert();
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
              <div className="col-4"></div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={() => {
                    setIsCreateModal(true);
                  }}
                >
                  Create New Alert
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
        <>
          <div className="m-auto mt-5">
            <h1 className="text-center" style={{ marginTop: "150px" }}>
              FisherMap PH
            </h1>
          </div>
          <div className="loader m-auto mt-5"></div>
        </>
      )}
    </>
  );
}
