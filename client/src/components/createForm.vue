<template>
  
     <v-container>
          <v-row>
               <v-col>
                    <v-form>

                         <v-text-field v-model="formData.title" label="Image Title"></v-text-field>
                         <v-text-field v-model="formData.source" label="Image Source"></v-text-field>
                         <!--<v-text-field v-model="formData.imgUrl" label="Image Url (on db server)"></v-text-field>-->
                         <v-file-input 
                              
                              @change="selectFile"
                              show-size
                              accept="image/png, image/jpeg, image/bmp, image/webp">
                         </v-file-input>
                         <v-btn @click="upload" block class="mt-2">Upload</v-btn>


                    </v-form>
                    
               </v-col>
          </v-row>
          
     </v-container>
    
</template>

<script setup>

import { reactive, onMounted, computed, onUnmounted } from 'vue'
import { useTraceStore } from "../stores/imgStore.js";
const store = useTraceStore();

const formData = reactive({
     title: null,
     source: null,
})



const upload = (() => {
     store.writeImage(formData)
})

const selectFile = ((event) => {
     formData.image = event.target.files[0]
     
})



</script>

<style scoped>

</style>
