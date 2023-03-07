<template>
     <v-container>
          <v-snackbar
          v-model="snackbar.display"
      
      >
        {{snackbar.message}}
  
        <template v-slot:actions>
          <v-btn
            color="primary"
            variant="text"
            @click="snackbar.display = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
     <v-row>
          <v-col>
               <h2 class="mr-2">{{ image.title }}</h2>
               <v-btn size="x-small" color="primary" target="_blank" :href="image.source">source</v-btn>
          </v-col>
     </v-row>
     <v-row>
          <v-col class="v-col-8">
               <ChartCanvas v-if="image && traces" :image="image" :highlight="highlight" :traces="traces"/>
          </v-col>
          <v-col class="v-col-4 pt-0">
               <ActivityLog v-if="image && traces" :image="image" :highlight="highlight" :traces="traces"/>
          </v-col>
     </v-row>

</v-container>
    
</template>

<script setup>
import ChartCanvas from './ChartCanvas.vue'
import ActivityLog from './ActivityLog.vue'
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";

import { reactive, onMounted, computed, watch, onUnmounted } from 'vue'
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

const snackbar = reactive({
     display: false,
     message: null
})

const newTrace = computed(() => {     
     return traceStore.getNewTrace
})

watch(newTrace, newTrace => {
     snackbar.display = true
     snackbar.message = "Trace #"+newTrace.id+" has been recorded." 
})


const highlight = computed(() => {     
     return traceStore.getHighlight
})
</script>

<style scoped>
     h2{
          display: inline;
     }
</style>
