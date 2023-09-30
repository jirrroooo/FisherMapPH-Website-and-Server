import { useEffect } from "react";
import "./style.css";

export default function ManageDistressCalls(){
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
      }, []);
    
    return(
        <div>
            Hello World!
        </div>
    );
}