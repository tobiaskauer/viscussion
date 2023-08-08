import { ref, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import * as d3 from "d3";

const apiUrl = import.meta.env.VITE_API;

export const useTraceStore = defineStore("trace", {
  state: () => ({
    traces: [], //of a single image
    allTraces: [],
    highlight: null,
    newTrace: null,
    patinas: [
      { key: "None", active: false },
      { key: "Activity", active: true },
      { key: "Responses", active: false },
      { key: "Category", active: false },
      //{ key: "temporal", active: false },
      { key: "Popularity", active: false },
      { key: "Temporal", active: false },
      //{ key: "relation", active: false },
      //{ key: "response", active: false },
    ],
    cardWidth: 250,
    categories: [
      {
        name: "Observation",
        key: "obs",
        display: true,
        plod: "observation",
        description: "What stands out to you in this area?",
      },
      {
        name: "Hypothesis",
        key: "hyp",
        display: true,
        plod: "hypothesis",
        description: "What causes this?",
      },
      {
        name: "Question",
        key: "que",
        display: true,
        plod: "clarification",
        description: "What do you ask yourself about this?",
      },
      {
        name: "Critique",
        key: "cri",
        display: true,
        plod: "critique",
        description: "What's problematic about this area?",
      },
      {
        name: "Context",
        key: "con",
        display: true,
        plod: "additional information",
        description: "What additional knowledge can you provide?",
      },
      {
        name: "Personal Story",
        key: "per",
        display: true,
        plod: "testimony",
        description: "What personal story do you connect to this data?",
      },
      {
        name: "Opinion",
        key: "opi",
        display: true,
        plod: "opinion",
        description: "What do you think of this?",
      },

      {
        name: "Conclusion",
        key: "conclusion",
        display: false,
        plod: "conclusion",
        description: "",
      },
      {
        name: "Proposal",
        key: "proposal",
        display: true,
        plod: "proposal",
        description: "",
      },
    ],
    activeCategories: [],
    fullTimeFrame: [],
    activeTimeFrame: [],
    dimensions: {},
  }),

  getters: {
    getTraces(state) {
      //push new trace to state after it is created but not yet retrieved from the api
      let traces = state.traces;
      if (state.newTrace) traces.push(this.newTrace);

      //filter traces by timeFilter (if present)
      if (this.activeTimeFrame.length > 0) {
        traces = traces.filter((trace) => {
          if (
            trace.date >= this.activeTimeFrame[0] &&
            trace.date <= this.activeTimeFrame[1]
          ) {
            return true;
          }
        });
      }

      //filter by active categories (if present)
      if (this.activeCategories.length > 0) {
        traces = traces.filter((trace) => {
          let bools = this.activeCategories.map((activeCategory) =>
            toRaw(trace.category).includes(activeCategory)
          ); //write array of bools for presence of active category in current trace (ideally, rewrite to break after first occurence)
          return bools.includes(true);
        });
      }
      return traces;
    },

    getResizedTraces: (state) => {
      if (!state.traces) return false;
      let traces = [];

      state.traces.forEach((trace) => {
        trace.anchors.forEach((anchor, i) => {
          traces.push({
            id: !i ? trace.id : trace.id + "-" + i,
            category: trace.category,
            x: Math.round(anchor.x * state.scale),
            y: Math.round(anchor.y * state.scale),
            width: Math.round(anchor.width * state.scale),
            height: Math.round(anchor.height * state.scale),
          });
        });
      });
      return traces.sort((a, b) => a.x * a.y - b.x * b.y); //sort by size
    },

    activePatina: (state) => {
      return state.patinas.find((patina) => patina.active);
    },

    getCategories(state) {
      let categories = state.categories.filter((category) => category.display);
      categories.forEach((category, i) => {
        //category.color = d3.schemePastel1[i];
        category.color = d3.schemeCategory10[i];
      });
      return categories;
    },
    getAllTraces(state) {
      return state.allTraces;
    },
    getHighlight(state) {
      //console.log(state.highlight);

      return state.highlight;
    },
    getNewTrace(state) {
      return state.newTrace;
    },
    /*getRandomAnimal(state) {
      return state.animals[Math.floor(Math.random() * state.animals.length)];
    },*/
    getActiveCategories(state) {
      return state.activeCategories;
    },
  },

  actions: {
    async fetchAllTraces() {
      axios
        .get(apiUrl + "trace")
        .then((traces) => {
          traces.data.forEach((trace) => {
            trace.category = trace.category ? trace.category.split(",") : [];
          });
          this.allTraces = traces.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchTraces(imageId) {
      axios
        .get(apiUrl + "trace/" + imageId)
        .then((traces) => {
          traces.data.forEach((trace) => {
            trace.date = trace.date
              ? new Date(trace.date)
              : new Date(trace.createdAt);
            trace.category = trace.category ? trace.category.split(",") : [];
          });

          this.traces = traces.data;

          let dates = this.traces.map((trace) => trace.date);

          this.fullTimeFrame = [
            Math.floor(new Date(Math.min.apply(null, dates)).getTime() / 1000),
            Math.floor(new Date(Math.max.apply(null, dates)).getTime() / 1000),
          ];
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async writeTrace(payload) {
      try {
        const newTrace = await axios.post(apiUrl + "trace", payload);
        this.newTrace = newTrace.data;
      } catch (error) {
        console.log(error.response);
        // let the form component display the error
        return error;
      }
    },

    setHighlight(trace) {
      console.log(trace);
      this.highlight = trace;
    },
    setActiveTimeFrame(array) {
      this.activeTimeFrame = array;
    },
    setDimensions(object) {
      Object.keys(object).forEach((key) => {
        this.dimensions[key] = object[key];
      });
    },

    setActiveCategories(array) {
      if (array !== this.activeCategories) {
        this.activeCategories = array;
      } else {
        this.activeCategories = [];
      }
    },

    setActivePatina: function (payload) {
      this.activeCategories = []; //dont activate any category
      this.patinas.forEach((patina) => (patina.active = false)); //reset all
      this.patinas.find((patina) => patina.key == payload).active = true;
    },
  },
});
