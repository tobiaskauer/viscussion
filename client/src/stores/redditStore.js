import { ref, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import * as d3 from "d3";

const apiUrl = import.meta.env.VITE_API;
/*const overrideEnv = true;
if (overrideEnv) apiUrl = "https://viscussion.de:8844/api/";*/

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
        //loop may be necessary to skip unwanted comments (e.g. deleted or removed ones)
        this.currentComment = this.comments[currentIndex + 1];
        if (this.currentComment.parent) {
          this.currentComment.parentBody = this.comments.find(
            (comment) => comment.id == this.currentComment.parent
          ).body;
        }

        let unwanted = ["[removed]"];

        /*if (
          !unwanted.includes(this.currentComment.body) ||
          !unwanted.includes(this.currentComment.parentBody)
        ) {
          console.log(this.currentComment.parentBody);
          //check if comment or parent are unwanted content, if not break the loop to set the comment
          break;
        }*/
        break;
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
