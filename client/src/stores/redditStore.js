import { ref, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import * as d3 from "d3";

const apiUrl = import.meta.env.VITE_API;

export const useRedditStore = defineStore("reddit", {
  state: () => ({
    comments: [],
    currentComment: {},
  }),

  actions: {
    findNextComment: function () {
      let currentIndex = this.comments.findIndex(
        (comment) => comment.id == this.currentComment.id
      );

      for (let i = currentIndex + 1; i < this.comments.length; i++) {
        if (!this.comments[i].parent) {
          this.currentComment = this.comments[i];
          break;
        }
      }
    },

    storeCSV: function (payload) {
      d3.csv(payload).then((data) => {
        this.comments = data.map((row) => {
          row.parent = row.parent == "false" ? false : row.parent;
          return row;
        });
        this.currentComment = this.comments[0];
      });
    },
    async writeTrace(payload) {
      try {
        const newTrace = await axios.post(apiUrl + "trace", payload);
        this.newTrace = newTrace.data;
      } catch (error) {
        console.log(error.response);
        return error;
      }
    },
  },
});
