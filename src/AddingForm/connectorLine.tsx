"use client";
import { FaCircle } from "react-icons/fa";
import { MutableRefObject, useEffect } from "react";
import { PowerItem } from "../utility/options";
import { Info, stateColors } from "../app/api/data/types";

interface _ {
  activeNode: MutableRefObject<HTMLInputElement | null>;
  index: number;
  attributes: Info["attributes"];
  geometry: Info["geometry"];
  check: [boolean | null, boolean | null];
}

const imgStyle = {
  alignSelf: "stretch",
  widt: "",
  width: "1.1rem",
  margin: ".1rem",
  display: "inline",
  flex: "0 0 auto",
};

export const ConnectorLine = ({ activeNode, index, attributes,check }: _) => {
  function ag(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.checked) {
      if (activeNode.current) {
        activeNode.current!.checked = false;
      }
      activeNode.current! = event.target;

      (
        event.target!.parentNode!.parentNode!
          .previousSibling as HTMLInputElement
      ).value = `${attributes.FID}`;
    }
  }


  return (
    <div
      ref={activeNode.current === null && index === 0 ? activeNode : undefined}
      className="item"
      style={{
        display: "inline-flex",
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "flex-start",
        fontSize: "1rem",
        width: "100%",
        boxSizing: "border-box",
        margin: "0 .15rem",
        height: "1.5rem",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img
        style={{ ...imgStyle, width: "1.35rem", height: "1.35rem" }}
        alt={index.toString()}
        src={PowerItem[attributes.ObjectType_id].src}
      />
      {check[0] !== false && (
        <input
          type="checkbox"
          style={imgStyle}
          onChange={ag}
          disabled={check[0] === null}
        />
      )}
      {check[1] !== false && (
        <input
          style={imgStyle}
          name={"__E_" + attributes.FID}
          type="checkbox"
          disabled={check[1] === null}
        />
      )}
      <FaCircle
        style={{ ...imgStyle, alignSelf: "center" }}
        color={stateColors[attributes.estado]}
      />
      <span
        style={{
          flex: "1",
          fontSize: ".8rem",
          textAlign: "start",
          alignSelf: "center",
          paddingRight: "1rem",
          overflow: "inherit",
          display: "block",
          whiteSpace: "nowrap",
        }}
      >
        {attributes.identificação}
      </span>
    </div>
  );
};
