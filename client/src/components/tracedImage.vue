<template>
  <div v-if="traceClass" ref="container" class="wrapper" @mousedown="mouseDown" @mouseup="mouseUp" @mousemove="mouseMove"
    :style="`height: ${dimensions.height}px`">
    <img class="untouchable" ref="tracedImage" :src="props.image.url" :style="'width: ' + dimensions.width + 'px'" />
    <transition name="lights">
      <div class="lights untouchable" v-if="lights.off">
        <img :src="props.image.url" class="desaturated" :style="'width: ' + dimensions.width + 'px'" />
        <div class="overlay" :style="`width: ${dimensions.width}px; height: ${dimensions.height}px`"></div>
      </div>
    </transition>
    <TransitionGroup tag="div" class="traces" v-if="resizedTraces" :css="false" @before-enter="onBeforeEnter"
      @enter="onEnter">
      <div v-for="(trace, index) in resizedTraces" :data-index="index" :key="'trace-' + trace.id"
        :class="traceClass[index]" :style="traceStyle(trace, patina)" @mouseenter="setHighlight(trace)"
        @click="showResponses(trace)">
      </div>
    </TransitionGroup>

    <div class="highlightedTrace" :style="highlightStyle(highlightedTrace)"
      v-if="highlightedTrace && highlightedTrace.embedded">
      <CommentCard :avatar="true" :image="props.image" :width="cardWidth" :trace="highlightedTrace" />
      <!--v-card :width="`${cardWidth}px`"><v-card-text>{{ highlightedTrace.text }}</v-card-text></v-card>-->
    </div>
    <div id="newTrace" class="untouchable cat-plain" v-if="cursor.drawing"
      :style="`top: ${newTrace.y}px; left: ${newTrace.x}px; width: ${newTrace.width}px; height: ${newTrace.height}px`">
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUpdated, computed, toRaw, watch, onUnmounted } from 'vue'
import { gsap } from 'gsap';
import { useTraceStore } from '../stores/traceStore';

import CommentCard from './CommentCard.vue'
import * as d3 from 'd3'



const props = defineProps(['image', 'traces', 'lights'])
const traceStore = useTraceStore()

const patina = computed(() => traceStore.activePatina)
const categories = computed(() => traceStore.getCategories)

const lights = reactive({ off: true }) //make this a prop
//const wrapper = ref(null)
const emit = defineEmits(['export'])

const cursor = reactive({
  startX: null,
  startY: null,
  currentX: null,
  currentY: null,
  drag: false,
  down: false,
})

const highlightedTrace = computed(() => {
  return traceStore.getHighlight
})

const dimensions = computed(() => traceStore.dimensions)
const cardWidth = computed(() => traceStore.cardWidth)

const resizedTraces = computed(() => {
  if (!props.traces) return false
  let traces = []

  props.traces.forEach(trace => {
    trace.anchors.forEach((anchor, i) => {
      traces.push({
        id: !i ? trace.id : trace.id + "-" + i,
        category: trace.category,
        author: trace.author,
        date: trace.date,
        anchor: anchor,
        text: trace.text,
        x: Math.round(anchor.x * dimensions.value.scale),
        y: Math.round(anchor.y * dimensions.value.scale),
        width: Math.round(anchor.width * dimensions.value.scale),
        height: Math.round(anchor.height * dimensions.value.scale)
      })
    })

  })

  return traces.sort((a, b) => a.x * a.y - b.x * b.y)//sort by size
})


const temporalScale = computed(() => {
  if (!props.traces) return false;

  let dates = props.traces.map(trace => trace.date)
  let domain = d3.extent(dates)
  //let range = ["red", "blue"]
  let range = [0, 10] //blur
  let scale = d3.scaleTime().range(range).domain(domain)

  return dates.map(date => scale(date))
})


const traceClass = computed(() => {
  if (!resizedTraces) return false

  return resizedTraces.value.map(trace => {
    let classes = []

    //let category = trace.category && trace.category.length > 0 ? 'cat-' + trace.category[0] : 'cat-plain' //TODO adapt this for multiple categories
    //classes.push(category)

    let randomShake = Math.floor(Math.random() * 10) + 2

    if (patina.value.key == 'Responses') {
      classes.push("shake-" + randomShake)
    }

    if (highlightedTrace.value && highlightedTrace.value.id == trace.id) {
      classes.push('elevation-5')
      classes.push('noBlur')

    } else {
      classes.push("blur")

    }

    return classes.join(" ")

  })
})

