<template>
  <div>
    <!--<v-container :fluid="true">-->
    <v-container>
      <v-row class="py-5">
        <v-col class="v-col-8">

          <div class="mb-5">

            <h2>{{ image.title }}</h2>
            <v-btn size="x-small" color="primary" target="_blank" :href="image.source">source</v-btn>
          </div>


          <tracedImage v-if="image && traces" :image="image" :traces="traces" :touchable="true"
            :tracesSubmitted="tracesSubmitted" light="" @export="openTraceform" />




        </v-col>
        <v-col class="v-col-4">
          <div class="patinaSelector mb-4">
            <PatinaSelector />
            <CategoryFilter v-if="patina.key == 'Category'" />
            <timeFilter v-if="patina.key == 'Temporal'" />
          </div>
          <ActivityLog v-if="image && traces" :image="image" :traces="traces" />
        </v-col>
      </v-row>
      <TraceForm :display="displayForm.bool" :trace="newTraces" :image="image" @addAnchor="addAnchor" @close="close" />

    </v-container>
  </div>
</template>

<script setup>
import TraceForm from '../components/TraceForm.vue'
import ActivityLog from '../components/ActivityLog.vue'
import tracedImage from '../components/tracedImage.vue'
import PatinaSelector from '../components/patinaSelector.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import TimeFilter from '../components/TimeFilter.vue'
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";
import { useRouter } from 'vue-router'
import { reactive, nextTick, onMounted, computed, watch, ref, onUnmounted, onBeforeMount } from 'vue'


const traceStore = useTraceStore();
const imageStore = useImageStore();


const router = useRouter()

const props = defineProps(['id'])

let tracesSubmitted = ref(0)


const image = computed(() => {
  return imageStore.getImage
})

const patina = computed(() => {
  return traceStore.activePatina
})

onBeforeMount(() => {
  //traceStore.$reset()
  //traceStore.setDimensions()
  imageStore.fetchImage(props.id)
  traceStore.fetchTraces(props.id);
})

onMounted(() => {
  setTimeout(() => {

    if (traces.value.length < 1) {
      router.go() //if traces aren't loaded after 200ms, reload the page --> What about images without traces?
    }
  }, 200)

})

onUnmounted(() => {
  //console.log(image.value)
  //console.log(traces.value)
})

const newTraces = ref([])

const displayForm = reactive({
  bool: false,
})



const openTraceform = (exportTrace) => {
  newTraces.value = exportTrace.value
  displayForm.bool = true
  traceStore.writeInteraction({
    action: "openTraceForm"
  })
}

const addAnchor = () => {
  displayForm.bool = false
}

const close = () => {
  traceStore.closeTrace()
  displayForm.bool = false
  //setTimeout(router.go(), 10000);

  //router.go() //reload whole page to make sure traces you submitted are visible. (traffic horror.) //deactivate for debugging
}



const traces = computed(() => {
  return traceStore.getTraces
})

const snackbar = reactive({
  display: false,
  message: null
})



/*const highlight = computed(() => {
  return traceStore.getHighlight
})*/
</script>

<style scoped>
h2 {
  display: inline;
}

.patinaSelector {
  background: rgba(var(--v-theme-primary));
  border-radius: 5px;
  margin: 0;
  padding: 10px;
}
</style>
