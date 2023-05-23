import { defineStore } from "pinia";
import json from "../assets/unemployment-across-industries.json";

export const useVisualizationStore = defineStore("visualization", {
  state: () => {
    return {
      data: json,
      spec: {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        width: 600,
        height: 600,
        //data: { url: 'unemployment-across-industries.json' },
        data: { values: json },
        mark: "area",
        encoding: {
          x: {
            timeUnit: "yearmonth",
            field: "date",
            axis: { format: "%Y" },
          },
          y: {
            aggregate: "sum",
            field: "count",
          },
          color: {
            field: "series",
            scale: { scheme: "category20b" },
          },
        },
      },
    };
  },
  getters: {
    getSpec: (state) => state.spec,
  },
});
