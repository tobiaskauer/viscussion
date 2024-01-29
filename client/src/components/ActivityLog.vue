<template>
  <!-- TEMPLATE FOR CONVERSATION VIEW-->
  <template v-if="expandedTrace">
    <v-btn size="small" class="mb-5" @click="resetExpand">
      <v-icon>mdi-arrow-collapse-left</v-icon> view all
    </v-btn>
    <TransitionGroup tag="ul" name="list" ref="list" id="annotationList">
      <li key="root">
        <CommentCard :response="false" :avatar="props.avatar" :trace="expandedTrace" :image="props.image"
          :width="avatar.width" @mouseenter="setHighlight(expandedTrace)" @mouseleave="setHighlight(null)" />
      </li>
      <li key="button" align="right"> <v-btn size="small" variant="text">Responses</v-btn></li>

      <li v-for="(trace, index) in expandedTrace.responses" :key="'tracelog-' + trace.id"
        @mouseenter="setHighlight(trace)" @mouseleave="setHighlight(null)">
        <CommentCard :response="true" :avatar="!trace.parent" :trace="trace" :image="props.image" :width="avatar.width" />
      </li>
      <li class="pl-5 mt-5" key="form">

        <v-form @submit.prevent>
          <v-text-field v-model="response.author" class="mb-2" @change="updateName" variant="solo" label="Name"
            density="compact" hide-details="auto"></v-text-field>
          <v-textarea v-model="response.text" :rules="rules" class="mb-2" label="Your response" variant="solo"
            hide-details="auto"></v-textarea>
          <v-btn type="submit" @click="writeTrace" block class="my-2" hide-details="auto">Submit</v-btn>
        </v-form>
      </li>
    </TransitionGroup>
  </template>





  <!-- TEMPLATE FOR ANNOTATION OVERVIEW-->
  <template v-else>
    <div class="pb-5">
      <small>Sort by:</small>

      <v-btn @click="sort(facet)" size="x-small" :variant="facet.active ? 'elevated' : 'plain'"
        v-for="facet, i in sorting">
        <v-icon>{{ facet.icon }}</v-icon>
        {{ facet.key }}
        <v-icon v-if="facet.descending">mdi-chevron-down</v-icon>
        <v-icon v-else>mdi-chevron-up</v-icon>
      </v-btn>

    </div>
    <TransitionGroup tag="ul" name="list" ref="list" id="annotationList">
      <li v-for="(trace, index) in sortedTraces" :key="'tracelog-' + trace.id" @mouseenter="setHighlight(trace)"
        @mouseleave="setHighlight(null)">
        <CommentCard :avatar="props.avatar" :trace="trace" :image="props.image" :width="avatar.width" />
      </li>

    </TransitionGroup>
  </template>
</template>

<script setup>
//import original from '../assets/chess.webp'
import { reactive, onMounted, computed, ref, watch, nextTick, onUnmounted } from 'vue'
import CommentCard from './CommentCard.vue'
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();
const props = defineProps(['image', 'traces', 'view'])

const avatar = reactive({ width: null })
const list = ref(null)

const initialInput = {
  author: traceStore.author,
  text: null,
  image: null,
  parent: null
}

const patina = computed(() => traceStore.activePatina)
watch(patina, newPatina => {


  if (newPatina.key == "Popularity") {
    sorting.value.find(x => x.active).active = false
    let facet = sorting.value.find(x => x.key == 'Popularity')
    facet.active = true
    facet.descending = true
  } else if (newPatina.key == "Temporal") {
    sorting.value.find(x => x.active).active = false
    let facet = sorting.value.find(x => x.key == 'Date')
    facet.active = true
    facet.descending = true
  } else if (newPatina.key == "Responses") {
    sorting.value.find(x => x.active).active = false
    let facet = sorting.value.find(x => x.key == 'Responses')
    facet.active = true
    facet.descending = true
  }
})

const sorting = ref([
  { key: 'Date', active: true, descending: true, icon: 'mdi-clock-outline' },
  { key: 'Popularity', active: false, descending: true, icon: 'mdi-heart-outline' },
  { key: 'Responses', active: false, descending: true, icon: 'mdi-comment-outline' },
])

const sort = (facet) => {
  let currentlyActive = sorting.value.find(x => x.active)


  if (currentlyActive.key === facet.key) {
    sorting.value.find(x => x.active).descending = !sorting.value.find(x => x.active).descending
  } else {
    currentlyActive.active = false
    sorting.value.find(x => x.key == facet.key).active = true
  }
}

const sortedTraces = computed(() => {
  if (!props.traces) return false
  let activeSorting = sorting.value.find(x => x.active)
  let sorted

  switch (activeSorting.key) {
    case "Date":
      sorted = props.traces.sort((a, b) => a.date - b.date)
      break;
    case "Popularity":
      sorted = props.traces.sort((a, b) => a.score - b.score)
      break;
    case "Responses":
      sorted = props.traces.sort((a, b) => {
        let lengthA = a.responses && a.responses.length ? a.responses.length : 0
        let lengthB = b.responses && b.responses.length ? b.responses.length : 0
        return lengthA - lengthB
      })
      break;
    default:
      sorted = props.traces
      break;

  }

  if (activeSorting.descending) sorted.reverse()
  return sorted
})

const response = reactive({ ...initialInput })

const authorName = computed(() => {
  let name = traceStore.getAuthorName
  response.author = name
  return name
})

watch(authorName, newName => {
  response.author = newName
})

const updateName = () => {
  traceStore.saveAuthor(response.author)
}
const expandedTrace = computed(() => traceStore.expandedTrace)
const rules = [
  value => !!value || 'Required.',
  value => (value && value.length >= 3) || 'Min 3 characters',
]

watch(expandedTrace, newExpandedTrace => {
  if (newExpandedTrace) { //check for null when collapsing an annotation
    response.parent = newExpandedTrace.id
    response.image = newExpandedTrace.image
  }

})


const writeTrace = (() => {
  let foo = traceStore.writeTrace(response)
  foo.then(x => {
    if (x.status == 200) response.text = "   "
  })
})

onMounted(() => {
  avatar.width = getWidth()
})

const resetExpand = () => {
  traceStore.writeInteraction({
    action: "resetExpand",
    target: expandedTrace.id
  })
  traceStore.expand(null)
}




const setHighlight = ((trace) => {
  if (trace) {
    traceStore.writeInteraction({
      action: "hoverSeparatedTrace",
      target: trace.id
    })

    trace.embedded = false //not sure why i put this
  }
  if (trace && trace.parent) {//if element has a parent, highlight that one
    trace = props.traces.find(x => x.id == trace.parent)
  }
  traceStore.setHighlight(trace)
})


const getWidth = (() => {
  let width = Math.round(list.value.$el.clientWidth * .33333)
  return width
})

window.onresize = function () {
  avatar.width = getWidth()
}

</script>

<style scoped>
ul {
  height: 100vh;
  overflow: auto;
}

h5 {
  display: inline;
}

li {
  list-style: none;
  padding-bottom: 10px;
}
</style>
