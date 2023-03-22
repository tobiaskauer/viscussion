import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API



export const useTraceStore = defineStore('trace', {

  state: () => ({
    traces: [], //of a single image
    allTraces: [],
    highlight: null,
    newTrace: null,
    animals: ["Giraffe", "Snake", "Lion", "Tiger", "Gorilla", "Fox", "Kangaroo", "Squirrel", "Elephant", "Crocodile", "Otter", "Capybara", "Unicorn", "Dog", "Cat"],
    categories: [
      {name:"Observation", key:"obs", display: true, plod: "observation", description: "What stands out to you in this area?"},
      {name:"Hypothesis", key:"hyp", display: true, plod: "hypothesis", description: "What causes this?"},
      {name:"Question", key:"que", display: true, plod: "clarification", description: "What do you ask yourself about this?"},
      {name:"Problem", key:"pro", display: true, plod: "critique", description: "What's problematic about this area?"},
      {name:"Context", key:"con", display: true, plod: "additional information", description: "What additional knowledge can you provide?"},
      {name:"Personal Story", key:"per", display: true, plod: "testimony", description: "What personal story do you connect to this data?"},
      {name:"Opinion", key:"opi", display: true, plod: "opinion", description: "What do you think of this?"},

      {name:"Conclusion", key:"conclusion", display: false, plod: "conclusion", description: ""},
      {name:"Proposal", key:"proposal", display: false, plod: "proposal", description: ""},
    ],
    activeCategories: []
  }),

  getters: {
    getTraces(state){
      //push new trace to state after it is created but not yet retrieved from the api
      let traces = state.traces
      if(state.newTrace) traces.push(this.newTrace)
      
      //filter by active categories (if present)
      if(this.activeCategories.length > 0) {
        traces = traces.filter(trace => {
          let bools = this.activeCategories.map(activeCategory => toRaw(trace.category).includes(activeCategory)) //write array of bools for presence of active category in current trace (ideally, rewrite to break after first occurence)
          return bools.includes(true)           
        })
      }
      return traces
    },
    getCategories(state) {
      return state.categories.filter(category => category.display)
    },
    getAllTraces(state){
      return state.allTraces
    },
    getHighlight(state){
      return state.highlight
    },
    getNewTrace(state){
      return state.newTrace
    },
    getRandomAnimal(state) {
      return state.animals[Math.floor(Math.random()*state.animals.length)]
    },
    getActiveCategories(state){
      return state.activeCategories
    }
  },
  

  actions: {
    async fetchAllTraces() {
      axios.get(apiUrl+'/trace')
      .then(traces => {
        traces.data.forEach(trace => {
          trace.category = (trace.category) ? trace.category.split(",") : []
        })
        this.allTraces = traces.data
      })
      .catch(error => {
        console.log(error)
      })
    },
    async fetchTraces(imageId) {
      /*try {
        
        const traces = await axios.get('http://localhost:8080/api/trace/'+imageId)
        console.log(traces.data)
        traces.data.forEach(trace => {
          trace.category = trace.category.split(",")
          console.log(trace.category)
          
        })
        this.traces = traces.data

      }
      catch (error) {
        
        console.log(error)
      }*/

      axios.get(apiUrl+'trace/'+imageId)
      .then(traces => {
        traces.data.forEach(trace => {
          trace.category = (trace.category) ? trace.category.split(",") : []
        })
        this.traces = traces.data
      })
      .catch(error => {
        console.log(error)
      })
    },

    async writeTrace(payload) {
      try {
        const newTrace = await axios.post(apiUrl+'/trace', payload)
        this.newTrace = newTrace.data
        
      } catch (error) {
        console.log(error.response)
        // let the form component display the error
        return error
      }
    },

    setHighlight(id) {
      this.highlight = id
    },

    setActiveCategories(array) {
      this.activeCategories = array
    }


},
  
})