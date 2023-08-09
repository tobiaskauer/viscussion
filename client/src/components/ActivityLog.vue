<template>
  <!-- TEMPLATE FOR CONVERSATION VIEW-->
  <template v-if="expandedTrace">
    <v-btn size="small" class="mb-5" @click="resetExpand">
      <v-icon>mdi-arrow-collapse-left</v-icon> view all
    </v-btn>
    <TransitionGroup tag="ul" name="list" ref="list" id="annotationList">
      <li key="root">
        <CommentCard :response="false" avatar="true" :trace="expandedTrace" :image="props.image" :width="avatar.width"
          @mouseenter="setHighlight(expandedTrace)" @mouseleave="setHighlight(null)" />
      </li>
      <li key="button" align="right"> <v-btn size="small" variant="text">Responses</v-btn></li>

      <li v-for="(trace, index) in expandedTrace.responses" :key="'tracelog-' + trace.id"
        @mouseenter="setHighlight(trace)" @mouseleave="setHighlight(null)">
        <CommentCard :response="true" :avatar="!trace.parent" :trace="trace" :image="props.image" :width="avatar.width" />
      </li>
      <li class="pl-5 mt-5" key="form">

        <v-form @submit.prevent>
          <v-textarea v-model="response.text" :rules="rules" class="mb-2" label="Your response" variant="solo"
            hide-details="auto"></v-textarea>
          <v-text-field v-model="response.author" variant="solo" label="Name" density="compact"
            hide-details="auto"></v-text-field>

          <v-btn type="submit" @click="writeTrace" block class="mt-2" hide-details="auto">Submit</v-btn>
        </v-form>
      </li>
    </TransitionGroup>
  </template>





  <!-- TEMPLATE FOR ANNOTATION OVERVIEW-->
  <template v-else>
    <TransitionGroup tag="ul" name="list" ref="list" id="annotationList">
      <li v-for="(trace, index) in props.traces" :key="'tracelog-' + trace.id" @mouseenter="setHighlight(trace)"
        @mouseleave="setHighlight(null)">
        <CommentCard avatar="true" :trace="trace" :image="props.image" :width="avatar.width" />
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
const props = defineProps(['image', 'traces'])

const avatar = reactive({ width: null })
const list = ref(null)

const initialInput = {
  author: traceStore.author,
  text: null,
  image: null,
  parent: null
}

const response = reactive({ ...initialInput })


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
  traceStore.writeTrace(response)

})

/*const conversation = computed(() => {
  if (!traceStore.expandedTrace) return false
  let root = traceStore.expandedTrace
  let conversation = [root]
  response.parent = root.id
  root.responses.forEach(response => {
    conversation.push(response)
  })
  return conversation
})*/



onMounted(() => {
  avatar.width = getWidth()
})

const resetExpand = () => {
  traceStore.expand(null)
}


const setHighlight = ((trace) => {
  if (trace) trace.embedded = false //not sure why i put this
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
  overflow: scroll;
}

h5 {
  display: inline;
}

li {
  list-style: none;
  padding-bottom: 10px;
}
</style>
