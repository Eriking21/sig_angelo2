"use client";
import MapView_ from "@arcgis/core/views/MapView";
import Map_ from "@arcgis/core/Map";
import Point_ from "@arcgis/core/geometry/Point";
import Polyline_ from "@arcgis/core/geometry/Polyline";
import FeatureLayer_ from "@arcgis/core/layers/FeatureLayer";
import SimpleRenderer_ from "@arcgis/core/renderers/SimpleRenderer";
import UniqueValueRenderer_ from "@arcgis/core/renderers/UniqueValueRenderer";
import PictureMarkerSymbol_ from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleLineSymbol_ from "@arcgis/core/symbols/SimpleLineSymbol";
import Graphic_ from "@arcgis/core/Graphic";
import ColorVariable_ from "@arcgis/core/renderers/visualVariables/ColorVariable";
import { loadModules } from "esri-loader";
import { PowerItem, basemap } from "../utility/options";
import {
  erimServerData,
  erimClientData,
  Info,
  stateColorStops,
} from "@/app/api/data/types";

import { MutableRefObject, useEffect } from "react";
import Collection_ from "@arcgis/core/core/Collection";
//import FieldInfo from "@arcgis/core/popup/FieldInfo.js";
//import Layer_ from "@arcgis/core/layers/Layer";
//import Collection from "@arcgis/core/core/Collection";

type MapInterface = {
  Point: typeof Point_ | undefined;
  Graphic: typeof Graphic_ | undefined;
  Polyline: typeof Polyline_ | undefined;
  objects: Info[][];
  view: MapView_ | undefined;
  layers: Collection_<FeatureLayer_> | undefined;
  afterLoad?: () => void | Promise<void>;
  promises: {
    [key: number | string]: Promise<void>;
  };
  updateFeatures: (response: erimServerData) => Promise<void>;
  loadMap: ([Map, MapView]: [typeof Map_, typeof MapView_]) => Promise<void>;
  useMap: () => void;
  buildPopPup: () => void;
  search: {
    watcher: __esri.WatchHandle | undefined;
    input: HTMLInputElement | undefined;
    item: MutableRefObject<HTMLDivElement | null> | undefined;
    listeners: Set<(setToogle: (toogle: boolean) => boolean) => void>;
    getValue: () => string;
    clear: () => void;
    update: () => void;
  };
};

