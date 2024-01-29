import "leaflet/dist/leaflet.css";
import "./style.css";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import leaflet from "leaflet";

// import locationImage from '/images/locationMarker.png';

export default function Map({ markers }) {
  const locationMarker = leaflet.icon({
    iconUrl: "/images/fishing.png",
    iconSize: [35, 33],
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

  return (
    <>
      <MapContainer
        className="map"
        center={[12.8797, 121.7740]}
        zoom={6}
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

        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={locationMarker}>
            <Popup>
              <div className="text-center">
                <h5>{marker.text}</h5>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  sunt eius eum ipsum magnam doloribus, iusto porro corporis
                  iure tempora? Aliquid sint voluptatum amet, laboriosam
                  expedita aut officiis sapiente ut.
                </p>
                <button className="btn btn-secondary">Send Alert</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
