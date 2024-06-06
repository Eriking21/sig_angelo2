"use client";
import React, {
  ChangeEvent,
  useState,
  ReactNode,
  CSSProperties,
  useRef,
  useEffect,
} from "react";
import { _S_, showSelections, _T_, Language } from "../utility/Language";
import { TbDelta } from "react-icons/tb";
import { FaY } from "react-icons/fa6";
//export { CoordField } from "./coordfield";

export const Flexible_with_border = {
  className: "InputBorder Flexible_Wrapper",
};
export const input_number_wrapper = {
  style: {
    minWidth: "9rem",
    flex: 10,
  },
};
type bool = 0 | 1;
interface _V_ extends Language {
  index: bool;
  key?: React.Key;
}

interface _F_ {
  children: ReactNode;
  label?: string;
  style?: CSSProperties;
  key?: React.Key;
}

export const SelectionBox = ({ prefered, options, name, key }: _S_) => {
  const [value, setSelected] = useState(options[prefered]); // Set initial index to 1 for the second option
  const onChange = (event: ChangeEvent<HTMLSelectElement>): void =>
    setSelected(event.target.value);
  return (
    <select {...{ name, value, onChange }} key={key}>
      {options.map((text, index) => (
        <option key={index} defaultValue={text}>
          {text}
        </option>
      ))}
    </select>
  );
};

export const Selection = ({ key, next, error, previous, ...input }: _S_) => (
  <div className="Selection" key={key}>
    {input.name && <label htmlFor={input.name}>{input.name}</label>}
    <div {...Flexible_with_border}>
      {showSelections(previous, input.name, SelectionBox)}
      <SelectionBox {...input} />
      {showSelections(next, input.name, SelectionBox)}
    </div>
    {/*span error */}
  </div>
);
export const ColorField = ({
  key,
  lineColor,
}: {
  key?: React.Key;
  lineColor: string;
}) => (
  <div className="TextField" key={key}>
    <label htmlFor={lineColor}>{lineColor}</label>
    <div {...Flexible_with_border}>
      <input type={"color"} name={lineColor} />
    </div>
    {/*span error */}
    <span className="input-error" style={{ display: "none" }}></span>
  </div>
);

export const TextField = ({
  key,
  next,
  error,
  previous,
  required,
  ...input
}: _T_) => (
  <div className="TextField" key={key}>
    {input.name && <label htmlFor={input.name}>{input.name}</label>}
    <div {...Flexible_with_border}>
      {showSelections(previous, input.name + " Prev", SelectionBox)}
      <input
        {...input}
        required={required === false ? undefined : input.type !== "number"}
      />
      {showSelections(next, input.name + " next", SelectionBox)}
    </div>
    {/*span error */}
    <span className="input-error" style={{ display: "none" }}></span>
  </div>
);

export const FlexWrapper = ({ key, children, label, style }: _F_) => (
  <div
    key={key}
    className="Flexible_Wrapper"
    style={{ paddingBottom: "1.5rem", ...style }}
  >
    {label && <label htmlFor={label}>{label}</label>}
    {children}
    {/*span error */}

    <span className="input-error" style={{ display: "none" }}></span>
  </div>
);

const firstSwitch = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (!e.currentTarget.classList.contains("selected")) {
    e.currentTarget.classList.add("selected");
    e.currentTarget.nextElementSibling?.classList.remove("selected");
    const target = e.currentTarget.previousElementSibling! as HTMLInputElement;
    target.value = "0";
  }
};

const secondSwitch = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (!e.currentTarget.classList.contains("selected")) {
    e.currentTarget.classList.add("selected");
    e.currentTarget.previousElementSibling?.classList.remove("selected");
    const target = e.currentTarget.previousElementSibling!
      .previousElementSibling! as HTMLInputElement;
    target.value = "1";
  }
};
const prop = (ord: bool, cond: boolean, button: "button" = "button") => {
  return {
    className: Flexible_with_border.className + (cond ? " selected" : ""),
    onClick: ord === 0 ? firstSwitch : secondSwitch,
    type: button,
  };
};

export const VoltField = ({ key, End_trafo, index }: _V_) => (
  <FlexWrapper label={End_trafo[index]} style={{ gap: ".25rem" }} key={key}>
    <input
      style={{ display: "none" }}
      name={End_trafo[index] + " mode"}
      defaultValue={index}
    />
    <button {...prop(0, index === 0)}>
      <TbDelta />
    </button>
    <button {...prop(1, index === 1)} key={2 + index} value={4}>
      <FaY />
    </button>
    <div {...Flexible_with_border} {...input_number_wrapper}>
      <input
        type="number"
        placeholder={index === 0 ? "1.5" : "400"}
        name={End_trafo[index]}
        min="0"
        style={{ display: "inline" }}
      />
      <SelectionBox
        prefered={index === 0 ? 1 : 0}
        options={["V", "KV", "MV"]}
        name={End_trafo[index] + " next 0"}
      />
    </div>
  </FlexWrapper>
);
