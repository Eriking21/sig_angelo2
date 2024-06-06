"use client";
import { Language } from "../utility/Language";
import { Info, getStateby, statelabels } from "@/app/api/data/types";

type formType = {
  [key: string]: string;
};

type a = { FID: number };
export type ClientContent = {
  info: {
    geometry: Info["geometry"];
    attributes: Omit<Info["attributes"], "FID"> & { FID?: number };
  };
  mainLine?: number;
  connections: number[];
};

export function getPostContent(
  formData: FormData,
  write: Language,
  formIndex: 0 | 1 | 2
): ClientContent {
  const form: formType = {
    type: formIndex.toString(),
    Language: write.short_name,
  };

  formData.forEach((value, name) => {
    form[name] = value.toString();
  }); 
  const connections: number[] = [];
  const lenght = "__E_".length;
  Object.keys(form)
    .filter((key) => key.startsWith("__E_") && form[key] === "on")
    .forEach((key) => connections.push(parseInt(key.slice(lenght))));


  const info: ClientContent = {
    mainLine: form["mainLine"] !== "" ? parseInt(form["mainLine"]) : undefined,
    connections: connections,
    //source: form["source"] !== "" ? parseInt(form["source"]) : undefined,

    info: {
      geometry: {
        type: "point",
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      },
      attributes: {
        ObjectType_id: formIndex,
        FID: form["FID"] != undefined ? parseInt(form["FID"]) : undefined,
        identificação: form[write._identificação.name],
        estado: getStateby("label", form["Estado"])!.value,
        País: form[write._country.name],
        Província: form[write._province.name],
        Municipio: form[write._municipio.name],
        Distrito: form[write._district.name],
        Bairro: form[write._city.name],
        Rua: form[write._street.name],
        H: parseFloat(form[write.height]),
        Secção: form[write._secção.name],
        U2: form[write.End_trafo[1]] + form[write.End_trafo[1] + " next 0"],
        Frequência: form[write.frequency] + form[write.frequency + " next 0"],
      },
    },
  };
  if (info.info.attributes.ObjectType_id === 0) {
    info.info.attributes = {
      ...info.info.attributes,
      ["Cor da Linha"]: form[write.lineColor],
      Empresa: form[write._company.name],
      Ano: parseInt(form[write.year]),
      P1: form[write.Power_names[0]] + form[write.Power_names[0] + " next 0"], // Replace with appropriate value
      P2: form[write.Power_names[1]] + form[write.Power_names[1] + " next 0"], // Replace with appropriate value
      U1: form[write.End_trafo[0]] + form[write.End_trafo[0] + " next 0"],
    };
  } else if (info.info.attributes.ObjectType_id === 1) {
    info.info.attributes = {
      ...info.info.attributes,
      Empresa: form[write._manufacturer.name],
      Fabricante: form[write._manufacturer.name],
      Ano: parseInt(form[write.year]),
      Capacidade:
        form[write.Power_names[2]] + form[write.Power_names[2] + " next 0"],
      Potência:
        form[write.Power_names[3]] + form[write.Power_names[3] + " next 0"],
      Aproveitamento: get_Aproveitamento({
        MaxPower: [
          `${form[write.Power_names[2]]}`,
          `${form[write.Power_names[2] + " next 0"]}`,
        ],
        power: [
          `${form[write.Power_names[3]]}`,
          `${form[write.Power_names[3] + " next 0"]}`,
        ],
      }),
      Ligação: `${
        write.TrafoConnection[parseInt(form[write.End_trafo[0] + " mode"])]
      }-${write.TrafoConnection[parseInt(form[write.End_trafo[1] + " mode"])]}`,

      Tipo: `${form[write.type]} ${form[write.type + " 0"]}`,
      U1: form[write.End_trafo[0]] + form[write.End_trafo[0] + " next 0"],
    };
  } else if (formIndex === 2) {
    info.info.attributes = {
      ...info.info.attributes,
      Tipo: form[write.type],
      Potência:
        form[write.Power_names[4]] + form[write.Power_names[4] + " next 0"],
    };
  }
  //console.log(form, info);
  return info;
}

type MP = {
  MaxPower: [string, string];
  power: [string, string];
};
export function get_Aproveitamento({ MaxPower, power }: MP) {
  return `${
    100 *
    ((parseFloat(power[0]) * 3 ** ["VA,kVA,MVA,GVA"].indexOf(power[1])) /
      (parseFloat(MaxPower[0]) * 3 ** ["VA,kVA,MVA,GVA"].indexOf(MaxPower[1])))
  }%`;
}
