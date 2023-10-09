// import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import { useEffect } from "react";
import "../styles/custom.scss";

export default function Index() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <div className="dropdown">
      <button
        type="button"
        className="btn btn-primary dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        Dropdown button
      </button>
      <ul className="dropdown-menu">
        <li>
          <a className="dropdown-item" href="#">
            Link 1
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Link 2
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Link 3
          </a>
        </li>
      </ul>
    </div>
  );
}
