<template>
     <v-container fluid style="background: #ddd">
          <v-container>
               <v-row>
                    <v-col>
                         <h1>Let's talk <span style="text-decoration:line-through;"> about</span>
                              <span style="font-weight: 900; font-style: italic;"> with</span> data
                              visualization.
                         </h1>
                    </v-col>
               </v-row>
          </v-container>
     </v-container>
     <v-container>
          <v-row v-if="images">

               <v-col class="v-col-3" v-for="image in images" :key="image.id">
                    <router-link :to="'/view/' + image.id">
                         <v-hover>
                              <template v-slot:default="{ isHovering, props }">
                                   <v-card v-bind="props" :color="isHovering ? 'primary' : undefined">
                                        <!--<v-img :src="image.url" contain></v-img>-->
                                        <div style="overflow:hidden">
                                             <tracedImage :image="image" :traces="image.traces" :touchable="false" />
                                        </div>

                                        <v-card-item>
                                             <v-card-text class="">
                                                  <strong>{{ image.title }}</strong>
                                                  (
                                                  <Timeago :datetime="image.createdAt" />)

                                                  <!--<p>{{ images.traces.length }} traces in the </p>-->
                                                  <p v-if="image.traces">{{ image.traces.length }} recorded traces</p>
                                             </v-card-text>
                                        </v-card-item>
                                   </v-card>
                              </template>
                         </v-hover>
                    </router-link>
               </v-col>
          </v-row>
          <v-row>
               <v-col class="v-col-3">
                    <router-link to="create">
                         <v-btn>
                              <v-icon start icon="mdi-plus"></v-icon>
                              Add new
                         </v-btn>
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
     if (!images || !traces) return false
     images.forEach(image => {
          image.traces = traces.filter(trace => trace.image == image.id)
     })
     return images
})


onMounted(() => {
     imageStore.fetchAllImages()
     traceStore.fetchAllTraces()
     traceStore.fetchTraces(null) //reset existing traces
})


</script>

<style scoped></style>
