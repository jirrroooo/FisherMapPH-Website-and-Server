// import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import { useEffect, useState } from "react";
import "../styles/custom.scss";
import { useRouter } from "next/router";
import { useLoginStore } from "../store/loginStore";
import LoadingPage from "../components/loading_page";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    fetch("/api/verify")
      .then((response) => response.json())
      .then((body) => {
        if (body.status == "success") {
          useLoginStore.setState({ isVerifiedCookie: true, token: body.token });
          router.push("/homepage");
        } else {
          useLoginStore.setState({ isVerifiedCookie: false });
          router.push("/login");
        }
      });
  }, []);

  return <LoadingPage />;
}
