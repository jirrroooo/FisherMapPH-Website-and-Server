import React, { useEffect, useState } from "react";
import Map from "../../components/map/index";
import { useApiStore } from "../../store/apiStore";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";
import Navbar from "../../components/navbar";
import Image from "next/image";

export default function FisherMap() {
  const [isVerified, setIsVerified] = useState(false);
  const [filter, setFilter] = useState("fisherfolk");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("Search by");
  const [search, setSearch] = useState("");

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
          getData();
        }
      });
  }

  async function getData() {
    let linkString = "";

    if (filter == "fisherfolk") {
      linkString = "users/fisherfolk-users";
    } else if (filter == "alerts") {
      linkString = "alerts";
    } else {
      linkString = "reports";
    }

    await fetch(`${useApiStore.getState().apiUrl}${linkString}`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
      .then((response) => response.json())
      .then((body) => {
        setData(body);
        setIsLoading(false);
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

    await fetch(`${useApiStore.getState().apiUrl}${linkString}`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
      .then((response) => response.json())
      .then((body) => {
        setData(body);
        setIsLoading(false);
      });
  }

  async function getSearchedData(input) {
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

    if(document.getElementById("search").value == ""){
      setSearchBy("Search by");
    }

    if (searchBy != "Search by") {
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

    fetch(`${useApiStore.getState().apiUrl}${linkString}?page=${pageNumber}`, {
      headers: { Authorization: `Bearer ${useLoginStore.getState().token}` },
    })
      .then((response) => response.json())
      .then((body) => {
        setData(body);
        setIsLoading(false);
      });
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

    if (searchBy != "Search by") {
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
    setIsLoading(true);
    setPage(1);
    setFilter(filter);
    data == null;

    await getDataByFilter(filter);

  }

  function handleSearch(){
    getSearchedData(document.getElementById("search").value);
  }

  const handleNextPage = () => {
    console.log(searchBy);
    console.log(search);

    if (searchBy != "Search by") {
      getSearchedDataByPageNumber(page + 1, document.getElementById("search").value);
    } else {
      getDataByPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (searchBy != "Search by") {
      getSearchedDataByPageNumber(page - 1, document.getElementById("search").value);
    } else {
      getDataByPage(page - 1);
    }
  };

  const markers = [
    {
      position: [3.1113888888888888, 119.92611111111112],
      text: "Marker 1 - Masarawag",
    },
    {
      position: [3.4433333333333334, 121.35861111111111],
      text: "Marker 2 - Philippine Sea",
    },
    {
      position: [3.816111111111111, 122.93416666666666],
      text: "Marker 3 - Philippine Sea",
    },
    {
      position: [4.961666666666667, 124.85472222222222],
      text: "Marker 4 - Philippine Sea",
    },
    {
      position: [5.046666666666667, 125.47222222222223],
      text: "Marker 5 - Philippine Sea",
    },
    { position: [6.4225, 127.195], text: "Marker 6 - Philippine Sea" },
    {
      position: [6.406944444444445, 128.65055555555554],
      text: "Marker 7 - Philippine Sea",
    },
    {
      position: [6.405555555555556, 129.52527777777777],
      text: "Marker 8 - Philippine Sea",
    },
  ];

  const handleSubmit = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
  };

  return (
    <>
      {!isLoading ? (
        <>
          <Navbar />
          <div className="row">
            <div className="col-5 container mt-0 ">
              <form className="mt-4" onSubmit={handleSubmit}>
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
              </form>

              <div className="card mt-3 p-2 mx-4">
                <div className="row text-center my-1">
                  <div className="col-4">
                    <h6>{filter == "fisherfolk" ? "Name" : "Title"}</h6>
                  </div>
                  <div className="col-4">
                    <h6>
                      {filter == "fisherfolk" ? "Vessel Type" : "Description"}
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
                            {info.fishing_vessel_type.charAt(0).toUpperCase() +
                              info.fishing_vessel_type.substring(1)}
                          </p>
                        </div>
                        <div className="col-4">
                          <button className="btn btn-secondary">
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
                          <button className="btn btn-secondary">Locate</button>
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
                          <button className="btn btn-secondary">
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
            </div>
            <div className="col-7 container mt-0 p-0">
              <Map markers={markers} />
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
