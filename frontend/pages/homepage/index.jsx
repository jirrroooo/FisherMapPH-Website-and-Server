import Navbar from "/components/navbar";
import "./style.css";
import "../../styles/custom.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import { useUserDataStore } from "../../store/userDataStore";
import { useApiStore } from "../../store/apiStore";
import LoadingPage from "../../components/loading_page";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLng } from "leaflet";
import Map from "../../components/map/map";
import MapHome from "../../components/map_home";

export default function Homepage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [totalFisherfolkUsers, setTotalFisherfolkUsers] = useState(0);
  const [totalFisherfolkPendingUsers, setTotalFisherfolkPendingUsers] =
    useState(0);
  const [totalAdminPendingUsers, setTotalAdminPendingUsers] = useState(0);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [markerData, setMarkerData] = useState(0);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    // Verify the the cookie
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
          getStatistics();
        }
      });
  }

  function getData() {
    fetch(
      `${useApiStore.getState().apiUrl}users/${useLoginStore.getState().id}`,
      {
        headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const { password, ...user } = data;
          useUserDataStore.setState({ userData: user });
          setName(user.first_name);
          setIsLoading(false);
        }
      });
  }

  async function getStatistics() {
    // Total Fisherfolk Pending Users
    await fetch(
      `${useApiStore.getState().apiUrl}users/total-fisherfolk-pending-users`,
      {
        headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTotalFisherfolkPendingUsers(data);
      });

    // Total Fisherfolk Users
    await fetch(
      `${useApiStore.getState().apiUrl}users/total-fisherfolk-users`,
      {
        headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTotalFisherfolkUsers(data);
      });

    // Total Admin Pending Users
    await fetch(
      `${useApiStore.getState().apiUrl}users/total-admin-pending-users`,
      {
        headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTotalAdminPendingUsers(data);
      });

    // Total Alerts
    await fetch(`${useApiStore.getState().apiUrl}alerts/total`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalAlerts(data);
      });

    // Total Reports
    await fetch(`${useApiStore.getState().apiUrl}reports/total`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalReports(data);
      });

      getFisherfolkLogs();
  }

  async function getFisherfolkLogs() {
    await fetch(`${useApiStore.getState().apiUrl}logs/fisherfolkLogs`, {
      headers: {
        Authorization: `Bearer ${useLoginStore.getState().token}`,
      },
    })
      .then((response) => response.json())
      .then((body) => {
        if (body) {
          setMarkerData(body);
          // getMapData(filter);
        }
      });

    getData();
  }

  return (
    <>
      {!isLoading ? (
        <>
          <Navbar />
          <div className="container mt-4 text-center">
            <h2 className="text-uppercase">WELCOME {name}!</h2>
            <p>
            Our goal is to provide an organized platform that increases the security and broaden the linkages among the fisherfolk in the Philippines.
            </p>
            <div className="row mt-5">
              <div className="col-6 container-fluid">
                <div className="row mt-2">
                  <div className="col-6">
                    <div className="card" style={{ width: "16rem" }}>
                      <div className="card-body">
                        <h1>{totalFisherfolkPendingUsers}</h1>
                        <p>Pending Fisherfolk Accounts</p>
                        <Link
                          className="btn btn-warning admin-btn"
                          href="/manage-accounts/fisherfolk-applications"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="card" style={{ width: "16rem" }}>
                      {useUserDataStore.getState().userData.user_type ==
                      "superadmin" ? (
                        <div className="card-body">
                          <h1>{totalAdminPendingUsers}</h1>
                          <p>Pending Admin Accounts</p>
                          <Link
                            className="btn btn-warning admin-btn"
                            href="/manage-accounts/admin-applications"
                          >
                            Manage
                          </Link>
                        </div>
                      ) : (
                        <div className="card-body">
                          <h1>{totalFisherfolkUsers}</h1>
                          <p>Fisherfolk Active Accounts</p>
                          <Link
                            className="btn btn-warning admin-btn"
                            href="/manage-accounts/fisherfolk-applications"
                          >
                            Manage
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mt-3 ">
                  <div className="col-6">
                    <div className="card" style={{ width: "16rem" }}>
                      <div className="card-body">
                        <h1>{totalAlerts}</h1>
                        <p>List of Alerts</p>
                        <Link
                          className="btn btn-warning admin-btn"
                          href="/manage-alerts"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="card" style={{ width: "16rem" }}>
                      <div className="card-body">
                        <h1>{totalReports}</h1>
                        <p>Distress Call Logs</p>
                        <Link
                          className="btn btn-warning admin-btn"
                          href="/manage-distress-calls"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 container">
                <div className="mt-0 p-0">
                <MapHome
                    className="home_map"
                    markerData={markerData}
                    selectedData={markerData[0]}
                    filter={'fisherfolk'}
                  />
                </div>
                <div className="row-4 mt-3">
                  <button
                    className="btn btn-secondary px-4 py-2 fw-bold"
                    onClick={() => {
                      router.push("/map");
                    }}
                  >
                    View Map
                  </button>
                </div>
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
