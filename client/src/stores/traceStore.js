import { ref, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import * as d3 from "d3";

const apiUrl = import.meta.env.VITE_API;

export const useTraceStore = defineStore("trace", {
  state: () => ({
    traces: [], //of a single image
    allTraces: [],
    highlight: null, //currently hovered Trace
    expandedTrace: null, //root trace for threaded (detailed) view on Activity Log
    traceLinks: null, //for relation view
    newTrace: null,
    author: null, //save author for the ongoing session
    timeControls: {},
    sorting: {},
    patinas: [
      { key: "None", active: true, icon: "" },
      { key: "Activity", active: false, icon: "mdi-layers-triple-outline" },
      //{ key: "Responses", active: false, icon: "mdi-comment-outline" },
      { key: "Category", active: false, icon: "mdi-label-outline" },
      { key: "Popularity", active: false, icon: "mdi-heart-outline" },
      { key: "Temporal", active: false, icon: "mdi-clock-outline" },
      { key: "Relation", active: false, icon: "mdi-vector-line" },
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
      //if (state.newTrace) traces.push(this.newTrace);

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

      //filter multiple anchors
      if (this.activePatina.key == "Relation") {
        traces = this.traces.filter((trace) => trace.anchors.length >= 2);
        console.log(traces);

        this.traceLinks = traces.map((trace) => {
          return {
            //trace: trace,
            x1: trace.anchors[0].x + trace.anchors[0].width / 2,
            x2: trace.anchors[1].x + trace.anchors[1].width / 2,
            y1: trace.anchors[0].y + trace.anchors[0].height / 2,
            y2: trace.anchors[1].y + trace.anchors[1].height / 2,
          };
        });
      }

      //filter by active categories (if present)
      if (this.activeCategories.length > 0 && this.activeCategories[0]) {
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
      if (!imageId) this.traces = [];
      axios
        .get(apiUrl + "trace/" + imageId)
        .then((traces) => {
          if (traces.data.length > 0) {
            traces.data.forEach((trace) => {
              trace.date = trace.date
                ? new Date(trace.date)
                : new Date(trace.createdAt);
              trace.category = trace.category ? trace.category.split(",") : [];
              trace.responses = traces.data.filter((x) => x.parent == trace.id);
            });

            this.traces = traces.data.filter((trace) => !trace.parent);
          } else {
            this.traces = [
              {
                id: 0,
                author: "viscussion admin",
                date: new Date(),
                text: "Be the first to respond",
                anchors: [],
              },
            ];
          }
          const dates = this.traces.map((trace) => trace.date);
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
      if (payload.parent) {
        //if it's a response, check if it may be to a reddit conversation and find the correct key
        if (!this.traces.map((trace) => trace.id).includes(payload.parent)) {
          let redditParent = this.traces.find(
            (trace) => trace.redditCommentId == payload.parent
          ).id;

          payload.parent = redditParent ? redditParent : undefined;
        }
      }

      try {
        const newTrace = await axios.post(apiUrl + "trace", payload);
        //this.newTrace = newTrace.data;

        newTrace.date = newTrace.date
          ? new Date(newTrace.date) //use reddit date if possible
          : new Date(newTrace.createdAt);

        if (newTrace.data.parent) {
          this.traces
            .find((trace) => trace.id == payload.parent)
            .responses.push(newTrace.data);
        } else {
          console.log(newTrace.data);
          this.traces.push(newTrace.data);
        }
      } catch (error) {
        console.log(error);
        // let the form component display the error
        return error;
      }

      this.author = payload.author;
    },

    async deleteTrace(id) {
      try {
        const response = await axios.delete(apiUrl + "trace/" + id);
        this.deleted = response.data;
        let deleteIndex = this.traces.findIndex((image) => image.id == id);
        this.traces.splice(deleteIndex, 1);
        console.log(this.deleted);
      } catch (error) {
        console.log(error);
      }
    },

    async upvote(payload) {
      axios
        .post(apiUrl + "trace/" + payload.id)
        .then((response) => {
          //we're just doing that without checking in with the db in the frontend.
          /*      let upvotedTrace = this.traces.find(
            (trace) => trace.id == payload.id
          );

          if (!upvotedTrace && payload.parent) {
            let parent = this.traces.find(
              (trace) => (trace.id = payload.parent)
            );
            upvotedTrace = parent.responses.find(
              (response) => response.id == payload.id
            );
            parent.updated = true;
            console.log(upvotedTrace);

            //search in responses
          }

          upvotedTrace.score++;*/
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setHighlight(trace) {
      this.highlight = trace;
    },

    expand(trace) {
      this.expandedTrace = trace;
    },

    setSorting(object) {
      this.sorting = object;
    },

    setActiveTimeFrame(array) {
      this.activeTimeFrame = array;
    },
    setDimensions(object) {
      if (!object) {
        this.dimensions = {};
      } else {
        Object.keys(object).forEach((key) => {
          this.dimensions[key] = object[key];
        });
      }
    },
    setTimeControls(object) {
      Object.keys(object).forEach((key) => {
        this.timeControls[key] = object[key];
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
      this.activeTimeFrame = this.fullTimeFrame.map(
        (time) => new Date(time * 1000) //don't filter by time
      );
      this.traceLinks = null; //don't show linked traces
      this.expandedTrace = null; //exit detail view

      this.patinas.forEach((patina) => (patina.active = false)); //reset all
      this.patinas.find((patina) => patina.key == payload).active = true; //set currently selected
    },
  },
});
