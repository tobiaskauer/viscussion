<template>
  
     <v-container>
          <v-row v-if="images">
               
               <v-col class="v-col-3" v-for="image in images" :key="image.id">
                    <router-link :to="'/view/'+image.id">
                    <v-hover>
  <template v-slot:default="{ isHovering, props }">
    <v-card
      v-bind="props"
      :color="isHovering ? 'primary' : undefined"
    >
    <!--<v-img :src="image.url" contain></v-img>-->
    <tracedImage :image="image" :traces="image.traces"></tracedImage>
                         <v-card-item>
                              <v-card-text class="">
                                   <strong>{{ image.title }}</strong>
                                   (<Timeago :datetime="image.createdAt" />)
                                   
                                   <!--<p>{{ images.traces.length }} traces in the </p>-->
                                   <p v-if="image.traces">{{ image.traces.length }} recorded traces</p>
                              </v-card-text>
                         </v-card-item></v-card>
  </template>
</v-hover>
               </router-link>
               </v-col>
               <v-col class="v-col-3">
                    <router-link to="create">
                    <v-hover>
                         <template v-slot:default="{isHovering, props}">
                         <v-card min-height="200px" v-bind="props" :color="isHovering ? 'primary' : undefined ">
                              <v-card-text>
                                   <v-btn>
                                   <v-icon start icon="mdi-vuetify"></v-icon>
                                   Add new
                                   </v-btn>
                              </v-card-text>
                              

                              
                         </v-card>
                         </template>
                    </v-hover>
               </router-link>
               </v-col>
          
          </v-row>
     </v-container>
    
</template>

<script setup>
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";
import tracedImage from "./tracedImage.vue";

import { reactive, onMounted, computed, onUnmounted } from 'vue'
const traceStore = useTraceStore();
const imageStore = useImageStore();

const images = computed(() => {
     let images = imageStore.getAllImages
     let traces = traceStore.getAllTraces
     if(!images || !traces) return false
     images.forEach(image => {
          image.traces = traces.filter(trace => trace.image == image.id)
     })     
     return images
})


onMounted(() => {
     imageStore.fetchAllImages()
     traceStore.fetchAllTraces()
})


</script>

<style scoped>

</style>
