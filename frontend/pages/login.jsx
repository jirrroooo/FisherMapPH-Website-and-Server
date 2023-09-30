import { useEffect } from "react";
import "./style.css";
import "../../styles/custom.scss";

export default function Login(){
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
      }, []);
    
    return(
        <div>
            Log In
        </div>
    );
}