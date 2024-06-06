"use client"
import { useState, useRef } from "react";
import SplashButton from "../utility/SplashButton";
import { basemap } from "../utility/options";
import { mapInterface } from "./interface";

interface Props {
  onRight?: Boolean;
  R?: number;
}

function setMap (index:number) {
  if (mapInterface.view === undefined) return;
  mapInterface.view!.map.basemap = basemap[index].title as any;
}

const SelectMap = ({ onRight = true}: Props) => {
  const index = useRef(0);
  const [toggle, setToggle] = useState(true);
  const right = onRight ? 0 : undefined;

  const childs = () =>
    basemap.map(({ image: src }, __index) => {
      const Y = (__index + 1) * 60;
      const t = toggle ? "none" : `translate(0px, ${Y}px)`;

      const work = () => {
        setTimeout(() => {
          index.current = __index;
          setMap(__index);
          setToggle(!toggle);
        }, 500);
      };

      return (
        <SplashButton
          key={__index}
          className="button_Border Selection_Map"
          translate={t}
          content={src}
          action={work}
          borderRadius={"15%"}
          border={{ width: "4px", color: ["#DDDDDD", "#93cbdd"] }}
        />
      );
    });

  return (
    <div
      style={{
        top: 0,
        right: right,
        maxHeight: "calc(100% - 250px)",
        position: "absolute",
      }}
    >
      {childs()}
      <SplashButton
        key={basemap.length}
        className="button_Border Selected_Map"
        action={() => setToggle(!toggle)}
        content={basemap.at(index.current)!.image}
        borderRadius={"15%"}
        border={{ width: "4px", color: ["#cffcff", "#93cbdd"] }}
      />
    </div>
  );
};

export default SelectMap;
