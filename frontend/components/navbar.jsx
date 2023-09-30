import React, { useEffect } from "react";

export default function Navbar() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <h4>FisherMap PH</h4>
        </a>

        <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Super Administrator
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Log Out
                  </a>
                </li>
              </ul>
            </li>
          </ul>

        {/* <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse float-end" id="collapsibleNavbar">
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Dropdown
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#">
                    Link
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Another link
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    A third link
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div> */}


      </div>
    </nav>
  );
}
