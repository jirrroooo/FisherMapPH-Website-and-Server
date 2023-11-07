import React from "react";

export default function ListFormat({ data }) {
  return(
      data.map((info) => {
        <>{info}</>
        console.log(info);
      })
  );
}
