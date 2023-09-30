import { useEffect } from "react";
import "./style.css";
import "../../styles/custom.scss";


export default function AdminAccounts(){
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
      }, []);
    
    return(
        <div>
            Hello World!
        </div>
    );
}