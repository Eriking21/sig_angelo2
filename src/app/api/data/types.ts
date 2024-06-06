import { MergeWithOptional3 } from "@/utility/options";

export const stateColorStops: {
  value: number;
  color: string;
  label: string;
}[] = [
  {
    label: "Funcional",
    value: 0,
    color: "#80ed80",
  },
  {
    label: "Defeituoso",
    value: 1,
    color: "yellow",
  },
  {
    label: "Avariado",
    value: 2,
    color: "red",
  },
  {
    label: "Inactivo",
    value: 3,
    color: "gray",
  },
];

export function getStateby(
  k: keyof (typeof stateColorStops)[any],
  item: (typeof stateColorStops)[any][typeof k]
) {
  for (const element of stateColorStops) {
    if (element[k] == item) return element;
  }
}
export const statelabels = stateColorStops.map(({ label }) => label);
export const statevalues = stateColorStops.map(({ value }) => value);
export const stateColors = stateColorStops.map(({ color }) => color);

export interface Info_type<T extends 0 | 1 | 2> {
  geometry: { type: "point"; latitude: number; longitude: number };
  attributes: {
    ObjectType_id: number & T;
    FID: number;
    identificação: string;
    estado: (typeof stateColorStops)[any]["value"];
    //token_de_actualização: number;
    País: string;
    Província: string;
    Municipio: string;
    Distrito: string;
    Bairro: string;
    Rua: string;
    H: number;
    Frequência: string;
    Secção: string;
    U2: string;
  };
}
export type Sub_Info = Info_type<0> & {
  attributes: {
     ["Cor da Linha"]: string;
    Empresa: string;
    Ano: number;
    P1: string;
    P2: string;
    U1: string;
  };
};

export type Trafo_Info = Info_type<1> & {
  attributes: {
    Empresa: string;
    Fabricante: string;
    Ano: number;
    Capacidade: string;
    Potência: string;
    Aproveitamento: string;
    Ligação: string;
    U1: string;
    Tipo: string;
  };
};

export type Consumer_Info = Info_type<2> & {
  attributes: {
    Potência: string;
    Tipo: string;
  };
};

export type erim_vec<T> = {
  [key: number]: T;
};

export type erimServerData = {
  subs: erim_vec<Sub_Info>;
  trafos: erim_vec<erim_vec<Trafo_Info>>;
  consumers: erim_vec<erim_vec<Consumer_Info>>;
  CON_SE: erim_vec<CON_SE_Info>;
  CON_TRAFO: erim_vec<CON_TRAFO_Info>;
};
export default erimServerData;

export class erimClientData {
  subs: Sub_Info[];
  trafos: Trafo_Info[][];
  CON_SE: CON_SE_Info[];
  CON_TRAFO: CON_TRAFO_Info[];
  constructor({ subs, trafos, CON_SE, CON_TRAFO }: erimServerData) {
    this.subs = Object.values(subs);
    this.trafos = Object.values(trafos).map((subVec) => Object.values(subVec));
    this.CON_SE = Object.values(CON_SE);
    this.CON_TRAFO = Object.values(CON_TRAFO);
  }
}
//export type Info = Trafo_Info | Sub_Info | Consumer_Info;

export type Info = {
  geometry: (Trafo_Info | Sub_Info | Consumer_Info)["geometry"];
  attributes: MergeWithOptional3<
    Trafo_Info["attributes"],
    Sub_Info["attributes"],
    Consumer_Info["attributes"]
  >;
};

export type CON_SE_Info = link_line<number>;
export type CON_TRAFO_Info = link_line<[number, number]>;
type link_line<T> = {
  0: T;
  1: T;
  power: string;
};
