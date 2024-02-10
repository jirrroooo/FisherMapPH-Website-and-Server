import "leaflet/dist/leaflet.css";
import "./style.css";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import leaflet from "leaflet";
import { FormattedDateTime } from "../formatted-date";
import { useEffect, useRef, useState } from "react";
import { computeCircleAlertBounds } from "../math-function";

export default function Map({ markerData, selectedUser }) {
  const [navigatedUser, setNavigatedUser] = useState(selectedUser);
  // const [selectedMarkerKey, setSelectedMarkerKey] = useState(null);

  if (navigatedUser !== null) {
    markerData.map((marker, index) => {
      if (marker.user._id == navigatedUser) {
        setNavigatedUser(marker);
        // setSelectedMarkerKey(index);
      }
    });
  }

  const locationMarker = leaflet.icon({
    iconUrl: "/images/fishing.png",
    iconSize: [35, 33],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const specifiedUser = leaflet.icon({
    iconUrl: "/images/fishing.png",
    iconSize: [45, 43],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const highlightRegionCoords = [
    [13.20870230810157, 123.76437937089966],
    [13.23096246883873, 123.77829092490903],
    [13.238278301654173, 123.78996383804328],
    [13.235476519299738, 123.7936416051952],
    [13.237188723457038, 123.80323578037405],
    [13.224424730275908, 123.80259616869547],
    [13.221467124281572, 123.80803286796349],
    [13.189398147625427, 123.92204364967218],
    [13.180835330252302, 123.870395006626],
    [13.176475962631182, 123.81874636357988],
    [13.180835330252302, 123.80755315920455],
    [13.20885798061333, 123.76453927381931],
    [13.20870230810157, 123.76437937089966],
  ];

  const testPolygon = computeCircleAlertBounds(123.5933, 17.0972, 100);
  // console.log(testPolygon);

  return (
    <>
      <MapContainer
        className="map"
        center={
          navigatedUser == null || typeof navigatedUser == "string"
            ? [12.8797, 121.774]
            : [
                Number(navigatedUser.position.longitude),
                Number(navigatedUser.position.latitude),
              ]
        }
        zoom={navigatedUser == null ? 6 : 10}
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

        <Polygon
          positions={testPolygon}
          color="red"
          weight={2}
          fillOpacity={0.4}
        >
          <Popup>
            <div className="text-center">
              <h5>Test Alert Bounds</h5>
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

        {markerData.map((marker, index) => (
          <Marker
            key={index}
            position={[
              Number(marker.position.longitude),
              Number(marker.position.latitude),
            ]}
            icon={
              marker.user._id == selectedUser ? specifiedUser : locationMarker
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
      </MapContainer>
    </>
  );
}
