<template>
  <div>
    <!--<v-container :fluid="true">-->
    <v-container>
      <v-row class="py-5">
        <v-col class="v-col-8">
          <div class="">
            <h2>{{ image.title }}</h2>
            <v-btn size="x-small" color="primary" target="_blank" :href="image.source">source</v-btn>
            <p><v-icon>mdi-crop</v-icon> Drag on the visualization to place a comment.</p>
          </div>


          <tracedImage v-if="image && traces" :image="image" :traces="traces" :touchable="true"
            :tracesSubmitted="tracesSubmitted" light="" @export="openTraceform" />
          <!--<fogOfWar v-if="image && traces" :image="image" :traces="traces" :touchable="true"
            :tracesSubmitted="tracesSubmitted" light="" @export="openTraceform" />-->
          <!--<panTraceImage v-if="image && traces" :image="image" :traces="traces" @export="openTraceform" />-->

          <v-checkbox v-model="hideComments" hide-details class="ml-0 pl-0 shrink" density="compact"
            label="Hide Comments"></v-checkbox>

        </v-col>
        <v-col class="v-col-4">
          <div class="patinaSelector mb-4">
            <PatinaSelector />
            <CategoryFilter v-if="patina.key == 'Category'" />
            <!--<timeFilter v-if="patina.key == 'Temporal'" />-->
          </div>
          <ActivityLog v-if="image && traces" :image="image" :traces="traces" :avatar="true" />
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
//import fogOfWar from '../components/fogOfWar.vue'
//import panTraceImage from '../components/panTraceImage.vue'
import PatinaSelector from '../components/patinaSelector.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
//import TimeFilter from '../components/TimeFilter.vue'
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";
import { useRouter } from 'vue-router'
import { reactive, onMounted, computed, watch, ref, onBeforeMount } from 'vue'


const traceStore = useTraceStore();
const imageStore = useImageStore();


const router = useRouter()
const props = defineProps(['id'])

let tracesSubmitted = ref(0)
let hideComments = ref(false)
let priorPatina = ref(null)


const image = computed(() => {
  return imageStore.getImage
})

const patina = computed(() => {
  return traceStore.activePatina
})

onBeforeMount(() => {
  imageStore.fetchImage(props.id)
  traceStore.fetchTraces(props.id, { excludeSeparatedTraces: true });
})

onMounted(() => {
  setTimeout(() => {
    if (traces.value.length < 1) {
      router.go() //if traces aren't loaded after 200ms, reload the page --> What about images without traces?
    }
  }, 200)

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
}

const traces = computed(() => {
  return traceStore.getTraces
})

watch(hideComments, newStatus => {
  if (newStatus) {
    priorPatina.value = patina.value.key
    traceStore.setActivePatina("None")
  } else {
    traceStore.setActivePatina(priorPatina.value)
  }
})
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

.v-selection-control {
  display: none;
  min-height: none;
}

.v-selection-control--density-default {}
</style>