const mapInterface: MapInterface = {
  Point: undefined,
  Graphic: undefined,
  Polyline: undefined,
  objects: [],
  view: undefined,
  layers: undefined,
  search: {
    watcher: undefined as __esri.WatchHandle | undefined,
    input: undefined as HTMLInputElement | undefined,
    item: undefined as MutableRefObject<HTMLDivElement | null> | undefined,
    listeners: new Set<(setToogle: (toogle: boolean) => boolean) => void>(),
    getValue: () => mapInterface.search?.input?.value ?? "",
    clear: () => {
      if (mapInterface.search?.input || false) {
        mapInterface.search!.input!.value = "";
        mapInterface.search.update();
      }
    },
    update: () => mapInterface.search.listeners.forEach((f) => f((i) => !i)),
  },
  promises: {},
  updateFeatures: async (response) => {
    const data = new erimClientData(response);
    mapInterface.objects = [
      data.subs,
      data.trafos.flat(),
      data.consumers.flat(),
    ];

    const lineColors: { value: number; color: number[] | string }[] = [];
    const consumerSource = data.consumers.map((consumerList) => {
      const id = consumerList[0].attributes.FID / 1000;
      for (const t of data.trafos.flat()) if (t.attributes.FID == id) return t;
    });
    function addColor({
      FID,
      "Cor da Linha": Cor_da_Linha,
    }: {
      FID: number;
      "Cor da Linha": number[] | string;
    }) {
      const index = lineColors.findIndex(({ value }) => value == FID);
      if (index != -1) {
        lineColors[index] = {
          value: FID,
          color: Cor_da_Linha,
        };
      } else {
        lineColors.push({
          value: FID,
          color: Cor_da_Linha,
        });
      }
      return FID;
    }
    const loadFeatures = ([
      FeatureLayer,
      Point,
      Polyline,
      SimpleRenderer,
      UniqueValueRenderer,
      PictureMarkerSymbol,
      SimpleLineSymbol,
      Graphic,
      ColorVariable,
    ]: FeaturesT): FeatureLayer_[] => {
      mapInterface.Point = Point;
      mapInterface.Graphic = Graphic;
      mapInterface.Polyline = Polyline;
      //if (!data.pils || !data.pils[0]) return;
      return [
        new FeatureLayer({
          title: "lines",
          objectIdField: "FID",
          fields: getLineFields(),
          source: [
            ... consumerSource.flatMap((PT,index) => {
              addColor({FID: PT!.attributes.FID, "Cor da Linha": "black"});
              console.log(data.consumers);
              return data.consumers[index]?.map(
                ({ attributes: consumer, geometry: consumer_geometry }) => ({
                  geometry: new Polyline({
                    paths: [
                      [
                        [PT!.geometry.longitude, PT!.geometry.latitude],
                        [
                          consumer_geometry.longitude,
                          consumer_geometry.latitude,
                        ],
                      ],
                    ],
                  }),
                  attributes: {
                    identificação: "alimentação " + consumer.identificação,
                    FID: `${consumer.FID}`,
                    power: consumer.Potência,
                    lineColor: PT!.attributes.FID,
                  },
                })
              );
            }),
            ...data.subs.flatMap((sub) => {
              addColor(sub.attributes);
              //console.log(data.trafos);
              return data.trafos[sub.attributes.FID]?.map(
                ({ attributes: trafo, geometry: trafo_geometry }) => ({
                  geometry: new Polyline({
                    paths: [
                      [
                        [sub.geometry.longitude, sub.geometry.latitude],
                        [trafo_geometry.longitude, trafo_geometry.latitude],
                      ],
                    ],
                  }),
                  attributes: {
                    identificação: "alimentação " + trafo.identificação,
                    FID: `${trafo.FID}`,
                    power: trafo.Potência,
                    lineColor: sub.attributes.FID,
                  },
                })
              );
            }),
            ...data.CON_SE.map(({ 0: sub_0, 1: sub_1, power }) => {
              const s0 = data.subs.at(sub_0)!;
              const s1 = data.subs.at(sub_1)!;
              return {
                geometry: new Polyline({
                  paths: [
                    [
                      [s0.geometry.longitude, s0.geometry.latitude],
                      [s1.geometry.longitude, s1.geometry.latitude],
                    ],
                  ],
                }),
                attributes: {
                  identificação: `de ${s0.attributes.identificação} para ${s1.attributes.identificação}`,
                  FID: `${s0.attributes.FID} to ${s1.attributes.FID}`,
                  power: power,
                  lineColor: addColor({
                    FID: 2 * 21,
                    "Cor da Linha": [255, 0, 0],
                  }),
                },
              };
            }),
            ...data.CON_TRAFO.map(({ 0: trafo_0, 1: trafo_1, power }) => {
              const T0 = data.trafos.at(trafo_0[0])!.at(trafo_0[1])!;
              const T1 = data.trafos.at(trafo_1[0])!.at(trafo_1[1])!;
              return {
                geometry: new Polyline({
                  paths: [
                    [
                      [T0.geometry.longitude, T0.geometry.latitude],
                      [T1.geometry.longitude, T1.geometry.latitude],
                    ],
                  ],
                }),
                attributes: {
                  identificação: `de ${T0.attributes.identificação} para ${T1.attributes.identificação}`,
                  FID: `${T0.attributes.FID} to ${T1.attributes.FID}`,
                  power: power,
                  lineColor: addColor({
                    FID: 2 * 42,
                    "Cor da Linha": [255, 0, 255],
                  }),
                },
              };
            }),
          ],
          renderer: new SimpleRenderer({
            symbol: new SimpleLineSymbol({
              width: 3,
            }),
            visualVariables: [
              new ColorVariable({
                field: "lineColor",
                stops: lineColors,
              }),
            ],
          }),
        }),
        ...mapInterface.objects.map((vec, index) => {
          const fields = getFields(vec[0].attributes);
          const i = `icon_${index}`;
          return new FeatureLayer({
            title: i,
            objectIdField: "FID",
            fields: fields,
            source: vec.map((item) => ({
              geometry: new Point(item.geometry),
              attributes: item.attributes,
            })),
            renderer: new UniqueValueRenderer({
              field: "estado",
              uniqueValueInfos: stateColorStops.map(({ value, color }) => ({
                value: value,
                symbol: new PictureMarkerSymbol({
                  url: `/custom/icon_${index}_${color.replace("#", "")}.png`,
                  width: 26,
                  height: 26,
                }),
              })),
            }),
          });
        }),
      ];
    };

    return loadModules<FeaturesT>(FeaturesUrl, {
      css: true,
    })
      .then(loadFeatures)
      .catch((err) => {
        console.error("Erro ao carregar features", err);
        return [] as ReturnType<typeof loadFeatures>;
      })
      .then(async (featuresLayers) => {
        if (
          featuresLayers.length != 0 &&
          Object.keys(mapInterface.promises).includes("loadMap")
        ) {
          await mapInterface.promises["loadMap"];
          mapInterface.layers?.removeAll();
          mapInterface.layers?.addMany(featuresLayers);
          mapInterface.search.update();
          await mapInterface.promises["ready"];
          mapInterface.buildPopPup();
        }
      });
  },

  buildPopPup: () => {
    mapInterface.layers
      ?.filter((fl) => fl.fields !== undefined)
      .forEach((fl) => {
        fl.popupTemplate = fl.createPopupTemplate({
          ignoreFieldTypes: ["global-id", "guid", "oid"],
        });
      });
    mapInterface.layers?.forEach((fl) => {
      //console.log(fl.fields);
      fl.popupTemplate.title = "{identificação}";
    });
    mapInterface.view?.popup.watch(
      ["visible", "selectedFeature"],
      updateSelection
    );
    mapInterface.promises["firstBuild"] ??= Promise.resolve();
  },
  loadMap: async ([Map, MapView]: [
    typeof Map_,
    typeof MapView_
  ]): Promise<void> => {
    //console.log("buildMap"); //it will thrown an error if called first
    const view = new MapView({
      container: "map",
      map: new Map({ basemap: basemap[0].title, layers: mapInterface.layers }),
      center: [13.234444, -8.838333],
      zoom: 13,
    });
    mapInterface.view = view;
    mapInterface.layers = view.map.layers as any;
    mapInterface.promises["ready"] = view?.when();
    mapInterface.promises["ready"].then(mapInterface.afterLoad);
    return;
  },
  useMap: () => {
    useEffect(() => {
      const updateFeatures = () =>
        (mapInterface.promises["updateFeatures"] = fetch(
          `${document.location.origin}/api/data`,
          {
            method: "GET",
            next: { tags: ["update_features"] },
            cache: "no-store",
          }
        )
          .then((response) => response.json() as Promise<erimServerData>)
          .then(mapInterface.updateFeatures));

      Promise.all([
        (mapInterface.promises["loadMap"] = loadModules<
          [typeof Map_, typeof MapView_]
        >(ArcGisMapPath, { css: true })
          .then(mapInterface.loadMap)
          .catch((err: any) => console.error("Erro no Map", err))),
        updateFeatures(),
      ]);

      const event = new ErimEvent(
        `${document.location.origin}/api/data/refresh`,
        {
          update: function (msg) {
            console.log("update", msg);
            updateFeatures();
          },
        }
      );
      return () => {
        event.clean();
        mapInterface.promises = {};
      };
    }, []);
  },
};
const ArcGisMapPath = ["esri/Map", "esri/views/MapView"];

