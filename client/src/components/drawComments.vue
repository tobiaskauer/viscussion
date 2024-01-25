<template>
  <div v-if="traceClass" ref="wrapper" v-resize="onResize" class="wrapper" @mousedown="mouseDown" @mouseup="mouseUp"
    @mousemove="mouseMove" :style="`height: ${state.height}px`">
    <img class="untouchable" :src="props.image.url" :style="'width: ' + state.width + 'px'" />
    <transition name="lights">
      <div class="lights untouchable" v-if="lights.off">
        <img :src="props.image.url" class="desaturated" :style="'width: ' + state.width + 'px'" />
        <div class="overlay" :style="`width: ${state.width}px; height: ${state.height}px`"></div>
      </div>
    </transition>
    <TransitionGroup tag="div" class="traces" v-if="resizedTraces" :css="false" @before-enter="onBeforeEnter"
      @enter="onEnter">
      <div v-for="(trace, index) in resizedTraces" :data-index="index" :key="'trace-' + trace.id"
        :class="traceClass[index]" :style="traceStyle(trace)" @mouseleave="setHighlight(null)"
        @mouseenter="setHighlight(trace.id)">
      </div>
      <div id="newTrace" class="untouchable cat-plain" v-if="newTrace.drawing || newTrace.drawn"
        :style="'top: ' + newTrace.onScreen.y + 'px; left: ' + newTrace.onScreen.x + 'px; width: ' + newTrace.onScreen.width + 'px; height: ' + newTrace.onScreen.height + 'px;'">
      </div>
    </TransitionGroup>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUpdated, computed, toRaw, watch, onUnmounted } from 'vue'
import { gsap } from 'gsap';

const props = defineProps(['image', 'traces', 'lights'])
import { useTraceStore } from '../stores/traceStore';
const traceStore = useTraceStore()
const lights = reactive({ off: true }) //make this a prop
const wrapper = ref(null)
const emit = defineEmits(['export'])

/*const highlightedTrace = computed(() => {
  return traceStore.getHighlight
})*/

const state = reactive({
  width: 0,
  height: 0,
  scale: 0,
})

const resizedTraces = computed(() => {
  if (!props.traces) return false
  let traces = []

  props.traces.forEach(trace => {
    trace.anchors.forEach(anchor => {
      traces.push({
        id: trace.id,
        category: trace.category,
        x: Math.round(anchor.x * state.scale),
        y: Math.round(anchor.y * state.scale),
        width: Math.round(anchor.width * state.scale),
        height: Math.round(anchor.height * state.scale)
      })
    })

  })
  return traces.sort((a, b) => a.x * a.y - b.x * b.y)//sort by size
})

const traceClass = computed(() => {
  if (!resizedTraces) return false

  return resizedTraces.value.map(trace => {
    let classes = []

    let category = trace.category && trace.category.length > 0 ? 'cat-' + trace.category[0] : 'cat-plain' //TODO adapt this for multiple categories
    classes.push(category)

    //if (highlightedTrace.value == trace.id) classes.push('elevation-10')

    return classes.join(" ")

  })
})

const traceStyle = (trace) => {
  return `
    top: ${trace.y}px;
    left: ${trace.x}px;
    width: ${trace.width}px;
    height: ${trace.height}px;
    `
}

const onResize = () => {
  state.width = wrapper.value.clientWidth
  state.scale = wrapper.value.clientWidth / props.image.width
  state.height = props.image.height * state.scale
}

function onBeforeEnter(el) {
  el.style.opacity = 0
  //wel.style.height = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    delay: el.dataset.index * 0.01,
    onComplete: done
  })
}

const newTrace = reactive({
  drawing: false,
  drawn: false,
  onScreen: {}, //TODO: remove depth, this has become obsolete after making this a component
  resized: {}
})

const mouseDown = ((e) => {
  //let rect = e.target.getBoundingClientRect();
  let rect = wrapper.value.getBoundingClientRect()



  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  newTrace.onScreen.height = 0
  newTrace.onScreen.width = 0

  newTrace.drawing = true
  newTrace.onScreen.startX = x
  newTrace.onScreen.startY = y
  newTrace.onScreen.x = x
  newTrace.onScreen.y = y



})

const mouseMove = ((e) => {
  //TODO implement vue3-touch-events to differentiate between clicking a trace and dragging a new one
  if (newTrace.drawing) {
    //TODO make other traces untouchable
    let rect = wrapper.value.getBoundingClientRect()

    let currentX = e.clientX - rect.left;
    let currentY = e.clientY - rect.top;

    if (currentX >= newTrace.onScreen.startX) {
      newTrace.onScreen.width = currentX - newTrace.onScreen.startX
    } else {
      newTrace.onScreen.x = currentX
      newTrace.onScreen.width = newTrace.onScreen.startX - currentX
    }


    if (currentY >= newTrace.onScreen.startY) {
      newTrace.onScreen.height = currentY - newTrace.onScreen.startY
    } else {
      newTrace.onScreen.y = currentY
      newTrace.onScreen.height = newTrace.onScreen.startY - currentY
    }
  }

})

const mouseUp = (() => {
  newTrace.drawing = false
  newTrace.drawn = true

  let exportTrace = {}

  let resizeKeys = ["x", "y", "width", "height"]

  resizeKeys.forEach(key => {
    exportTrace[key] = Math.round(newTrace.onScreen[key] * 1 / state.scale) //in case the image was resized, make sure the trace is recorded on the original size
  })

  emit('export', exportTrace)
})

const setHighlight = ((id) => {
  //if(!newTrace.drawing) {
  //traceStore.setHighlight(id)
  //}

})

const highlight = computed(() => {
  return null
  //return traceStore.getHighlight
})

</script>

<style scoped>
.traces {
  position: relative;
}

.traces div {
  position: absolute;
}

img,
.lights {
  position: absolute;
}

.overlay {
  background: rgba(0, 0, 0, 0.2);
}

.untouchable {
  pointer-events: none;
}

.desaturated {
  filter: saturate(0);
  opacity: .5;
}
</style>
