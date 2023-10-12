import { ref, computed, toRaw } from "vue";
import { defineStore } from "pinia";

export const useSettingStore = defineStore("setting", {
  state: () => ({
    patinas: [
      { key: "Activity", active: true },
      { key: "Category", active: false },
      //{ key: "temporal", active: false },
      { key: "Popularity", active: false },
      //{ key: "relation", active: false },
      //{ key: "response", active: false },
    ],
  }),
  getters: {
    activePatina: (state) => {
      return state.patinas.filter((patina) => patina.active);
    },
  },
  actions: {
    setActive: function (payload) {
      this.patinas.forEach((patina) => (patina.active = false));
      console.log(this.patinas);
      this.patinas.find((patina) => patina.key == payload).active = true;
    },
  },
});
