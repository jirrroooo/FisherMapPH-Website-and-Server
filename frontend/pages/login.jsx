import { useEffect } from "react";
import "./style.css";

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