import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'




export const useTraceStore = defineStore('trace', {

  state: () => ({
    traces: [], //of a single image
    allTraces: []

  }),

  getters: {
    getTraces(state){
      return state.traces
    },
    getAllTraces(state){
      return state.allTraces
    }
  },

  actions: {
    async fetchAllTraces() {
      try {
        const allTraces = await axios.get('http://localhost:8080/api/trace')
        this.allTraces = allTraces.data
      }
      catch (error) {
        
        console.log(error)
      }
    },
    async fetchTraces(imageId) {
      try {
        const traces = await axios.get('http://localhost:8080/api/trace/'+imageId)
        this.traces = traces.data
      }
      catch (error) {
        
        console.log(error)
      }
    },

    async writeTrace(payload) {
      try {
        const newTrace = await axios.post('http://localhost:8080/api/trace', payload)
      } catch (error) {
        console.log(error.response)
        // let the form component display the error
        return error
      }
    },
},
  
})


export const useUserStore = defineStore("user", {
  
})