const traceStyle = (trace, patinReactivity) => {
  patinReactivity // reference for reactivity

  let style = {
    fill: d3.rgb("#000000"),
    fillOpacity: null,
    border: null,
    filter: null,
    opacity: null
  }


  if (highlightedTrace.value && highlightedTrace.value.id == trace.id) {
    style.opacity = 1
  } else if (highlightedTrace.value && highlightedTrace.value.id != trace.id) {
    style.opacity = .1
  } else {
    style.opacity = .3
  }


  switch (patina.value.key) {
    case "Temporal":
      let traceIndex = props.traces.findIndex(propTrace => propTrace.id == trace.id) //need to pass an array of scaled colors and then find it (because function can not be passed in computed array for some reason)
      if (!traceIndex) {
        style.fillOpacity = 0.2
        style.fill = d3.rgb("#000000")
      } else {
        style.fill = d3.rgb(temporalScale.value[traceIndex])
        style.filter = `blur(${temporalScale.value[traceIndex]}px)`
      }
      break;

    case "Activity":
      style.fill = d3.color("#ff0000")
      style.fillOpacity = .8
      style.border = "2px solid white"
      break;

    case "Responses"://color.opacity = opacity
      style.fill = d3.color("#ff0000")
      style.border = "2px solid white"
      style.fillOpacity = .8
      break;

    case "Category":
      let category = categories.value.find(category => trace.category[0] == category.key)
      if (category) {
        style.border = '5px solid ' + d3.color(category.color)
      }
      style.fillOpacity = 0
      break;

    default:
      style.opacity = 0
      break;
  }

  if (style.fill) style.fill.opacity = style.fillOpacity

  return `
    background: ${style.fill.rgb()};
    top: ${trace.y}px;
    left: ${trace.x}px;
    width: ${trace.width}px;
    height: ${trace.height}px;
    border: ${style.border};
    opacity: ${style.opacity}
    `
}


const highlightStyle = (trace) => {

  let top = trace.y + (trace.height / 2) // + dimensions.value.offsetY 
  let left = trace.x + trace.width// + dimensions.value.offsetX

  if (trace.x + trace.width + cardWidth.value > dimensions.value.width) {
    left = dimensions.value.offsetX + trace.x - cardWidth.value
  }

  return `top: ${top}px; left: ${left}px;`
}

const showResponses = (trace) => {
  console.log(trace)
}

function onBeforeEnter(el) {
  el.style.opacity = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    delay: el.dataset.index * 0.001,
    onComplete: done
  })
}

const newTrace = reactive({
  drawing: false,
  drawn: false,
  x: null,
  y: null,
  width: null,
  height: null,
})

let container = ref(null)

const mouseDown = ((e) => {
  cursor.startX = e.clientX - container.value.getBoundingClientRect().left;
  cursor.startY = e.clientY - container.value.getBoundingClientRect().top;
  cursor.currentX = null
  cursor.currentY = null
  cursor.down = true
})

const mouseMove = ((e) => {
  if (cursor.down
  ) {
    cursor.currentX = e.clientX - container.value.getBoundingClientRect().left;
    cursor.currentY = e.clientY - container.value.getBoundingClientRect().top;
    cursor.drawing = true

    traceStore.setHighlight(null)
  }
})

const mouseUp = ((e) => {
  if (cursor.drawing) {
    cursor.drawing = false
    cursor.drawn = true
    let exportTrace = {}
    let resizeKeys = ["x", "y", "width", "height"]

    resizeKeys.forEach(key => {
      exportTrace[key] = Math.round(newTrace[key] * 1 / dimensions.value.scale) //in case the image was resized, make sure the trace is recorded on the original size
    })

    emit('export', exportTrace)
    newTrace.width = 0
    newTrace.height = 0
    newTrace.x = 0
    newTrace.y = 0
  }
  cursor.down = false
})

