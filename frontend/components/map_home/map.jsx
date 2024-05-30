import "leaflet/dist/leaflet.css";
import "./style.css";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import leaflet from "leaflet";
import { FormattedDateTime } from "../formatted-date";
import { useEffect, useRef, useState } from "react";
import {
  alertStatus,
  calculateCenter,
  computeCircleAlertBounds,
} from "../math-function";
import { useRouter } from "next/router";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useUserDataStore } from "../../store/userDataStore";
import { useApiStore } from "../../store/apiStore";
import { useLoginStore } from "../../store/loginStore";
import LoadingPage from "../loading_page";

export default function Map({ markerData, selectedData, data, filter }) {
  const [navigatedData, setNavigatedData] = useState(selectedData);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState();
  const [isRespondModal, setIsRespondModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [isArchiveModal, setIsArchiveModal] = useState(false);
  const [isUnarchiveModal, setIsUnarchiveModal] = useState(false);
  const [isMarkResponded, setIsMarkResponded] = useState(false);
  const [isMarkNotResponded, setIsMarkNotResponded] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  const [latLongInput, setLatLongInput] = useState([
    {
      type: "text",
      id: 1,
      value: "",
    },
  ]);

  const [emailInput, setEmailInput] = useState([
    {
      type: "text",
      id: 1,
      value: "",
    },
  ]);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    if (navigatedData !== null) {
      if (filter == "fisherfolk") {
        markerData.map((marker) => {
          if (marker.user._id == navigatedData) {
            setNavigatedData(marker);
          }
        });
      } else if (filter == "alerts") {
        data.map((item) => {
          if (item._id == navigatedData) {
            setNavigatedData(item);
          }
        });
      } else if (filter == "reports") {
        data.map((item) => {
          if (item.report._id == navigatedData) {
            setNavigatedData(item);
          }
        });
      }
      setIsMapLoading(false);
    }
    setIsMapLoading(false);
  }, []);

  const locationMarker = leaflet.icon({
    iconUrl: "/images/fishing.png",
    iconSize: [35, 33],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const reportMarker = leaflet.icon({
    iconUrl: "/images/alert-sign.png",
    iconSize: [35, 33],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const specifiedData = leaflet.icon({
    iconUrl: "/images/fishing.png",
    iconSize: [45, 43],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });


  function centerLatLong() {
    if (filter == "fisherfolk" && navigatedData !== null && navigatedData !== undefined) {
      console.log("navigated data ========> " + navigatedData);
      return [
        Number(navigatedData.position.latitude),
        Number(navigatedData.position.longitude),
      ];
    } else if (filter == "alerts" && navigatedData !== null) {
      if (navigatedData.location.length == 1) {
        return [navigatedData.location[0][1], navigatedData.location[0][0]];
      } else {
        return calculateCenter(navigatedData.location);
      }
    } else if (filter == "reports" && navigatedData !== null) {
      return [
        navigatedData.positionInfo.latitude,
        navigatedData.positionInfo.longitude,
      ];
    }

    return [12.8797, 121.774];
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
      <p>Please be informed that there is an emergency situation for a fisherfolk that needs your attention. Below are the details of the distres call alert.</p>
      
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
        router.push({
          pathname: "/map-redirect",
          query: {
            filterValue: "reports",
            dataId: selectedUser.report._id
         },
        });
      });
  }

  function editAlert() {
    let locationList = [];

    latLongInput.map((loc) => {
      let str = loc.value.trim();
      str = str.split(",").map(parseFloat);
      locationList.push(str);
    });

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
        location: locationList,
        level: document.getElementById("level").value,
        isSpecific: isSpecific,
        radius: parseFloat(document.getElementById("c_radius").value),
        // specified_user: document.getElementById("c_birthday").value,
        // notified_user: document.getElementById("c_password").value,
        effective: document.getElementById("effective").value,
        expires: document.getElementById("expiry").value,
        instruction: document.getElementById("instruction").value,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        router.push({
          pathname: "/map-redirect",
          query: {
            filterValue: "alerts",
            dataId: selectedUser._id
          }
        })
      });
  }

  function addLatLongInput(e) {
    e.preventDefault();

    setLatLongInput((info) => {
      return [
        ...info,
        {
          type: "text",
          value: "",
        },
      ];
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

  return !isMapLoading ? (
    <>
      <MapContainer
        className="map2"
        center={centerLatLong()}
        zoom={navigatedData == null ? 6 : 10}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {filter == "alerts" &&
          data.map((alert) => (
            <Polygon
              positions={
                alert.location.length == 1
                  ? computeCircleAlertBounds(
                      alert.location[0][0],
                      alert.location[0][1],
                      alert.radius
                    )
                  : alert.location
              }
              color={
                alertStatus(alert.effective, alert.expires) == "active"
                  ? "red"
                  : alertStatus(alert.effective, alert.expires) == "expired"
                  ? "grey"
                  : "yellow"
              }
              weight={2}
              fillOpacity={0.4}
            >
              <Popup>
                <div className="text-center">
                  <h5>{alert.title}</h5>
                  <p className="fst-italic mt-0">{alert.description}</p>
                  <hr />

                  <table>
                    <tr>
                      <th>Level:</th>
                      <td>
                        {alert.level.charAt(0).toUpperCase()}
                        {alert.level.substring(1)}
                      </td>
                    </tr>
                    <tr>
                      <th>Instruction:</th>
                      <td>{alert.instruction}</td>
                    </tr>
                    <tr>
                      <th>Position:</th>
                      <td>
                        {alert.location.map((loc) => {
                          return `[${loc[0]}, ${loc[1]}]`;
                        })}
                      </td>
                    </tr>
                    {alert.location.length == 1 && (
                      <tr>
                        <th>Radius of Alert:</th>
                        <td>{alert.radius} Kilometers</td>
                      </tr>
                    )}
                    <tr>
                      <th>Effective:</th>
                      <td>
                        <FormattedDateTime date={alert.effective} />
                      </td>
                    </tr>
                    <tr>
                      <th>Expiry:</th>
                      <td>
                        <FormattedDateTime date={alert.expires} />
                      </td>
                    </tr>
                    {alert.isSpecific && (
                      <tr>
                        <th>Specified Target:</th>
                        <td>Feature Not Working</td>
                      </tr>
                    )}

                    <tr>
                      <th>Notified Users:</th>
                      <td>Feature Not Working</td>
                    </tr>
                  </table>
                  <hr />

                  <div className="text-center py-2">
                    <button
                      className="btn btn-secondary text-white fw-bold"
                      onClick={() => {
                        setSelectedUser(alert);
                        setIsEditModal(true);

                        let locationInfo = [];

                        alert.location.map((loc, index) => {
                          locationInfo.push({
                            id: index,
                            value: `${loc[0]}, ${loc[1]}`,
                          });
                        });

                        setLatLongInput(locationInfo);
                      }}
                    >
                      Edit Alert Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {markerData.map((marker, index) => (
          <Marker
            key={index}
            position={[
              Number(marker.position.latitude),
              Number(marker.position.longitude),
            ]}
            icon={
              marker.user._id == selectedData ? specifiedData : locationMarker
            }
          >
            <Popup>
              <div>
                <h5 className="text-center fw-bold text-uppercase  py-1">
                  {marker.user.first_name} {marker.user.last_name}
                </h5>

                <hr />

                <table>
                  <tr>
                    <th>Longitude:</th>
                    <td>{marker.position.longitude}</td>
                  </tr>
                  <tr>
                    <th>Latitude:</th>
                    <td>{marker.position.latitude}</td>
                  </tr>
                  <tr>
                    <th>Last Located:</th>
                    <td>
                      <FormattedDateTime date={marker.position.timestamp} />
                    </td>
                  </tr>
                  <tr>
                    <th>Fishing Vessel Type:</th>
                    <td>
                      {marker.user.fishing_vessel_type.charAt(0).toUpperCase()}
                      {marker.user.fishing_vessel_type.substring(1)}
                    </td>
                  </tr>
                  <tr>
                    <th>Email Address:</th>
                    <td>{marker.user.email_address}</td>
                  </tr>
                  <tr>
                    <th>Contact Number:</th>
                    <td>{marker.user.contact_number}</td>
                  </tr>
                  <tr>
                    <th>Address:</th>
                    <td>{marker.user.address}</td>
                  </tr>
                  <tr>
                    <th>Region:</th>
                    <td>{marker.user.region}</td>
                  </tr>
                </table>

                <hr />

                <div className="text-center py-2">
                  <button className="btn btn-danger text-white fw-bold">
                    Send Notification
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {filter == "reports" &&
          data.map((report, index) => (
            <Marker
              key={index}
              position={[
                report.positionInfo.latitude,
                report.positionInfo.longitude,
              ]}
              icon={reportMarker}
            >
              <Popup>
                <div>
                  <h5 className="text-center fw-bold text-uppercase  py-1">
                    {report.report.type}
                  </h5>

                  <hr />

                  <table>
                    <tr>
                      <th>Name:</th>
                      <td>
                        {report.userInfo.first_name} {report.userInfo.last_name}
                      </td>
                    </tr>
                    <tr>
                      <th>Message:</th>
                      <td>{report.report.content}</td>
                    </tr>
                    <tr>
                      <th>Status:</th>
                      <td className="fw-bold text-uppercase text-danger">
                        {report.report.status == "no_response" ? "no response" : report.report.status}
                      </td>
                    </tr>
                    <tr>
                      <th>Longitude:</th>
                      <td>{report.positionInfo.longitude}</td>
                    </tr>
                    <tr>
                      <th>Latitude:</th>
                      <td>{report.positionInfo.latitude}</td>
                    </tr>
                    <tr>
                      <th>Date Located:</th>
                      <td>
                        <FormattedDateTime
                          date={report.positionInfo.timestamp}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>Fishing Vessel Type:</th>
                      <td>
                        {report.userInfo.fishing_vessel_type
                          .charAt(0)
                          .toUpperCase()}
                        {report.userInfo.fishing_vessel_type.substring(1)}
                      </td>
                    </tr>
                    <tr>
                      <th>Email Address:</th>
                      <td>{report.userInfo.email_address}</td>
                    </tr>
                    <tr>
                      <th>Contact Number:</th>
                      <td>{report.userInfo.contact_number}</td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>{report.userInfo.address}</td>
                    </tr>
                  </table>

                  <hr />

                  <div className="text-center py-2">
                    {report.report.status == "no_response" && (
                      <button
                        className="btn btn-danger text-white fw-bold"
                        onClick={() => {
                          setSelectedUser(report);
                          setIsRespondModal(true);
                        }}
                      >
                        Respond
                      </button>
                    )}

                    {report.report.status == "forwarded" && (
                      <>
                        <button
                          className="btn btn-secondary text-white fw-bold"
                          onClick={() => {
                            setIsMarkResponded(true);
                          }}
                        >
                          Mark As Responded
                        </button>

                        <button
                          className="btn btn-secondary text-white fw-bold mx-2"
                          onClick={() => {
                            setSelectedUser(report);
                            setIsRespondModal(true);
                          }}
                        >
                          Respond
                        </button>
                      </>
                    )}

                    {report.report.status == "responded" && (
                      <>
                        <button
                          className="btn btn-secondary text-white"
                          onClick={() => {
                            setSelectedUser(report);
                            setIsMarkNotResponded(true);
                          }}
                        >
                          Mark Not Responded
                        </button>

                        <button
                          className="btn btn-secondary text-white mx-3"
                          onClick={() => {
                            setSelectedUser(report);
                            setIsArchiveModal(true);
                          }}
                        >
                          Archive
                        </button>
                      </>
                    )}

                    {report.report.status == "archive" && (
                      <button
                        className="btn btn-secondary text-white fw-bold mx-3"
                        onClick={() => {
                          setSelectedUser(report);
                          setIsUnarchiveModal(true);
                        }}
                      >
                        Unarchive
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

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
                  The distress signal information will be sent to the following:
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

      {isMarkResponded && (
        <>
          <Modal
            toggle={() => setIsMarkResponded(!isMarkResponded)}
            isOpen={isMarkResponded}
          >
            <div className="modal-header">
              <h5
                className="modal-title text-center m-auto fw-bold text-uppercase"
                id="viewModal"
              >
                ARE YOU SURE YOU WANT TO MARK THIS REPORT AS RESPONDED?
              </h5>
            </div>
            <ModalBody>
              <p className="text-center">
                You can always mark this report as "not responded" anytime.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                className="btn-danger text-white m-auto px-5 fw-semibold"
                color="secondary"
                type="button"
                onClick={() => {
                  setIsMarkResponded(false);
                  updateStatus("responded");
                }}
              >
                Proceed
              </Button>
              <Button
                className="btn-light m-auto px-5 fw-semibold"
                color="secondary"
                type="button"
                onClick={() => {
                  setIsMarkResponded(false);
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )}

      {isMarkNotResponded && (
        <>
          <Modal
            toggle={() => setIsMarkNotResponded(!isMarkNotResponded)}
            isOpen={isMarkNotResponded}
          >
            <div className="modal-header">
              <h5
                className="modal-title text-center m-auto fw-bold text-uppercase"
                id="viewModal"
              >
                ARE YOU SURE YOU WANT TO MARK THIS REPORT AS NOT RESPONDED?
              </h5>
            </div>
            <ModalBody>
              <p className="text-center">
                You can always mark this report as "responded" anytime.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                className="btn-danger text-white m-auto px-5 fw-semibold"
                color="secondary"
                type="button"
                onClick={() => {
                  setIsMarkNotResponded(false);
                  updateStatus("no_response");
                }}
              >
                Proceed
              </Button>
              <Button
                className="btn-light m-auto px-5 fw-semibold"
                color="secondary"
                type="button"
                onClick={() => {
                  setIsMarkNotResponded(false);
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
                    <label htmlFor="c_location" className="label">
                      Enter Longitude and Latitude Pair (separated by comma)
                    </label>

                    <div className="text-center">
                      {latLongInput.map((item, i) => {
                        return (
                          <input
                            className="form-control mt-2"
                            type="text"
                            placeholder="Longitude, Latitude"
                            onChange={handleChange}
                            value={item.value}
                            id={i}
                          />
                        );
                      })}

                      <button
                        onClick={addLatLongInput}
                        className="btn btn-secondary text-center mt-2"
                        onSubmit={null}
                      >
                        + Longitude Latitude Pair
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 mt-3">
                    <label htmlFor="c_radius" className="label">
                      Enter Radius
                    </label>
                    <input
                      disabled={latLongInput.length == 1 ? false : true}
                      type="number"
                      id="c_radius"
                      className="form-control"
                      placeholder="Radius"
                      name="c_radius"
                      defaultValue={selectedUser.radius}
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
    </>
  ) : (
    <LoadingPage />
  );
}
