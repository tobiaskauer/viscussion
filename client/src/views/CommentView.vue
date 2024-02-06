
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


          <!--<tracedImage v-if="image && traces" :image="image" :traces="traces" :touchable="true"
            :tracesSubmitted="tracesSubmitted" light="" @export="openTraceform" />-->
          <img :src="image.url" style="width: 100%">

          <!--<panTraceImage v-if="image && traces" :image="image" :traces="traces" @export="openTraceform" />-->




        </v-col>
        <v-col class="v-col-4">
          <div class="patinaSelector mb-4">
            <!---<PatinaSelector />-->
            <span style="color: white">Filter comments by category</span>
            <CategoryFilter />
            <!--<timeFilter v-if="patina.key == 'Temporal'" />-->
          </div>



          <v-expansion-panels variant="accordion" class="mb-5" v-if="!expandedTrace">
            <v-expansion-panel title="Write a comment">
              <v-expansion-panel-text>
                <v-form @submit.prevent>
                  <v-text-field v-model="input.author" class="mb-2" @change="updateName" variant="solo" label="Name"
                    density="compact" hide-details="auto"></v-text-field>
                  <v-textarea v-model="input.text" :rules="rules" class="mb-2" label="Your response" variant="solo"
                    hide-details="auto"></v-textarea>
                  <v-select label="Category (optional)" :items="categories" item-title="name" item-value="key"
                    v-model="input.category"></v-select>
                  <v-alert type="success" v-model="feedback" density="compact" closable>Your comment has been
                    recorded</v-alert>
                  <v-btn type="submit" @click="writeTrace" block class="mt-2" hide-details="auto">Submit</v-btn>
                </v-form>
              </v-expansion-panel-text>

            </v-expansion-panel>
          </v-expansion-panels>

          <ActivityLog v-if="image && traces" :image="image" :traces="traces" :avatar="false" />
        </v-col>
      </v-row>



    </v-container>
  </div>
</template>

<script setup>

import ActivityLog from '../components/ActivityLog.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";
import { useRouter } from 'vue-router'
import { reactive, nextTick, onMounted, computed, watch, ref, onUnmounted, onBeforeMount } from 'vue'


const traceStore = useTraceStore();
const imageStore = useImageStore();


const router = useRouter()

const props = defineProps(['id'])



const input = reactive({
  redditId: null,
  image: props.id,
  createdSeparately: 1,
  text: null,
  date: null,
  score: null,
  category: null,
  author: null,
  anchors: []
})


const writeTrace = ((e) => {
  //if (e) e.preventDefault()
  traceStore.writeTrace(input)
  traceStore.writeInteraction({
    action: "submitTrace",
    target: "separateView"
  })
})

const feedback = ref(null)
const tracesSubmitted = computed(() => traceStore.tracesSubmitted)
watch(tracesSubmitted, newSubmissionNumber => {
  console.log("watch:", newSubmissionNumber)
  //feebdack needs to be displayed!
  feedback.value = true
  input.text = null
  input.category = null
})

const categories = computed(() => {
  let categories = traceStore.getCategories
  categories.push({ key: null, name: "No category" })
  return categories
})

const authorName = computed(() => {
  let name = traceStore.getAuthorName
  input.author = name
  return name
})

watch(authorName, newName => {
  console.log("watch:", newName)
  input.author = newName
})

const updateName = () => {
  traceStore.saveAuthor(input.author)
}

//let tracesSubmitted = ref(0)

const rules = [
  value => !!value || 'Required.',
  value => (value && value.length >= 3) || 'Min 3 characters',
]


const image = computed(() => {
  return imageStore.getImage
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



const expandedTrace = computed(() => {
  return traceStore.expandedTrace
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
</style>