watch(cursor, newCursor => {
  let threshold = 5
  if (
    newCursor.drawing
    && Math.abs(newCursor.startX - newCursor.currentX) >= threshold
    && Math.abs(newCursor.startY - newCursor.currentY) >= threshold
  ) {
    if (newCursor.currentX >= newCursor.startX) {
      newTrace.width = newCursor.currentX - newCursor.startX
      newTrace.x = newCursor.startX
    } else {
      newTrace.x = newCursor.currentX
      newTrace.width = newCursor.startX - newCursor.currentX
    }

    if (cursor.currentY >= newCursor.startY) {
      newTrace.height = newCursor.currentY - newCursor.startY
      newTrace.y = newCursor.startY
    } else {
      newTrace.y = newCursor.currentY
      newTrace.height = newCursor.startY - newCursor.currentY
    }
  }
})





/*const mouseDown = ((e) => {

  let rect = wrapper.value.getBoundingClientRect()

  let x = e.clientX - dimensions.left;
  let y = e.clientY - dimensions.top;

  newTrace.onScreen.height = 0
  newTrace.onScreen.width = 0

  newTrace.drawing = true
  newTrace.onScreen.startX = x
  newTrace.onScreen.startY = y
  newTrace.onScreen.x = x
  newTrace.onScreen.y = y
})

const mouseMove = ((e) => {
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

  let exportTrace = { category: ['new'] }

  let resizeKeys = ["x", "y", "width", "height"]

  resizeKeys.forEach(key => {
    exportTrace[key] = Math.round(newTrace.onScreen[key] * 1 / dimensions.scale) //in case the image was resized, make sure the trace is recorded on the original size
  })
  emit('export', exportTrace)
})*/



watch(patina, newPatina => {
  lights.off = !(newPatina.key == "None")
})


const setHighlight = ((trace) => {

  if (!newTrace.drawing) {
    if (trace) trace.embedded = true
    traceStore.setHighlight(trace)
  }
})

</script>

<style scoped>
.traces {
  position: relative;
  opacity: 85%;
}

#newTrace {
  border: 2px solid black;
  position: absolute;
  overflow: hidden
}

.traces div {
  position: absolute;
  mix-blend-mode: darken;
}

img,
.lights {
  position: absolute;
}

.blur {
  -webkit-filter: blur(.5px);
  -moz-filter: blur(0.5px);
  -o-filter: blur(0.5px);
  -ms-filter: blur(0.5px);
  filter: blur(0.5px);
}

.noBlur {
  -webkit-filter: blur(0px);
  -moz-filter: blur(0px);
  -o-filter: blur(0px);
  -ms-filter: blur(0px);
  filter: blur(0px);
}

.noAmiation {
  animation: none !important;
}

.overlay {
  background: rgba(0, 0, 0, 0);
}

.untouchable {
  pointer-events: none;
}

.desaturated {
  filter: saturate(0.2);
  opacity: 1;
}

.highlightedTrace {
  position: absolute;
  pointer-events: none;
}

.shake-0 {
  animation: shake .0s ease 0s infinite normal forwards;
}

.shake-3 {
  animation: shake .5s ease 0s infinite normal forwards;
}

.shake-4 {
  animation: shake .7s ease 0s infinite normal forwards;
}

.shake-5 {
  animation: shake .9s ease 0s infinite normal forwards;
}

.shake-6 {
  animation: shake 1.1s ease 0s infinite normal forwards;
}

.shake-7 {
  animation: shake 1.3s ease 0s infinite normal forwards;
}

.shake-8 {
  animation: shake 1.5s ease 0s infinite normal forwards;
}

.shake-9 {
  animation: shake 1.7s ease 0s infinite normal forwards;
}

.shake-10 {
  animation: shake 1.9s ease 0s infinite normal forwards;
}

.wrapper {
  position: relative
}


@keyframes shake {
  0% {
    transform: translate(0) rotate(0deg);
  }

  20% {
    transform: translate(0px, 2px) rotate(0deg);
  }

  40% {
    transform: translate(-0px, -2px) rotate(-0deg);
  }

  60% {
    transform: translate(0px, 2px) rotate(0deg);
  }

  80% {
    transform: translate(0px, -2px) rotate(-0deg);
  }

  100% {
    transform: translate(0);
  }
}
</style>
