"use client";
import { mapInterface } from "@/Map/interface";
import { useRef } from "react";
import { FlexWrapper, Flexible_with_border } from ".";
import { ConnectorLine } from "./connectorLine";
import { FormIndex, setForm } from "@/AddMenu";

export function Connector({
  connections,
  formIndex,
}: {
  connections: string;
  formIndex: FormIndex;
}) {
  //const formIndex = setForm.useListener();
  const activeNode = useRef<HTMLInputElement | null>(null);

  return (
    <FlexWrapper label={connections} style={{ gap: ".5rem" }}>
      <input name="mainLine" style={{ display: "none" }} />
      <div
        {...Flexible_with_border}
        style={{
          paddingRight: ".2rem",
          display: "inline-flex",
          height: "20rem",
          overflow: "scroll",
        }}
      >
        {mapInterface.objects
          .flat()
          ?.filter((point) =>
            point.attributes.identificação
              .toLowerCase()
              .includes(mapInterface.search.getValue())
          )
          .map((point, index) => {
            const check: [boolean | null, boolean | null] = [
              formIndex == 0
                ? false
                : point.attributes.ObjectType_id + 1 == formIndex!
                ? true
                : null,
              formIndex == point.attributes.ObjectType_id ? true : null,
            ];
            return (
              <ConnectorLine
                key={index}
                {...{ ...point, activeNode, index, check }}
              />
            );
          })}
      </div>
    </FlexWrapper>
  );
}
