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
    iconUrl: "/images/locationMarker.png",
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

  const highlightRegionCoords = [
    [13.702603265716432, 120.376],
    [13.680032009366771, 120.48517506448952],
    [13.61623270924969, 120.57541912503848],
    [13.522264027022588, 120.63111049194109],
    [13.414398428309134, 120.64264943276204],
    [13.311292362641494, 120.60809774208019],
    [13.230757006602852, 120.53347599112067],
    [13.18668982339389, 120.43169236987791],
    [13.18668982339389, 120.32030763012209],
    [13.230757006602852, 120.21852400887934],
    [13.311292362641492, 120.14390225791982],
    [13.414398428309134, 120.10935056723797],
    [13.522264027022588, 120.12088950805892],
    [13.61623270924969, 120.17658087496153],
    [13.680032009366771, 120.26682493551048],
  ];

  const testPolygon = computeCircleAlertBounds(121.398, 17.076, 100);
  const testPoint = [13.430128975912996, 120.37884795601274];

  function centerLatLong() {
    if (filter == "fisherfolk" && navigatedData !== null) {
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
      console.log(navigatedData);
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
          <th>Sea Depth</th>
          <td> ${parseFloat(
            selectedUser.positionInfo.sea_depth.toFixed(4)
          )} meters</td>
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

        router.push({
          pathname: "/map-redirect",
          query: {filterValue: "reports"}
        });
      });
  }

  return !isMapLoading ? (
    <>
      <MapContainer
        className="map"
        center={centerLatLong()}
        zoom={navigatedData == null ? 6 : 10}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polygon
          positions={highlightRegionCoords}
          color="blue"
          weight={2}
          fillOpacity={0.4}
        >
          <Popup>
            <div className="text-center">
              <h5>Santo Domingo Municipal Water</h5>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                sunt eius eum ipsum magnam doloribus, iusto porro corporis iure
                tempora? Aliquid sint voluptatum amet, laboriosam expedita aut
                officiis sapiente ut.
              </p>
              <button className="btn btn-secondary">View Information</button>
            </div>
          </Popup>
        </Polygon>

        <Marker
          key={9999}
          position={calculateCenter(highlightRegionCoords)}
          icon={reportMarker}
        >
          <Popup>
            <div>
              <h5 className="text-center fw-bold text-uppercase  py-1">
                TEST CENTER
              </h5>

              <div className="text-center py-2">
                <button className="btn btn-danger text-white fw-bold">
                  Send Alert
                </button>
              </div>
            </div>
          </Popup>
        </Marker>

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
                      className="btn btn-danger text-white fw-bold"
                      onClick={() => router.push("manage-accounts")}
                    >
                      Edit Alert
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
                    <th>Sea Depth:</th>
                    <td>{marker.position.sea_depth.toFixed(4)}</td>
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
                </table>

                <hr />

                <div className="text-center py-2">
                  <button className="btn btn-danger text-white fw-bold">
                    Send Alert
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
                        {report.report.status}
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
                      <th>Sea Depth:</th>
                      <td>{report.positionInfo.sea_depth.toFixed(4)}</td>
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
                          className= "btn btn-secondary text-white fw-bold mx-2"
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
    </>
  ) : (
    <div className="mapLoader">
      <div className="text-center">
        <h1>Map Loading...</h1>
      </div>
      <div className="loader m-auto"></div>
    </div>
  );
}
