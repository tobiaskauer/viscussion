
import { ref, computed } from 'vue'
import { useTraceStore } from "../stores/traceStore.js";

import { defineStore } from 'pinia'
import axios from 'axios'

const server = 'http://localhost:8080/'
const apiURL = "api/"

export const useImageStore = defineStore('image', {
  

  state: () => ({
    images: [],
    image: null,

  }),

  getters: {
    getAllImages(state){
      let images = state.images
      images.forEach(image =>image.url = server+image.url)
      return images
    },

    getImage(state) {
      if(!state.image) return false
        let image = state.image
        image.url = server+state.image.url
       return image
    }
  },

  actions: {
    async fetchAllImages() {
      const traceStore = useTraceStore()

try {
        const images = await axios.get(server+apiURL+'image')
        this.images = images.data
        console.log(images.data)
        
      }
      catch (error) {
        console.log(error)
      }
    }, 
    async fetchImage(id) {
      try {
        const image = await axios.get(server+apiURL+'image/'+id)
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
      .post('http://localhost:8080/api/image', fd,{
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