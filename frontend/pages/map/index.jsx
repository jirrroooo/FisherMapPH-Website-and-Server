import React, { useEffect, useState } from "react";
import Map from "../../components/map/index";
import { useApiStore } from "../../store/apiStore";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import Navbar from "../../components/navbar";
import Image from "next/image";
import "./style.css";
import LoadingPage from "../../components/loading_page";
import { useUserDataStore } from "../../store/userDataStore";

export default function FisherMap() {
  const router = useRouter();

  const filterValue =
    router.query.filterValue === null ||
    router.query.filterValue === undefined ||
    router.query.filterValue === ""
      ? "fisherfolk"
      : router.query.filterValue;

  const [isVerified, setIsVerified] = useState(false);
  const [filter, setFilter] = useState(filterValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isSearchInterfaceLoading, setIsSearchInterfaceLoading] =
    useState(false);
  const [data, setData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("Search by");
  const [search, setSearch] = useState("");
  const [markerData, setMarkerData] = useState();
  const [selectedData, setSelectedData] = useState(null);
  const [adminRegion, setAdminRegion] = useState(null);
  const [userType, setUserType] = useState(null);

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

    if (router.query.dataId) {
      setSelectedData(router.query.dataId);
    }
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
          getAdminRegionAndUserType(token);
        }
      });
  }

  async function getAdminRegionAndUserType(token) {
    fetch(
      `${useApiStore.getState().apiUrl}users/${useLoginStore.getState().id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setUserType(data.user_type);
          setAdminRegion(data.region);
          getData(data.user_type, data.region);
        }
      });
  }

  async function getData(type, reg) {
    let linkString = "";

    if (filter == "fisherfolk") {
      linkString = "users/fisherfolk-users";
    } else if (filter == "alerts") {
      linkString = "alerts";
    } else {
      linkString = "reports";
    }

    if (filter == "fisherfolk") {
      await fetch(
        `${
          useApiStore.getState().apiUrl
        }${linkString}?userType=${type}&adminRegion=${reg}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          getFisherfolkLogs(type, reg);
        });
    } else {
      await fetch(`${useApiStore.getState().apiUrl}${linkString}`, {
        headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
      })
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          getFisherfolkLogs(type, reg);
        });
    }
  }

  async function getFisherfolkLogs(type, reg) {
    await fetch(
      `${
        useApiStore.getState().apiUrl
      }logs/fisherfolkLogs?userType=${type}&adminRegion=${reg}`,
      {
        headers: {
          Authorization: `Bearer ${useLoginStore.getState().token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((body) => {
        if (body) {
          setMarkerData(body);
          getMapData(filter);
        }
      });
  }

  async function getDataByFilter(x) {
    let linkString = "";

    if (x == "fisherfolk") {
      linkString = "users/fisherfolk-users";
    } else if (x == "alerts") {
      linkString = "alerts";
    } else {
      linkString = "reports";
    }

    if (x == "fisherfolk") {
      await fetch(
        `${
          useApiStore.getState().apiUrl
        }${linkString}?userType=${userType}&adminRegion=${adminRegion}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          setIsLoading(false);
          setIsSearchInterfaceLoading(false);
        });
    } else {
      await fetch(`${useApiStore.getState().apiUrl}${linkString}`, {
        headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
      })
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          setIsLoading(false);
          setIsSearchInterfaceLoading(false);
        });
    }
  }

  async function getSearchedData(input) {
    setIsLoading(true);
    setSearch(input);
    let linkString = "";

    if (filter == "fisherfolk") {
      linkString = `users/fisherfolk-users`;
      setSearchBy("first_name");
    } else if (filter == "alerts") {
      linkString = "alerts";
      setSearchBy("title");
    } else {
      linkString = "reports";
      setSearchBy("alert_type");
    }

    if (document.getElementById("search").value == "") {
      setSearchBy("Search by");
    }

    if (searchBy != "Search by" && filter == "fisherfolk") {
      await fetch(
        `${
          useApiStore.getState().apiUrl
        }${linkString}?searchBy=${searchBy}&search=${input}&page=${page}&userType=${userType}&adminRegion=${adminRegion}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          setIsLoading(false);
        });
    } else if (searchBy != "Search by" && filter != "fisherfolk") {
      await fetch(
        `${
          useApiStore.getState().apiUrl
        }${linkString}?searchBy=${searchBy}&search=${input}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          setIsLoading(false);
        });
    } else if (searchBy == "Search by") {
      getData();
    }
  }

  function getDataByPage(pageNumber) {
    let linkString = "";

    if (filter == "fisherfolk") {
      linkString = "users/fisherfolk-users";
    } else if (filter == "alerts") {
      linkString = "alerts";
    } else {
      linkString = "reports";
    }

    setPage(pageNumber);
    setIsLoading(true);

    if (filter == "fisherfolk") {
      fetch(
        `${
          useApiStore.getState().apiUrl
        }${linkString}?page=${pageNumber}&userType=${userType}&adminRegion=${adminRegion}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          setIsLoading(false);
        });
    } else {
      fetch(
        `${useApiStore.getState().apiUrl}${linkString}?page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          setIsLoading(false);
        });
    }
  }

  async function getSearchedDataByPageNumber(pageNumber, input) {
    setIsLoading(true);
    setSearch(input);
    let linkString = "";

    if (filter == "fisherfolk") {
      linkString = "users/fisherfolk-users";
      setSearchBy("first_name");
    } else if (filter == "alerts") {
      linkString = "alerts";
      setSearchBy("title");
    } else {
      linkString = "reports";
      setSearchBy("alert_type");
    }

    setPage(pageNumber);

    if (searchBy != "Search by" && filter == "fisherfolk") {
      await fetch(
        `${
          useApiStore.getState().apiUrl
        }${linkString}?searchBy=${searchBy}&search=${input}&page=${pageNumber}&userType=${userType}&adminRegion=${adminRegion}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          setIsLoading(false);
        });
    } else if (searchBy != "Search by" && filter != "fisherfolk") {
      await fetch(
        `${
          useApiStore.getState().apiUrl
        }${linkString}?searchBy=${searchBy}&search=${input}&page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setData(body);
          setIsLoading(false);
        });
    } else if (searchBy == "Search by") {
      getDataByPage(pageNumber);
    }
  }

  async function handleDataChange(filter) {
    setIsSearchInterfaceLoading(true);
    setIsMapLoading(true);
    setSelectedData(null);

    await getMapData(filter);

    setTimeout(() => {
      setIsMapLoading(false);
    }, 500);

    setPage(1);
    setFilter(filter);
    data == null;

    await getDataByFilter(filter);
  }

  async function getMapData(filter) {
    console.log("type: " + userType + " reg: " + adminRegion);
    let linkString = "";

    if (filter == "fisherfolk") {
      await fetch(
        `${
          useApiStore.getState().apiUrl
        }users/fisherfolk-users?userType=${userType}&adminRegion=${adminRegion}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
          setMapData(body);
          setIsLoading(false);
        });
    } else {
      if (filter == "alerts") {
        linkString = "alerts?map=true";
      } else {
        linkString = "reports?map=true";
      }
      await fetch(`${useApiStore.getState().apiUrl}${linkString}`, {
        headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
      })
        .then((response) => response.json())
        .then((body) => {
          setMapData(body);
          setIsLoading(false);
        });
    }
  }

  function handleSearch() {
    getSearchedData(document.getElementById("search").value);
  }

  const handleNextPage = () => {
    setSelectedData(null);

    if (searchBy != "Search by") {
      getSearchedDataByPageNumber(
        page + 1,
        document.getElementById("search").value
      );
    } else {
      getDataByPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    setSelectedData(null);

    if (searchBy != "Search by") {
      getSearchedDataByPageNumber(
        page - 1,
        document.getElementById("search").value
      );
    } else {
      getDataByPage(page - 1);
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleNavigate(dataId, filter) {
    let checker = false;

    if (filter == "fisherfolk") {
      markerData.map((marker) => {
        if (marker.user._id == dataId) {
          checker = true;
        }
      });
    } else if (filter == "alerts") {
      mapData.map((marker) => {
        if (marker._id == dataId) {
          checker = true;
        }
      });
    } else if (filter == "reports") {
      mapData.map((marker) => {
        if (marker.report._id == dataId) {
          checker = true;
        }
      });
    }

    setIsMapLoading(true);

    setSelectedData(checker ? dataId : null);

    setTimeout(() => {
      setIsMapLoading(false);
    }, 500);

    if (!checker) {
      alert("Navigation Failed: No logged position yet for the account.");
    }
  }

  return (
    <>
      {!isLoading ? (
        <>
          <Navbar />
          <div className="row">
            <div className="col-5 container mt-0 ">
              {!isSearchInterfaceLoading ? (
                <>
                  {/* <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="row mx-2">
                      <div className="col-10">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={
                            filter == "fisherfolk"
                              ? "Enter Fisherfolk Name"
                              : filter == "alerts"
                              ? "Enter Alert Title"
                              : "Enter Report Title"
                          }
                          name="search"
                          id="search"
                        />
                        <div className="row mx-2 my-2">
                          <div className="col-3 my-1">
                            <p className="fw-bold">Search by:</p>
                          </div>

                          <div
                            className="col-3 d-flex btn p-0 my-1 text-center "
                            onClick={() => {
                              handleDataChange("fisherfolk");
                            }}
                          >
                            <Image
                              src="/images/fishing.png"
                              width={20}
                              height={20}
                              alt=""
                            />
                            <p
                              className={
                                filter == "fisherfolk"
                                  ? "mx-2 p-0 text-center fw-bold"
                                  : "mx-2 p-0 text-center"
                              }
                            >
                              Fisherfolk
                            </p>
                          </div>

                          <div
                            className="col-2 d-flex btn p-0 my-1 text-center"
                            onClick={() => {
                              handleDataChange("alerts");
                            }}
                          >
                            <Image
                              src="/images/alert-sign.png"
                              width={20}
                              height={20}
                              alt=""
                            />
                            <p
                              className={
                                filter == "alerts"
                                  ? "mx-2 p-0 text-center fw-bold"
                                  : "mx-2 p-0 text-center"
                              }
                            >
                              Alerts
                            </p>
                          </div>
                          <div
                            className="col-3 d-flex btn p-0 my-1 text-center mx-2"
                            onClick={() => {
                              handleDataChange("reports");
                            }}
                          >
                            <Image
                              src="/images/urgent.png"
                              width={20}
                              height={20}
                              alt=""
                            />
                            <p
                              className={
                                filter == "reports"
                                  ? "mx-2 p-0 text-center fw-bold"
                                  : "mx-2 p-0 text-center"
                              }
                            >
                              Reports
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-2">
                        <button
                          id="searchBtn"
                          type="button"
                          className="btn btn-primary fw-bold px-3"
                          onClick={() => {
                            handleSearch();
                          }}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </form> */}

                  <div className="row mx-2 my-2 mt-5">
                    <div className="col-3 my-1">
                      <p className="fw-bold">Options:</p>
                    </div>

                    <div
                      className="col-3 d-flex btn p-0 my-1 text-center "
                      onClick={() => {
                        handleDataChange("fisherfolk");
                      }}
                    >
                      <Image
                        src="/images/fishing.png"
                        width={20}
                        height={20}
                        alt=""
                      />
                      <p
                        className={
                          filter == "fisherfolk"
                            ? "mx-2 p-0 text-center fw-bold"
                            : "mx-2 p-0 text-center"
                        }
                      >
                        Fisherfolk
                      </p>
                    </div>

                    <div
                      className="col-2 d-flex btn p-0 my-1 text-center"
                      onClick={() => {
                        handleDataChange("alerts");
                      }}
                    >
                      <Image
                        src="/images/alert-sign.png"
                        width={20}
                        height={20}
                        alt=""
                      />
                      <p
                        className={
                          filter == "alerts"
                            ? "mx-2 p-0 text-center fw-bold"
                            : "mx-2 p-0 text-center"
                        }
                      >
                        Alerts
                      </p>
                    </div>
                    <div
                      className="col-3 d-flex btn p-0 my-1 text-center mx-2"
                      onClick={() => {
                        handleDataChange("reports");
                      }}
                    >
                      <Image
                        src="/images/urgent.png"
                        width={20}
                        height={20}
                        alt=""
                      />
                      <p
                        className={
                          filter == "reports"
                            ? "mx-2 p-0 text-center fw-bold"
                            : "mx-2 p-0 text-center"
                        }
                      >
                        Reports
                      </p>
                    </div>
                  </div>

                  <div className="card mt-3 p-2 mx-4">
                    <div className="row text-center my-1">
                      <div className="col-4">
                        <h6>{filter == "fisherfolk" ? "Name" : "Title"}</h6>
                      </div>
                      <div className="col-4">
                        <h6>
                          {filter == "fisherfolk"
                            ? "Vessel Type"
                            : "Description"}
                        </h6>
                      </div>
                      <div className="col-4">
                        <h6>Action</h6>
                      </div>
                    </div>

                    <br />

                    {filter == "fisherfolk" &&
                      data.map((info) => {
                        return (
                          <div
                            className="row student-data text-center my-1"
                            key={info._id}
                          >
                            <div className="col-4">
                              <p>
                                {info.first_name} {info.last_name}
                              </p>
                            </div>
                            <div className="col-4">
                              <p>
                                {info.fishing_vessel_type
                                  .charAt(0)
                                  .toUpperCase()}
                                {info.fishing_vessel_type.substring(1)}
                              </p>
                            </div>
                            <div className="col-4">
                              <button
                                className={
                                  selectedData == info._id
                                    ? "btn btn-dark fw-bold "
                                    : "btn btn-secondary"
                                }
                                onClick={() =>
                                  handleNavigate(info._id, "fisherfolk")
                                }
                              >
                                Navigate
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {filter == "alerts" &&
                      data.map((info) => {
                        return (
                          <div
                            className="row student-data text-center my-1"
                            key={info._id}
                          >
                            <div className="col-4">
                              <p>{info.title}</p>
                            </div>
                            <div className="col-4">
                              <p>{info.description}</p>
                            </div>
                            <div className="col-4">
                              <button
                                className={
                                  selectedData == info._id
                                    ? "btn btn-dark fw-bold "
                                    : "btn btn-secondary"
                                }
                                onClick={() =>
                                  handleNavigate(info._id, "alerts")
                                }
                              >
                                Locate
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {filter == "reports" &&
                      data.map((info) => {
                        return (
                          <div
                            className="row student-data text-center my-1"
                            key={info.report._id}
                          >
                            <div className="col-4">
                              <p>{info.report.type}</p>
                            </div>
                            <div className="col-4">
                              <p>{info.report.content}</p>
                            </div>
                            <div className="col-4">
                              <button
                                className={
                                  selectedData == info.report._id
                                    ? "btn btn-dark fw-bold"
                                    : "btn btn-secondary"
                                }
                                onClick={() => {
                                  handleNavigate(info.report._id, "reports");
                                }}
                              >
                                Navigate
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    <ul className="pagination m-auto mt-3">
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
                        {Object.keys(data).length == 5 ? (
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
                        )}
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <h3
                    className="text-center mb-3 "
                    style={{ marginTop: "150px" }}
                  >
                    Search Interface Loading...
                  </h3>

                  <div className="loader m-auto"></div>
                </>
              )}
            </div>

            <div className="col-7 container">
              {!isMapLoading ? (
                <div className="mt-0 p-0">
                  <Map
                    markerData={markerData}
                    selectedData={selectedData}
                    data={mapData}
                    filter={filter}
                  />
                </div>
              ) : (
                <>
                  <h3
                    className="text-center mb-3 "
                    style={{ marginTop: "150px" }}
                  >
                    Map Loading...
                  </h3>
                  <div className="loader m-auto"></div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}
