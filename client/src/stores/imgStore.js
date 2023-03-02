
import { ref, computed } from 'vue'
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
    getAllImage(state){
      return state.images
    },

    getImage(state) {
      if(!state.image) return false
        let image = state.image
        image.url = server+state.image.url
       return image
    }
  },

  actions: {
    async fetchImage(id) {
      try {
        const image = await axios.get(server+apiURL+'image/'+id)
        this.image = image.data
      }
      catch (error) {
        alert(error)
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