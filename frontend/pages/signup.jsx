import { useEffect } from "react";
import "./style.css";
import "../styles/custom.scss";

export default function Signup(){
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
      }, []);
    
    return(
        <>
                <button type="button" class="btn">
          Basic
        </button>
        <button type="button" class="btn btn-primary">
          Primary
        </button>
        <button type="button" class="btn btn-secondary">
          Secondary
        </button>
        <button type="button" class="btn btn-success">
          Success
        </button>
        <button type="button" class="btn btn-info">
          Info
        </button>
        <button type="button" class="btn btn-warning">
          Warning
        </button>
        <button type="button" class="btn btn-danger">
          Danger
        </button>
        <button type="button" class="btn btn-dark">
          Dark
        </button>
        <button type="button" class="btn btn-light">
          Light
        </button>
        <button type="button" class="btn btn-link">
          Link
        </button>
        </>
    );
}