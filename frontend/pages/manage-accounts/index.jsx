import { useEffect } from "react";
import "./style.css";
import "../../styles/custom.scss";
import { useLoginStore } from "../../store/loginStore";
import { useRouter } from "next/router";

export default function ManageAccounts() {
  const router = useRouter();

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    if (!useLoginStore.getState().isLoggedIn) {
      router.push("/login");
    }
  }, []);

  return (
    <>
      {useLoginStore.getState().isLoggedIn ? (
        <>
          <div>Hello World!</div>
        </>
      ) : (
        <div className="loader m-auto mt-5"></div>
      )}
    </>
  );
}
