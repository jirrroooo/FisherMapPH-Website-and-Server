import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Navbar() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  const route = useRouter();

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <Link className="text-decoration-none text-white" href="/homepage">
            <h4>FisherMap PH</h4>
          </Link>
        </a>

        {route.pathname != "/login" && route.pathname != "/signup" && (
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
              >
                Super Administrator
              </a>

              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <Link className="text-decoration-none text-black px-3 " href="/signup">Log Out</Link>
                </li>
              </ul>
            </li>
          </ul>
        )}

      </div>
    </nav>
  );
}
