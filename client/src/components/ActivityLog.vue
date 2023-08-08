<template>
  <template v-if="expandedTrace">
    <v-btn size="small" density="compact" variant="text" @click="resetExpand">
      <v-icon>mdi-arrow-collapse-left</v-icon> view all
    </v-btn>
    {{ expandedTrace }}
  </template>
  <template v-else>
    <TransitionGroup tag="ul" name="list" ref="list" id="annotationList">
      <li v-for="(trace, index) in transformedTraces" :key="'tracelog-' + trace.id" @mouseenter="setHighlight(trace)"
        @mouseleave="setHighlight(null)">
        <CommentCard :trace="trace" :image="props.image" :width="avatar.width" />
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

const transformedTraces = computed(() => {
  if (!props.traces || !categories) return null
  let traces = props.traces
  traces.forEach(trace => {
    trace.category = categories.value.find(category => category.key == trace.category[0])
  })
  return traces
})


const avatar = reactive({ width: null })
const list = ref(null)


onMounted(() => {
  avatar.width = getWidth()
})

const categories = computed(() => {
  return traceStore.getCategories
})

const expandedTrace = computed(() => {
  return traceStore.expandedTrace
})

const resetExpand = () => {
  traceStore.expand(null)
}

const setHighlight = ((trace) => {
  if (trace) trace.embedded = false
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
