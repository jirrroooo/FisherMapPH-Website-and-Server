import Navbar from "@/components/navbar";
import "./style.css";
import { useEffect } from "react";

export default function Homepage() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#myModal"
      >
        Open modal
      </button>

      <div className="modal" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Modal Heading</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">Modal body..</div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="spinner-border text-muted"></div>
      <div className="spinner-border text-primary"></div>
      <div className="spinner-border text-success"></div>
      <div className="spinner-border text-info"></div>
      <div className="spinner-border text-warning"></div>
      <div className="spinner-border text-danger"></div>
      <div className="spinner-border text-secondary"></div>
      <div className="spinner-border text-dark"></div>
      <div className="spinner-border text-light"></div>
    </>
  );
}
