import { ref, computed } from "vue";
import { useTraceStore } from "../stores/traceStore.js";

import { defineStore } from "pinia";
import axios from "axios";

let apiUrl = import.meta.env.VITE_API;
let staticUrl = import.meta.env.VITE_STATIC;
/*const overrideEnv = import.meta.env.VITE_OVERRIDE;

if (+overrideEnv != 0) {
  //wtf .env parsing....
  apiUrl = "https://viscussion.de:8844/api/";
  staticUrl = "https://viscussion.de:8844/";
}*/

export const useImageStore = defineStore("image", {
  state: () => ({
    images: [],
    image: null,
    deleted: null,
  }),

  getters: {
    getAllImages(state) {
      return state.images;
    },

    getImage(state) {
      if (!state.image) return false;
      let image = state.image;
      image.url = staticUrl + state.image.url;
      return image;
    },
  },

  actions: {
    async fetchAllImages() {
      try {
        const images = await axios.get(apiUrl + "image");
        images.data.forEach((image) => (image.url = staticUrl + image.url));
        this.images = images.data;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchImage(id) {
      try {
        const image = await axios.get(apiUrl + "image/" + id);
        this.image = image.data;
      } catch (error) {
        console.log(error);
      }
    },

    async writeImage(payload) {
      let fd = new FormData();
      fd.append("image", payload.image);
      fd.append("title", payload.title);
      fd.append("source", payload.source);

      const image = await axios
        .post(apiUrl + "image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .catch((err) => {
          console.log(err.response.data);
        });

      this.image = image;
      return this.image;
    },

    async toggleVisibility(id, visibility) {
      let newValue = visibility ? { visible: 0 } : { visible: 1 };
      try {
        response = await axios.put(apiUrl + "image/" + id, newValue);
      } catch (error) {
        console.log(error);
      }
    },

    async deleteImage(id) {
      try {
        const response = await axios.delete(apiUrl + "image/" + id);
        this.deleted = response.data;
        let deleteIndex = this.images.findIndex((image) => image.id == id);
        this.images.splice(deleteIndex, 1);
        console.log(this.deleted);
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export const useUserStore = defineStore("user", {});
