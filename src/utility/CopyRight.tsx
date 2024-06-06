/*


*/
import { CSSProperties } from "react";
import { Language } from "./Language";

export const CopyRight = (_DEV : Language["DEV"]) => {
  const divStyle: CSSProperties = {
    alignSelf: "stretch",
    padding: "1rem 5% .5rem",
    alignItems: "center",
    textAlign: "center",
    fontSize: ".7em",
  };

  const style: CSSProperties = {
    display: "inline-block",
    margin: "1.5px",
    height: "1.5px",
    color: "#777777",
  };

  return (
    <div style={divStyle}>
      <p {...{ style }}>{`Copyright 2023.`}</p>
      <p {...{ style }}>{`${_DEV[0]}`}</p>
      <p {...{ style }}>{`${_DEV[1]} ErimCompany.`}</p>
    </div>
  );
};
