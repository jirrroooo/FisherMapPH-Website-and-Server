import { useEffect } from "react";
import "./style.css";

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