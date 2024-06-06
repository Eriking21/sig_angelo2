import { _T_, Language, _S_ } from "./Language_Helpers";
type getInput = (lang: Language) => _T_;
type getSelection = (lang: Language) => _S_;
type getListedInput = (lang: Language, index?: number) => _T_;

export interface get_Input {
  vida: getListedInput;
  temp: getListedInput;
  fluxo: getListedInput;
  power: getListedInput;
  activePower: getListedInput;
  voltage: getListedInput;
  frequency: getListedInput;
  trafo_type: getSelection;
  instalation_type: getSelection;
  year: getInput;
  height: getInput;
}

export const Input: get_Input = {
  height: function (lang: Language): _T_ {
    return {
      type: "number",
      name: lang.height,
      placeholder: "0",
    };
  },
  year: function (lang: Language): _T_ {
    return {
      type: "number",
      name: lang.year,
      placeholder: new Date().getFullYear().toString(),
      min: 1900,
      max: new Date().getFullYear(),
    };
  },
  voltage: function (lang: Language): _T_ {
    return {
      min: 0,
      type: "number",
      name: lang.voltage,
      placeholder: "220",
      next: [[1, ["V", "kV", "MV", "GV"]]],
    };
  },
  activePower: function (lang: Language, index?: number): _T_ {
    return {
      min: 0,
      type: "number",
      name: lang.Power_names[index ?? 3],
      placeholder: "400",
      next: [[0, ["W", "kW", "MW", "GW"]]],
    };
  },
  power: function (lang: Language, index?: number): _T_ {
    return {
      min: 0,
      type: "number",
      name: lang.Power_names[index ?? 3],
      placeholder: index === 4 ? "25" : "400",
      next: [[1, ["VA", "kVA", "MVA", "GVA"]]],
    };
  },
  vida: function (lang: Language, index?: number): _T_ {
    return {
      min: 0,
      type: "number",
      name: "Vida Média",
      placeholder: "48000",
      next: [[0, ["h"]]],
    };
  },
  temp: function (lang: Language, index?: number): _T_ {
    return {
      min: 0,
      type: "number",
      name: lang.temp.name,
      placeholder: "48000",
      next: [[0, ["K"]]],
    };
  },
  fluxo: function (lang: Language, index?: number): _T_ {
    return {
      min: 0,
      type: "number",
      name: "Fluxo das Luminárias",
      placeholder: "48000",
      next: [[0, ["Lumens"]]],
    };
  },
  frequency: function (lang: Language, index?: number): _T_ {
    return {
      min: 0,
      type: "number",
      name: lang.frequency,
      placeholder: "50",
      next: [[0, ["Hz", "KHz", "MHZ", "GHZ"]]],
    };
  },
  trafo_type: function (lang: Language): _S_ {
    return {
      name: lang.type,
      options: lang.trafo_type[0],
      prefered: 0,
      next: [[0, lang.trafo_type[1]]],
    };
  },
  instalation_type: function (lang: Language): _S_ {
    return {
      name: lang.Phase_Type,
      options: lang.Phase_denomination,
      prefered: 2,
    };
  },
};
