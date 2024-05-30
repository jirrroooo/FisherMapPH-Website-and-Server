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
import { useUserDataStore } from "../../store/userDataStore";
import LoadingPage from "../../components/loading_page";

export default function ManageDistressCalls() {
  const router = useRouter();

  const [isVerified, setIsVerified] = useState(false);
  const [data, setData] = useState();
  const [isViewModal, setIsViewModal] = useState(false);
  const [isRespondModal, setIsRespondModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [isArchiveModal, setIsArchiveModal] = useState(false);
  const [isUnarchiveModal, setIsUnarchiveModal] = useState(false);
  const [isRevertModal, setIsRevertModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("Search by");
  const [sortBy, setSortBy] = useState("Sort by");
  const [emailInput, setEmailInput] = useState([
    {
      type: "text",
      id: 1,
      value: "",
    },
  ]);

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
    fetch(`${useApiStore.getState().apiUrl}profile/${token}`, {
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
          getUserData(token);
          getData();
        }
      });
  }

  function getUserData(token) {
    fetch(
      `${useApiStore.getState().apiUrl}user/${useLoginStore.getState().id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          useUserDataStore.setState({
            userData: data,
          });
          getData();
        }
      });
  }

  function getData() {
    fetch(`${useApiStore.getState().apiUrl}reports?status=no_response`, {
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
        }reports?sort=${sortBy}&searchBy=${searchBy}&search=${search}&page=${page}&status=no_response`,
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
        }reports?searchBy=${searchBy}&search=${search}&page=${page}&status=no_response`,
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

  function addEmailInput(e) {
    e.preventDefault();

    setEmailInput((info) => {
      return [
        ...info,
        {
          type: "text",
          value: "",
        },
      ];
    });
  }

  function handleChange(e) {
    e.preventDefault();

    const index = e.target.id;

    setEmailInput((email) => {
      const newArr = email.slice();
      newArr[index].value = e.target.value;

      return newArr;
    });
  }

  function resetEmailInput() {
    setEmailInput([
      {
        type: "text",
        id: 1,
        value: "",
      },
    ]);
  }

  async function sendInformation(email_list) {
    const html_content = `
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        th, td {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <p>Dear Ma'am/Sir:</p>
      <p>Please be informed that there is an emergency situation for a fisherfolk that needs your attention. Below are the details of the distress call alert.</p>
      
      <p style="font-weight: bold; margin-top: 30px">Message from the Administrator:</p>
      <p>${document.getElementById("emailContent").value}</p>

      <h2 style="margin-top: 30px">Distress Call Report</h2>
    
      <table>
        <tr>
          <th>Date & Time</th>
          <td>${selectedUser.report.createdAt}
          </td>
        </tr>
        <tr>
          <th>Type</th>
          <td>${selectedUser.report.type}</td>
        </tr>
        <tr>
          <th>Message</th>
          <td>${selectedUser.report.content}</td>
        </tr>
        <tr>
        <th>Status</th>
        <td>${selectedUser.report.status}</td>
      </tr>
        <tr>
          <th>Location</th>
          <td>Latitude: ${selectedUser.positionInfo.latitude}, Longitude: ${
      selectedUser.positionInfo.longitude
    }</td>
        </tr>
        <tr>
          <th>Fishing Vessel Type</th>
          <td>${selectedUser.userInfo.fishing_vessel_type}
          </td>
        </tr>
        <tr>
          <th>Fisherfolk Name</th>
          <td>${selectedUser.userInfo.first_name} ${
      selectedUser.userInfo.last_name
    }</td>
        </tr>
        <tr>
          <th>Contact Number</th>
          <td>${selectedUser.userInfo.contact_number}</td>
        </tr>
        <tr>
          <th>Person to Notify</th>
          <td>${selectedUser.userInfo.person_to_notify}</td>
        </tr>
        <tr>
          <th>Address</th>
          <td>${selectedUser.userInfo.address}</td>
        </tr>
      </table>

      <p style="margin-top: 30px">Sincerly yours,</p>
      <p style="font-weight: bold; text-transform: uppercase; margin-bottom: 0px">${
        useUserDataStore.getState().userData.first_name
      } ${useUserDataStore.getState().userData.last_name}</p>
      <p style="margin-top: 0px">FisherMap PH</p>
    
    </body>
    </html>
    `;

    let emails = email_list.map((item) => {
      return item.value;
    });

    const text = `
    Distress Signal Call was initiated by ${selectedUser.userInfo.first_name} ${
      selectedUser.userInfo.last_name
    }
    Distress Signal was received on: ${(
      <FormattedDateTime date={selectedUser.report.createdAt} />
    )}
    Position: ${selectedUser.positionInfo.latitude}, ${
      selectedUser.positionInfo.longitude
    }
    Message from the sender: ${selectedUser.report.content}
    `;

    const subject = document.getElementById("emailSubject").value;

    await fetch(`${useApiStore.getState().apiUrl}contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
      body: JSON.stringify({
        mail_list: emails,
        email_subject: subject,
        text_message: text,
        html_message: html_content,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        updateStatus("forwarded");
      });
  }

  async function updateStatus(status) {
    await fetch(
      `${useApiStore.getState().apiUrl}reports/${selectedUser.report._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${useLoginStore.getState().token}`,
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    )
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        window.location.reload();
      });
  }

  function getDataByPage(pageNumber) {
    setPage(pageNumber);
    setIsLoading(true);

    fetch(
      `${
        useApiStore.getState().apiUrl
      }reports?page=${pageNumber}&status=no_response`,
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
        }reports?sort=${sortBy}&searchBy=${searchBy}&search=${search}&page=${pageNumber}&status=no_response`,
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
        }reports?searchBy=${searchBy}&search=${search}&page=${pageNumber}&status=no_response`,
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
            <h2>URGENT | Distress Call Logs</h2>
            <p>
              The list of distress call logs is shown below. Remember to send
              the data to concerned authorities as soon as possible.
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
                      {searchBy == "alert_type"
                        ? "Alert Type"
                        : searchBy == "message"
                        ? "Message"
                        : searchBy == "status"
                        ? "Status"
                        : searchBy}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("alert_type")}
                          value="alert_type"
                        >
                          Alert Type
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("message")}
                          value="message"
                        >
                          Message
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => setSearchBy("Search by")}
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
                        <p className="text-uppercase fw-bold">
                          {info.report.type}{" "}
                          <span className="badge bg-danger">NO RES</span>
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
                      <p
                        className={
                          info.report.status == "no_response" ? "fw-bold" : ""
                        }
                      >
                        {info.report.content}
                      </p>
                    </div>
                    <div className="col-2">
                      <p
                        className={
                          info.report.status == "no_response"
                            ? "text-capitalize fw-bold "
                            : "text-capitalize"
                        }
                      >
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
                          ) : info.report.status == "forwarded" ? (
                            <button
                              className="btn btn-light px-3 rounded-5 fw-semibold"
                              onClick={() => {
                                setSelectedUser(info);
                                setIsRespondModal(true);
                              }}
                            >
                              Forwarded
                            </button>
                          ) : info.report.status == "archive" ? (
                            <button
                              className="btn btn-light px-3 rounded-5 fw-semibold"
                              disabled
                            >
                              Responded
                            </button>
                          ) : (
                            <button
                              className="btn btn-danger text-white px-3 rounded-5 fw-semibold"
                              onClick={() => {
                                setSelectedUser(info);
                                setIsRespondModal(true);
                              }}
                            >
                              Respond
                            </button>
                          )}
                        </div>

                        <div className="col">
                          {info.report.status == "archive" ? (
                            <button
                              className="btn btn-light px-4 text-black rounded-5 fw-semibold "
                              onClick={() => {
                                setSelectedUser(info);
                                setIsUnarchiveModal(true);
                              }}
                            >
                              Unarchive
                            </button>
                          ) : info.report.status == "no_response" ? (
                            <button
                              className="btn btn-light px-4 text-black rounded-5 fw-semibold "
                              disabled
                              onClick={() => {
                                setSelectedUser(info);
                                setIsArchiveModal(true);
                              }}
                            >
                              Archive
                            </button>
                          ) : (
                            <button
                              className="btn btn-light px-4 text-black rounded-5 fw-semibold "
                              onClick={() => {
                                setSelectedUser(info);
                                setIsArchiveModal(true);
                              }}
                            >
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
                      {selectedUser.report.status == "forwarded" && (
                        <Button
                          className="btn btn-secondary m-auto px-5"
                          type="button"
                          onClick={() => {
                            updateStatus("responded");
                          }}
                        >
                          Mark as Responded
                        </Button>
                      )}

                      {selectedUser.report.status == "archieve" ||
                        (selectedUser.report.status == "responded" && (
                          <Button
                            className="btn btn-danger m-auto px-5 text-white fw-semibold"
                            type="button"
                            onClick={() => {
                              updateStatus("no_response");
                            }}
                          >
                            Mark as Not Responded
                          </Button>
                        ))}

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

              {isRespondModal && (
                <>
                  <Modal
                    toggle={() => setIsViewModal(!isRespondModal)}
                    isOpen={isRespondModal}
                  >
                    <div className=" modal-header">
                      <h5
                        className=" modal-title text-center m-auto fw-bold"
                        id="viewModal"
                      >
                        Send Distress Call Information to Authorities
                      </h5>
                    </div>
                    <ModalBody>
                      <form>
                        <label>Email Subject:</label>
                        <input
                          className="form-control mt-2"
                          type="text"
                          placeholder="Subject of the Email"
                          defaultValue="[URGENT] Distress Call Alert"
                          id="emailSubject"
                        />
                        <label>Email Content:</label>
                        <textarea
                          className="form-control mt-2"
                          placeholder="Optional Message to the Authorities"
                          id="emailContent"
                        />
                        <label className="mt-4">
                          The distress signal information will be sent to the
                          following:
                        </label>
                        <div className="text-center">
                          {emailInput.map((item, i) => {
                            return (
                              <input
                                className="form-control mt-2"
                                type="email"
                                placeholder="Authority Email Address"
                                onChange={handleChange}
                                value={item.value}
                                id={i}
                              />
                            );
                          })}

                          <button
                            onClick={addEmailInput}
                            className="btn btn-secondary text-center mt-2"
                            onSubmit={null}
                          >
                            + Email Address
                          </button>
                        </div>
                      </form>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-primary m-auto px-5"
                        disabled={
                          emailInput[0].value.includes("@") &&
                          emailInput[0].value.includes(".")
                            ? false
                            : true
                        }
                        color="primary"
                        type="button"
                        onClick={() => {
                          setIsRespondModal(false);
                          resetEmailInput();
                          sendInformation(emailInput);
                        }}
                      >
                        Send Information
                      </Button>

                      <Button
                        className="btn-light m-auto px-5"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsRespondModal(false);
                          resetEmailInput();
                        }}
                      >
                        Back
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              {isArchiveModal && (
                <>
                  <Modal
                    toggle={() => setIsArchiveModal(!isArchiveModal)}
                    isOpen={isArchiveModal}
                  >
                    <div className="modal-header">
                      <h5
                        className="modal-title text-center m-auto fw-bold text-uppercase"
                        id="viewModal"
                      >
                        ARE YOU SURE YOU WANT TO ARCHIVE THIS REPORT?
                      </h5>
                    </div>
                    <ModalBody>
                      <p className="text-center">
                        You can always unarchive this report anytime.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-danger text-white m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsArchiveModal(false);
                          updateStatus("archive");
                        }}
                      >
                        Proceed Archiving
                      </Button>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsArchiveModal(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              {isUnarchiveModal && (
                <>
                  <Modal
                    toggle={() => setIsArchiveModal(!isUnarchiveModal)}
                    isOpen={isUnarchiveModal}
                  >
                    <div className="modal-header">
                      <h5
                        className="modal-title text-center m-auto fw-bold text-uppercase"
                        id="viewModal"
                      >
                        ARE YOU SURE YOU WANT TO UNARCHIVE THIS REPORT?
                      </h5>
                    </div>
                    <ModalBody>
                      <p className="text-center">
                        You can always archive this report anytime.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn-danger text-white m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsUnarchiveModal(false);
                          updateStatus("responded");
                        }}
                      >
                        Proceed Unarchiving
                      </Button>
                      <Button
                        className="btn-light m-auto px-5 fw-semibold"
                        color="secondary"
                        type="button"
                        onClick={() => {
                          setIsUnarchiveModal(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              <ul className="pagination m-auto mt-2">
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

            <div className="d-flex justify-content-center mt-4 mb-5">
              <div className="mx-4">
                <Link
                  type="button"
                  className="btn btn-primary"
                  onClick={null}
                  href="/manage-distress-calls/forwarded"
                >
                  View Forwarded Distress Calls
                </Link>
              </div>

              <div className="mx-4">
                <Link
                  type="button"
                  className="btn btn-primary"
                  onClick={null}
                  href="/manage-distress-calls/archive"
                >
                  View Archive Distress Calls
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}
