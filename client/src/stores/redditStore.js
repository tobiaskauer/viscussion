import { ref, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import * as d3 from "d3";
import { useTraceStore } from "./traceStore.js";
const traceStore = useTraceStore();

const apiUrl = import.meta.env.VITE_API;

export const useRedditStore = defineStore("reddit", {
  state: () => ({
    comments: [],
    currentComment: {},
  }),

  actions: {
    findNextComment: function () {
      const existingTraces = traceStore.getTraces;
      let currentIndex = this.comments.findIndex(
        (comment) => comment.id == this.currentComment.id
      );

      this.currentComment = this.comments[currentIndex + 1];

      /*for (let i = currentIndex + 1; i < this.comments.length; i++) {
        //loop may be necessary to skip unwanted comments (e.g. deleted or removed ones)

        this.currentComment = this.comments[currentIndex + 1];

        if (this.currentComment.parent) {
          this.currentComment.parentBody = this.comments.find(
            (comment) => comment.id == this.currentComment.parent
          ).body;
        }

        let unwanted = ["[removed]"];

        let existingTrace = existingTraces.find(
          (comment) => comment.redditCommentId == this.currentComment.id
        );

        if (existingTrace) {
          //console.log(existingTrace);
        } else {
          break;
        }
      }*/
    },

    storeCSV: function (payload) {
      d3.csv(payload).then((data) => {
        this.comments = data.map((row) => {
          row.parent =
            row.parent == "false" || row.parent == "False" ? false : row.parent; //make sure false is false
          row.date = new Date(row.date * 1000).toISOString();
          return row;
        });

        //console.log(this.comments);

        let commentTree = [];
        this.comments.forEach((comment) => {
          if (!comment.parent) {
            comment.responses = [];
            commentTree.push(comment);
          }
        });

        this.comments.forEach((comment) => {
          if (comment.parent) {
            let parent = commentTree.find((root) => root.id == comment.parent);
            parent.responses.push(comment);
          }
        });

        //filter comments that are already in db
        const existingTraces = traceStore.getTraces;
        this.comments = commentTree.filter(
          (newComment) =>
            !existingTraces
              .map((existing) => existing.redditCommentId) //compare with reddit id, because csv wouldnt know the id in the db
              .includes(newComment.id)
        );

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
