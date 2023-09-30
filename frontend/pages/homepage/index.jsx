import Navbar from "@/components/navbar";
import "./style.css";
import "../../styles/custom.scss";
import { useEffect } from "react";

export default function Homepage() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <>
      <Navbar />
    </>
  );
}
