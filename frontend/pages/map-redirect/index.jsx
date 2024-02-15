import { useRouter } from "next/router";
import React from "react";

export default function index() {
  const router = useRouter();

  const propVal = router.query.filterValue;;

  router.push({
    pathname: "/map",
    query: {filterValue: propVal}
  });

  return (
    <>
      <div className="m-auto mt-5">
        <h1 className="text-center" style={{ marginTop: "150px" }}>
          FisherMap PH
        </h1>
      </div>
      <div className="loader m-auto mt-5"></div>
    </>
  );
}
