import { language } from "../utility/Language";
import { Info, getStateby } from "@/app/api/data/types";

export type formInputs = {
  [key: string]: any;
};

type languageKey = keyof typeof language;

export function fillForm(formName: string, info: Info) {
  const form_ = document.getElementById(formName) as HTMLFormElement;
  const form = form_.elements;

  const key = form_.className.match(/(language-)(\w+\b)/)![2] as languageKey;
  const write = language[key];
  console.log(form, write);

  setInput("FID", `${info.attributes.FID}`);
  setInput("latitude", `${info.geometry.latitude}`);
  setInput("longitude", `${info.geometry.longitude}`);
  setInput(write._identificação.name, info.attributes.identificação);
  setInput("Estado", getStateby("value", info.attributes.estado)!.label);
  setInput(write._country.name, info.attributes.País);
  setInput(write._province.name, info.attributes.Província);
  setInput(write._municipio.name, info.attributes.Municipio);
  setInput(write._district.name, info.attributes.Distrito);
  setInput(write._city.name, info.attributes.Bairro);
  setInput(write._street.name, info.attributes.Rua);
  setInput(write.height, `${info.attributes.H}`);
  setInput(write._secção.name, `${info.attributes.Secção}`);
  setVar(write.End_trafo[1], "U2");
  setVar(write.frequency, "Frequência");

  if (info.attributes.ObjectType_id === 0) {
    setInput(write.lineColor, info.attributes["Cor da Linha"]!);
    setInput(write._company.name, `${info.attributes.Empresa!}`);
    setInput(write.year, `${info.attributes.Ano!}`);
    setVar(write.Power_names[0], "P1");
    setVar(write.Power_names[1], "P2");
    setVar(write.End_trafo[0], "U1");
  } else if (info.attributes.ObjectType_id === 1) {
    setInput(write._manufacturer.name, `${info.attributes.Fabricante!}`);
    setInput(write._company.name, `${info.attributes.Empresa!}`);
    setInput(write.year, `${info.attributes.Ano!}`);
    setVar(write.Power_names[2], "Capacidade");
    setVar(write.Power_names[3], "Potência");
    setVar(write.End_trafo[0], "U1");
  } else if (info.attributes.ObjectType_id === 2) {
    setVar(write.Power_names[4], "Potência");
    setInput(write.type, `${info.attributes.Tipo!}`);
  }

  console.log({ form, write, info });
  return;

  function setInput(name: string, value: string) {
    (form.namedItem(name) as HTMLInputElement).value = value;
  }

  function setVar(fieldName: string, attribute: keyof Info["attributes"]) {
    const regex = /^(\d+([.,]\d+)?)([a-zA-Z]+)$/;
    const stringPart = `${info.attributes[attribute]!}`.match(regex)!;
    try {
      setInput(fieldName, stringPart[1]! + (stringPart[2] ?? ""));
      setInput(fieldName + " next 0", stringPart[3]!);
    } catch {
      console.log({ fieldName, attribute, i: info.attributes });
    }
  }
}
