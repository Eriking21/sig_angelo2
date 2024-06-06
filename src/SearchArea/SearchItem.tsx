"use client";

import {
  CSSProperties,
  MouseEventHandler,
  MutableRefObject,
  useRef,
} from "react";
import { PowerItem } from "../utility/options";
import { Info, stateColors } from "../app/api/data/types";
import { mapInterface } from "@/Map/interface";
import "./styles.css";
import { setForm } from "@/AddMenu";
import { fillForm } from "@/AddingForm/getFormContent";

type _ = Info & {
  activeNode: MutableRefObject<HTMLDivElement | null>;
  index: number;
};

const SearchItem = ({ activeNode, index, attributes, geometry }: _) => {
  function alternate(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (
      activeNode?.current !== event.currentTarget &&
      activeNode?.current?.classList.contains("active")
    ) {
      activeNode.current.classList.remove("active");
    }

    if (event.currentTarget.classList.contains("active")) {
      event.currentTarget.classList.remove("active");
      mapInterface.view?.popup.close();
    } else {
      event.currentTarget.classList.add("active");
      activeNode.current = event.currentTarget;
      //console.log(attributes.FID);
      const i = Promise.all(
        mapInterface.layers!.map((fl) =>
          fl.queryFeatures({
            where: `identificação = '${attributes.identificação}'`,
            //geometry: geometry,
          })
        )
      );
      i.catch((err) => console.log(err));
      i.then((R) => {
        const features = [...R.map((K) => K.features)].flat().reverse();
        //console.log(features);
        mapInterface.view?.popup.open({
          features: features,
          location: geometry as __esri.Point,
        });
      });
    }
  }

  const Edit: MouseEventHandler<HTMLSpanElement> = function (event) {
    event.preventDefault();
    mapInterface.view?.center.set("latitude", geometry.latitude);
    mapInterface.view?.center.set("longitude", geometry.longitude);
    setForm.isEditing = true;
    setForm.to(attributes.ObjectType_id);
    setTimeout(function () {
      fillForm("adding-form", { attributes, geometry });
    }, 100);
  };

  return (
    <div
      ref={activeNode.current === null && index === 0 ? activeNode : undefined}
      className="group SearchItem flex flex-row self-stretch items-start"
      style={{ fontSize: "1rem" }}
      onClick={alternate}
    >
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img
        className="self-center m-2 aspect-square h-4/5 group-hover:h-full"
        //style={imgStyle}
        alt={index.toString()}
        src={PowerItem[attributes.ObjectType_id].src}
      />
      <span className="text-start self-center overflow-hidden block flex-nowrap flex-1 items-center">
        {attributes.identificação}
      </span>
      <span
        className="self-center aspect-square  h-3/5 group-hover:h-4/5 rounded-full border-0  flex  items-center justify-center"
        style={{ backgroundColor: stateColors[attributes.estado] }}
        onClick={Edit}
      >
        {/* eslint-disable-next-line @next/next/no-img-element*/}
        <img
          className="p-1 aspect-square h-full hidden-content"
          //style={imgStyle}
          alt={"\\e"}
          src={"/edit.png"}
        />
      </span>
    </div>
  );
};

const imgStyle: CSSProperties = {
  alignSelf: "center",
  margin: ".5rem",
  height: "60%",
  width: "1.35rem",
};

export default SearchItem;
