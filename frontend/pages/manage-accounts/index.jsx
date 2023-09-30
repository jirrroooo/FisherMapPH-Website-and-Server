import { useEffect } from "react";
import "./style.css";
import "../../styles/custom.scss";

export default function ManageAccounts(){
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
      }, []);
    
    return(
        <div>
            Hello World!
        </div>
    );
}