<template>
  <div>

    <v-container>
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
      <v-row>
        <v-col class="v-col-8">
          <drawComments v-if="image && traces" :image="image" :traces="traces" @export="saveTrace" />
        </v-col>
        <v-col class="v-col-4">
          <!--<ChartCanvas v-if="image && traces" :image="image" :highlight="highlight" :traces="traces"/>             -->
          <!--<ActivityLog v-if="image && traces" :image="image" :highlight="highlight" :traces="traces" />-->
          <!--<comments id="12ejldf" />-->
          {{ commentsLength }} comments left, {{ traces.length }} mapped
          <div class="controls mb-5">
            <v-btn class="mr-2" @click="save">Save</v-btn>
            <v-btn class="mr-2" @click="skip">Skip</v-btn>
            <v-btn @click="reset">Reset</v-btn>
          </div>

          <ul>
            <!--<li>redditID: {{ comment.id }}</li>-->
            <li><span style="font-weight: bold">{{ comment.author }} </span> ({{ comment.score }}): {{ comment.body }}
            </li>

            <!--<li>date: {{ comment.date }}</li>
            <li>author: {{ comment.author }}</li>
            <li>score: {{ comment.score }}</li>-->
            <li v-if="comment.parentBody" style="font-weight: bold; color: green">parentBody: {{ comment.parentBody }}
            </li>
            <li>category:

              <v-chip-group v-model="newTrace.category" selected-class="text-deep-purple-accent-4">
                <v-chip v-for="category in categories" :key="category.key" :value="category.key">{{
                  category.name }}</v-chip>
              </v-chip-group>
            </li>
            <li><v-checkbox class="ma-0 pa-0" hide-details="true" density="compact" @click="clickNoAnchors"
                v-model="newTrace.createdSeparately" label="no anchors"></v-checkbox></li>
            <div v-if="comment.responses">
              <li>responses ({{ comment.responses.length }}):
                <ul style="overflow-x: hidden;">
                  <li v-for="response in comment.responses" :key="response.id"><span style="font-style: italic">{{
                    response.author }}</span>:&nbsp;&nbsp;{{ response.body }}</li>
                </ul>
              </li>
            </div>
            <li>anchor(s): {{ newTrace.anchors }}</li>
          </ul>

        </v-col>
      </v-row>

      <!--     <CommentForm :display="newTrace.displayForm" :trace="newTrace" :image="image"
        @close="newTrace.displayForm = false" />-->

    </v-container>
  </div>
</template>

<script setup>
//import CommentForm from '../components/CommentForm.vue'
import ActivityLog from '../components/ActivityLog.vue'
import drawComments from '../components/drawComments.vue'
//import comments from '../components/comments.vue'
import { useImageStore } from "../stores/imgStore.js";
import { useTraceStore } from "../stores/traceStore.js";



import { reactive, onMounted, computed, watch, onUnmounted, isProxy, toRaw } from 'vue'
import { useRedditStore } from '../stores/redditStore';

const traceStore = useTraceStore();
const imageStore = useImageStore();
const redditStore = useRedditStore();
//const props = defineProps(['id', 'csv'])
const props = defineProps({
  id: Number,
  csv: {
    type: String,
    required: false
  }
})

const comment = computed(() => {
  return redditStore.currentComment
})

const commentsLength = computed(() => {
  return redditStore.comments.length
})

const newTrace = reactive({
  redditId: null,
  image: props.id,
  text: null,
  date: null,
  score: null,
  category: null,
  author: null,
  anchors: [],
  createdSeparately: false
})

const categories = computed(() => traceStore.getCategories)

onMounted(() => {
  imageStore.fetchImage(props.id)
  traceStore.fetchTraces(props.id);
  redditStore.storeCSV(`/${props.csv}.csv`)
})



/*const openTraceform = (exportTrace) => {
  Object.keys(exportTrace).forEach(key => { newTrace[key] = exportTrace[key] })
  newTrace.displayForm = true
}*/

const saveTrace = (exportTrace) => {
  newTrace.anchors.push(exportTrace)
  //  Object.keys(exportTrace).forEach(key => { newTrace[key] = exportTrace[key] })
  //  newTrace.displayForm = true
}

const save = () => {
  //SVE
  console.log(newTrace)
  traceStore.writeTrace(newTrace)
  redditStore.findNextComment()
  reset()
}

const skip = () => {
  redditStore.findNextComment()
}

const reset = () => {
  newTrace.category = null
  newTrace.anchors = []
}

const image = computed(() => {
  return imageStore.getImage
})

const traces = computed(() => {
  return traceStore.getTraces
})

const clickNoAnchors = (event) => {
  newTrace.anchors = []
}

watch(comment, newComment => {

  const raw = toRaw(traces)
  let needle = raw.value.find(trace => trace.text == newComment.body)
  if (needle) redditStore.findNextComment()

  // newComment.date = new Date(newComment.date * 1000).toISOString();
  newTrace.redditId = newComment.id
  newTrace.text = newComment.body
  newTrace.date = newComment.date
  newTrace.score = newComment.score
  newTrace.parent = newComment.parent
  newTrace.author = newComment.author
  newTrace.responses = newComment.responses

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
</style>
