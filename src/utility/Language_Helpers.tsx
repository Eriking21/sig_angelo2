import { HTMLInputTypeAttribute, ReactNode } from "react";
import { StrVec, ERIM_BASEMAP_NUMBER, ERIM_OBJECT_NUMBER } from "./options";
export type Selection = [num: number, str: string[]];

export interface Input_Helper<T = HTMLInputTypeAttribute> {
  type: T;
  name: string;
  placeholder?: string;
  error?: string[];
}

export interface _T_  extends  Input_Helper<HTMLInputTypeAttribute> {
  next?: (Selection | ReactNode)[];
  previous?: (Selection | ReactNode)[];
  min?: number;
  max?: number;
  defaultValue?: string;
  key?: number | string;
  required?:boolean;
};

export interface _S_ {
  error?: string[];
  next?: (Selection | ReactNode)[];
  previous?: (Selection | ReactNode)[];
  prefered: number;
  options: string[];
  name: string;
  key?: number | string;
}
export const isSelection = (
  selection: Selection | ReactNode
): selection is Selection =>
  selection !== undefined &&
  Array.isArray(selection) &&
  typeof selection[0] === "number" &&
  Array.isArray(selection[1]) &&
  selection[1].length > 0;

export const showSelections = (
  s: _T_["next" | "previous"],
  name: string,
  show: ({ prefered, options, name, key }: _S_) => ReactNode
) =>
  s?.map((e, i) =>
    isSelection(e)
      ? show({
          prefered: e[0],
          options: e[1],
          name: `${name} ${i}`,
          key: s.toString() + i,
        })
      : e
  );

export interface Language {
  modify: string;
  coordinates: string;
  register: string;
  short_name: string;
  local_name: string;
  select_map: StrVec<ERIM_BASEMAP_NUMBER>;
  Map_object: StrVec<ERIM_OBJECT_NUMBER>;
  Power_names: StrVec<5>;
  trafo_type: [StrVec<3>, StrVec<2>];
  End_trafo: StrVec<2>;
  voltage: string;
  frequency: string;
  Phase_Type: string;
  type: string;
  year: string;
  lineColor: string;

  TrafoConnection: StrVec<2>;
  Phase_denomination: StrVec<3>;
  _identificação: Input_Helper<"text">;
  _country: Input_Helper<"text">;
  _province: Input_Helper<"text">;
  _municipio: Input_Helper<"text">;
  _district: Input_Helper<"text">;
  _city: Input_Helper<"text">;
  _street: Input_Helper<"text">;
  _company: Input_Helper<"text">;
  _manufacturer: Input_Helper<"text">;
  _owner: Input_Helper<"text">;
  _secção: Input_Helper<"text"> & { required: false };
  DEV: StrVec<2>;
  connections: string;
  input: string;
  output: string;
  height: string;
  lampType: Input_Helper<"text">;
  ref: Input_Helper<"text">;
  base: Input_Helper<"text">;
  brand: Input_Helper<"text">;
  temp: Input_Helper<"text">;
}
export default Language;