type FeaturesT = [
  typeof FeatureLayer_,
  typeof Point_,
  typeof Polyline_,
  typeof SimpleRenderer_,
  typeof UniqueValueRenderer_,
  typeof PictureMarkerSymbol_,
  typeof SimpleLineSymbol_,
  typeof Graphic_,
  typeof ColorVariable_
  //  typeof FieldInfo
];

const FeaturesUrl = [
  "esri/layers/FeatureLayer",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/renderers/SimpleRenderer",
  "esri/renderers/UniqueValueRenderer",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Graphic",
  "esri/renderers/visualVariables/ColorVariable",
  //"esri/popup/FieldInfo",
];
export default mapInterface.useMap;
export { mapInterface };

export function getLineFields(): __esri.FieldProperties[] | undefined {
  return [
    {
      name: "lineColor",
      type: "guid",
    },
    {
      name: "FID",
      type: "string",
    },
    {
      name: "power",
      alias: "potência",
      type: "string",
    },
    {
      name: "identificação",
      type: "global-id",
    },
  ];
}
export function getFields<T extends {}>(
  attributes: T
): __esri.FieldProperties[] | undefined {
  return Object.entries(attributes).map(([key, value]) => ({
    name: key,
    alias: key,
    type: typeof value === "number" ? "integer" : "string",
  }));
}

