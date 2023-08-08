<template>
  <div>
    <!-- <svgOverlay /> -->
    <v-container v-resize="getDimensions">
      <v-snackbar v-model="snackbar.display">
        {{ snackbar.message }}

        <template v-slot:actions>
          <v-btn color="primary" variant="text" @click="snackbar.display = false">
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

      <PatinaSelector />

      <CategoryFilter v-if="patina.key == 'Category'" />
      <timeFilter />

      <v-row>
        <v-col class="v-col-8 pa-0">
          <div ref="wrapper">
            <tracedImage v-if="image && traces" :image="image" :traces="traces" @export="openTraceform" />
          </div>
        </v-col>
        <v-col class="v-col-4 pt-0">
          <ActivityLog v-if="image && traces" :image="image" :highlight="highlight" :traces="traces" />


        </v-col>

      </v-row>
      <TraceForm :display="newTrace.displayForm" :trace="newTrace" :image="image" @close="newTrace.displayForm = false" />

    </v-container>
  </div>
</template>

<script setup>
import TraceForm from '../components/TraceForm.vue'
import ActivityLog from '../components/ActivityLog.vue'
import tracedImage from '../components/tracedImage.vue'
import PatinaSelector from '../components/patinaSelector.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
//import svgOverlay from '../components/svgOverlay.vue'
//import TimeFilter from '../components/TimeFilter.vue'
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";
import { reactive, nextTick, onMounted, computed, watch, ref, onUnmounted } from 'vue'


const traceStore = useTraceStore();
const imageStore = useImageStore();

imageStore.fetchImage(props.id)
traceStore.fetchTraces(props.id);

const props = defineProps(['id'])
const wrapper = ref(null)

const image = computed(() => {
  return imageStore.getImage
})

watch(image, newImage => {
  getDimensions()
})

const getDimensions = () => {
  let bBox = wrapper.value.getBoundingClientRect()
  let scale = bBox.width / image.value.width

  let dimensions = {
    offsetX: bBox.x,
    offsetY: bBox.y,
    width: bBox.width,
    scale: scale,
    height: image.value.height * scale
  }
  traceStore.setDimensions(dimensions)
}

const patina = computed(() => {
  return traceStore.activePatina
})


const newTrace = reactive({
  displayForm: false,



})

const openTraceform = (exportTrace) => {

  Object.keys(exportTrace).forEach(key => { newTrace[key] = exportTrace[key] })
  newTrace.displayForm = true
  console.log(newTrace)

}



const traces = computed(() => {
  return traceStore.getTraces
})

const snackbar = reactive({
  display: false,
  message: null
})

/*const newTrace = computed(() => {     
     return traceStore.getNewTrace
})*/

/*watch(newTrace, newTrace => {
     snackbar.display = true
     snackbar.message = "Trace #"+newTrace.id+" has been recorded." 
})*/


const highlight = computed(() => {
  return traceStore.getHighlight
})
</script>

<style scoped>
h2 {
  display: inline;
}
</style>
