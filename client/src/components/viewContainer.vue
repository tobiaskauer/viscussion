<template>
     <v-container>
     <v-row>
          <v-col>
               <h2 class="mr-2">{{ image.title }}</h2>
               <v-btn size="x-small" color="primary" target="_blank" :href="image.source">source</v-btn>
          </v-col>
     </v-row>
     <v-row>
          <v-col class="v-col-8">
               <ChartCanvas v-if="image && traces" :image="image" :traces="traces"/>
          </v-col>
          <v-col class="v-col-4 pt-0">
               <ActivityLog v-if="image && traces" :image="image" :traces="traces"/>
          </v-col>
     </v-row>
</v-container>
    
</template>

<script setup>
import ChartCanvas from './ChartCanvas.vue'
import ActivityLog from './ActivityLog.vue'
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";

import { reactive, onMounted, computed, onUnmounted } from 'vue'
const traceStore = useTraceStore();
const imageStore = useImageStore();


const props = defineProps(['id'])
onMounted(() => {
     imageStore.fetchImage(props.id)
     traceStore.fetchTraces(props.id);
})

const image = computed(() => {     
     return imageStore.getImage
})

const traces = computed(() => {     
     return traceStore.getTraces
})
</script>

<style scoped>
     h2{
          display: inline;
     }
</style>