export function updateSelection(some: any) {
  "use client";
  if (some === null) return;
  const id: string =
    mapInterface.view?.popup.selectedFeature?.attributes?.identificação ?? "";
  mapInterface.search.clear();
  if (
    some === false ||
    (mapInterface.search.item?.current?.classList.contains("active") &&
      (mapInterface.search.item?.current?.childNodes.item(1) as HTMLSpanElement)
        .innerText !== id)
  ) {
    mapInterface.search.item?.current?.classList.remove("active");
  }
  const childList = mapInterface.search.item?.current?.parentNode as
    | HTMLElement
    | undefined;

  for (var i = 0; i < (childList?.childElementCount ?? 0); i++) {
    const child = childList!.children.item(i)! as HTMLDivElement;
    if (
      (child.childNodes.item(1) as HTMLSpanElement).innerText === id &&
      !(child as HTMLDivElement).classList.contains("active") &&
      some !== false
    ) {
      childList!.scrollTop = child.offsetTop - childList!.offsetTop;
      mapInterface.search.item!.current = child;
      console.log(child.offsetTop);
      //child.scrollIntoView(autoScrollSettings);
      child.classList.add("active");
    }
  }
}

const autoScrollSettings: ScrollIntoViewOptions = {
  behavior: "smooth",
};
type EventListeners = {
  [key: string]: (this: EventSource, ev: MessageEvent) => any;
};

class ErimEvent {
  source: EventSource;
  listeners: EventListeners;
  errors: number;
  readonly maxErrors = 3;
  clean() {
    this.source.close();
  }
  constructor(url: EventSource["url"], listeners: EventListeners = {}) {
    const self = this;
    this.source = new EventSource(url);
    this.errors = 0;
    this.listeners = {
      ...listeners,
      open: function (this: EventSource, ev: MessageEvent<any>) {
        listeners["open"]?.call(self.source, ev);
        Object.entries(self.listeners).forEach(([key, value]) => {
          self.source.addEventListener(key, value);
        });
      },
      close: function (this: EventSource, ev: MessageEvent<any>) {
        listeners["close"]?.call(self.source, ev);
        Object.entries(self.listeners).forEach(([key, value]) => {
          self.source.removeEventListener(key, value);
        });
      },
      retry: function (this: EventSource, ev: MessageEvent<any>) {
        listeners["retry"]?.call(self.source, ev);
        if (self.errors == self.maxErrors) self.errors = 0;
        self.listeners["close"]!.call(self.source, ev);
        self.source = new EventSource(self.source.url);
        self.listeners["open"]!.call(self.source, ev);
      },
      error: function (this: EventSource, ev: MessageEvent<any>) {
        self.errors++;
        console.log(
          `erro no SSE, error count:${self.errors} ${
            self.errors > self.maxErrors ? ", please reload the WebApp " : ""
          }`,
          this,
          ev
        );
        listeners["error"]?.call(self.source, ev);
        if (self.errors <= self.maxErrors) {
          setTimeout(() => {
            self.listeners["retry"]!.call(self.source, ev);
          }, 3000);
        } else {
          listeners["fail"]?.call(self.source, ev);
          // it will call self.listeners["close"]!.call(self.source, ev)?
          self.source.close();
        }
      },
    };
    Object.entries(self.listeners).forEach(([key, value]) => {
      self.source.addEventListener(key, value);
    });
  }
}
