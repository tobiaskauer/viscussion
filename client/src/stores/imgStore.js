
import { ref, computed } from 'vue'
import { useTraceStore } from "../stores/traceStore.js";

import { defineStore } from 'pinia'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API
const staticUrl = import.meta.env.VITE_STATIC



export const useImageStore = defineStore('image', {
  

  state: () => ({
    images: [],
    image: null,

  }),

  getters: {
    getAllImages(state){
      let images = state.images
      images.forEach(image =>image.url = staticUrl+image.url)
      return images
    },

    getImage(state) {
      if(!state.image) return false
        let image = state.image
        image.url = staticUrl+state.image.url
       return image
    }
  },

  actions: {
    async fetchAllImages() {
      const traceStore = useTraceStore()

try {
        const images = await axios.get(apiUrl+'/image')
        this.images = images.data
      }
      catch (error) {
        console.log(error)
      }
    }, 
    async fetchImage(id) {
      try {
        const image = await axios.get(apiUrl+'/image/'+id)
        this.image = image.data
      }
      catch (error) {
        console.log(error)
      }
    },

    async writeImage(payload) {
      let fd = new FormData()
      fd.append('image', payload.image)
      fd.append('title', payload.title)
      fd.append('source', payload.source)

      

      const image = await axios
      .post(apiUrl+'/image', fd,{
        headers: {'Content-Type': 'multipart/form-data'}
      })
      .catch(err => {
        console.log(err.response.data)
      })

      this.image = image

    },
},
  
})


export const useUserStore = defineStore("user", {
  
})