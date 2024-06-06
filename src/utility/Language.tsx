import Language, { showSelections, _S_, _T_ } from "./Language_Helpers";
export { Input } from "./Language_Inputs";
export { CopyRight } from "./CopyRight";
export { showSelections, type Language, type _S_, type _T_ };
interface Language_type {
  PT: Language;
  EN: Language;
}

export const language: Language_type = {
  PT: {
    modify: "Modificar",
    year: "Ano",
    short_name: "PT",
    local_name: "Português",
    select_map: ["padrão", "topografica", "satelite"],
    Map_object: ["Substação", "Tranformador", "Consumidor"],
    Power_names: [
      "Potência de entrada",
      "Potência de saida",
      "Capacidade",
      "Potência",
      "Contracto",
    ],
    register: "Registrar",
    _identificação: {
      name: "Identificação",
      placeholder: "Insira a identificação",
      type: "text",
    },
    _country: {
      name: "País",
      placeholder: "Insira a País",
      type: "text",
    },
    _province: {
      name: "Província",
      placeholder: "Insira a Província",
      type: "text",
    },
    _municipio: {
      name: "Município",
      placeholder: "Insira o Município",
      type: "text",
    },
    _district: {
      name: "Distrito",
      placeholder: "Insira o Distrito",
      type: "text",
    },
    _city: {
      name: "Cidade / Bairro",
      placeholder: "Insira a Cidade",
      type: "text",
    },
    _street: {
      name: "Rua",
      placeholder: "Insira a Rua",
      type: "text",
    },
    _company: {
      name: "Companhia",
      placeholder: "Insira a Companhia",
      type: "text",
    },
    _manufacturer: {
      name: "Fabricante",
      placeholder: "Insira o Fabricante",
      type: "text",
    },
    _owner: {
      type: "text",
      name: "Proprietário",
      placeholder: "Insira o Proprietário",
    },
    Phase_Type: "Instalação",
    voltage: "Tensão",
    frequency: "Frequência",
    Phase_denomination: ["Monofásica", "Bifásica", "Trifásica"],

    type: "Tipo",
    TrafoConnection: ["estrela", "triângulo"],
    trafo_type: [
      ["Monofásico", "Bifásico", "Trifásico"],
      ["Monobloco", "Alvenaria"],
    ],
    End_trafo: ["Primário", "Secundário"],
    DEV: ["Todos os direitos reservados.", "Desenvolvido por"],
    coordinates: "Coordenadas",
    _secção: {
      required: false,
      type: "text",
      name: "Secção",
      placeholder: "Insira a secção ou -",
    },
    lineColor: "Cor da Linha",
    connections: "Connecções",
    input: "entrada",
    output: "saida",
    height: "Z",

    lampType: {
      type: "text",
      name: "Tipo de Lâmpada",
      placeholder: "Insira o tipo de lâmpada ",
    },
    ref: {
      type: "text",
      name: "Referência",
      placeholder: "Insira a referência ",
    },
    base: {
      type: "text",
      name: "Base",
      placeholder: "Insira o tipo de base",
    },
    brand: {
      type: "text",
      name: "Marca",
      placeholder: "Insira a marca",
    },
    temp: {
      type: "text",
      name: "Temperatura da Cor",
      placeholder: "Insira o Temperatura da Cor",
    },
  },

  EN: {
    modify: "submit",
    year: "Year",
    short_name: "ENG",
    local_name: "English",
    select_map: ["Default", "Topografic", "satelite"],
    Map_object: ["Substação", "Tranformador", "Consumidor"],
    Power_names: ["Power", "Power", "Consume", "", ""],
    register: "Register",
    _identificação: {
      name: "Name",
      placeholder: "Insert a Name",
      type: "text",
    },
    _province: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _city: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _country: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _district: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _street: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _company: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _manufacturer: {
      name: "",
      placeholder: "",
      type: "text",
    },
    _owner: {
      type: "text",
      name: "",
    },
    voltage: "",
    frequency: "",
    type: "",
    trafo_type: [
      ["", "", ""],
      ["", ""],
    ],
    Phase_Type: "",
    End_trafo: ["", ""],
    Phase_denomination: ["", "", ""],
    DEV: ["All Rights Reserved", "Developed By"],
    coordinates: "",
    _secção: {
      required: false,
      type: "text",
      name: "",
    },
    lineColor: "Color",
    connections: "",
    input: "",
    output: "",
    height: "Altura",
    _municipio: {
      name: "",
      placeholder: "",
      type: "text",
    },
    TrafoConnection: ["star", "triangle"],
    ref: {
      type: "text",
      name: "Reference",
      placeholder: "Insira o Proprietário",
    },
    base: {
      type: "text",
      name: "Base",
      placeholder: "Insira o Proprietário",
    },
    brand: {
      type: "text",
      name: "Brand",
      placeholder: "Insira o Proprietário",
    },
    temp: {
      type: "text",
      name: "Brand",
    },
    lampType: {
      type: "text",
      name: "Tipo de Lâmpada",
      placeholder: "Insira o tipo de lâmpada ",
    },
  },
};
