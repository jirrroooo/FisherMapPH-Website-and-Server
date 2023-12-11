import React, { useState } from "react";
import { useUserDataStore } from "../store/userDataStore";
import { useApiStore } from "../store/apiStore";
import { useLoginStore } from "../store/loginStore";

export default function SearchFunction({pageUrl}, {pageNum}) {
  const [searchBy, setSearchBy] = useState("Search by");
  const [sortBy, setSortBy] = useState("Sort by");


  function getFilteredData() {
    useUserDataStore.setState({
        pageLoading: true
    });

    const search = document.getElementById("search").value;

    if (sortBy != "Sort By" && searchBy != "Search by") {
      fetch(
        `${
          useApiStore.getState().apiUrl
        }users/${pageUrl}?sort=${sortBy}&searchBy=${searchBy}&search=${search}&page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
            useUserDataStore.setState({
                pageData: body,
                pageLoading: false
              });

              console.log(body);
              
        });
    } else if (sortBy == "Sort by" && searchBy != "Search by") {
      fetch(
        `${
          useApiStore.getState().apiUrl
        }users/${pageUrl}?searchBy=${searchBy}&search=${search}&page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${useLoginStore.getState().token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => {
            useUserDataStore.setState({
                pageData: body,
                pageLoading: false
              });
              
              console.log(body);
        });
    } else if (searchBy == "Search by") {
      alert("Please choose a valid search filter!");
      useUserDataStore.setData({
        pageLoading: false
    });
    }
  }

  return (
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
  );
}
