import { useRouter } from "next/router";
import React from "react";

export default function index() {
  const router = useRouter();

  router.push({
    pathname: "/map",
    query: {
      filterValue: router.query.filterValue,
      dataId: router.query.dataId
    }
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
