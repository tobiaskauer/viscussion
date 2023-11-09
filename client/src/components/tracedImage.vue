<template>
  <div ref="wrapper" v-resize="getDimensions" :class="{ untouchable: !props.touchable }">

    <div v-if="traceClass" ref="container" class="wrapper" @mousedown="mouseDown" @mouseup="mouseUp"
      @mousemove="mouseMove" @mouseleave="mouseleave" @mouseenter="mouseenter" :style="`height: ${dimensions.height}px`">

      <img class="untouchable" ref="tracedImage" :src="props.image.url" :style="'width: ' + dimensions.width + 'px'" />
      <transition name="lights">
        <div class="lights untouchable" v-if="lights.off">
          <img :src="props.image.url" class="desaturated" :style="'width: ' + dimensions.width + 'px'" />
          <div class="overlay" :style="`width: ${dimensions.width}px; height: ${dimensions.height}px`"></div>
        </div>
      </transition>



      <TransitionGroup tag="div" class="traces" v-if="resizedTraces" :css="false" @before-enter="onBeforeEnter"
        @enter="onEnter" @leave="onLeave">
        <div v-for="(trace, index) in resizedTraces" :data-index="index" :key="'trace-' + trace.id"
          :class="traceClass[index]" :style="traceStyle(trace, patina)" @mouseenter="setHighlight(trace)"
          @mouseout="setHighlight()" @click="expand(trace)">
        </div>
      </TransitionGroup>


      <svg v-if="traceLinks" class="links"
        :style="`width: ${dimensions.width}px; position: absolute; height: ${dimensions.height}px; pointer-events: none;`">
        <line v-for="link, i in traceLinks" :key="'link-' + i" :x1="link.x1" :x2="link.x2" :y1="link.y1" :y2="link.y2"
          stroke="red" stroke-width="2px" stroke-dasharray="4 2">
        </line>
      </svg>



      <div class="highlightedTrace" :style="highlightStyle(highlightedTrace)"
        v-if="highlightedTrace && highlightedTrace.embedded">
        <CommentCard :avatar="false" :image="props.image" :width="cardWidth" :trace="highlightedTrace" />
      </div>
      <div id="newTrace" class="untouchable cat-plain" v-if="cursor.drawing"
        :style="`top: ${newTrace.y}px; left: ${newTrace.x}px; width: ${newTrace.width}px; height: ${newTrace.height}px`">
      </div>

      <!--     <div id="allAnchors" class="untouchable cat-plain" div v-if="allAnchors.length > 0"
        :style="`top: ${allAnchors[0].y * dimensions.scale}px; left: ${allAnchors[0].x * dimensions.scale}px; width: ${allAnchors[0].width * dimensions.scale}px; height: ${allAnchors[0].height * dimensions.scale}px`">
      </div>-->

      <div v-if="allAnchors.length > 0">
        <div id="allAnchors" class="untouchable cat-plain" v-for="anchor, index in allAnchors" :key="index"
          :style="`top: ${anchor.y * dimensions.scale}px; left: ${anchor.x * dimensions.scale}px; width: ${anchor.width * dimensions.scale}px; height: ${anchor.height * dimensions.scale}px`">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUpdated, computed, toRaw, watch, onUnmounted } from 'vue'
import { gsap } from 'gsap';
import { useTraceStore } from '../stores/traceStore';
import CommentCard from './CommentCard.vue'
import * as d3 from 'd3'

const props = defineProps(['image', 'traces', 'lights', 'touchable'])
const traceStore = useTraceStore()

const patina = computed(() => traceStore.activePatina)
const categories = computed(() => traceStore.getCategories)
const tracesSubmitted = computed(() => traceStore.tracesSubmitted)
const traceLinks = computed(() => {
  if (!dimensions.value.scale || !traceStore.traceLinks) return null
  let links = traceStore.traceLinks

  links.forEach(link => {
    Object.keys(link).forEach(key => link[key] = link[key] * dimensions.value.scale) //resize accordig to scale facotr of source image
  })
  return links
})


onMounted(() => {
  getDimensions()
})

watch(tracesSubmitted, newTrace => {
  newTrace
  cursor.startX = null
  cursor.startY = null
  cursor.currentY = null
  cursor.currentX = null
  cursor.drag = false
  cursor.down = false
  cursor.drawn = false
  cursor.drawing = false

  allAnchors.value.splice(0)
})

const wrapper = ref(null)
const getDimensions = () => {
  let bBox = wrapper.value.getBoundingClientRect()
  let scale = bBox.width / props.image.width

  let dimensions = {
    offsetX: bBox.x,
    offsetY: bBox.y,
    width: bBox.width,
    scale: scale,
    height: props.image.height * scale
  }

  traceStore.setDimensions(dimensions)
}

const lights = reactive({ off: false }) //make this a prop
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

const allAnchors = ref([])

const highlightedTrace = computed(() => {
  return traceStore.getHighlight
})

const dimensions = computed(() => {
  return traceStore.dimensions
})


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
        responses: trace.responses,
        anchors: [anchor],
        text: trace.text,
        score: trace.score,
        x: Math.round(anchor.x * dimensions.value.scale),
        y: Math.round(anchor.y * dimensions.value.scale),
        width: Math.round(anchor.width * dimensions.value.scale),
        height: Math.round(anchor.height * dimensions.value.scale)
      })
    })

  })

  return traces.sort((a, b) => a.x * a.y - b.x * b.y)//sort by size
})


/*const temporalScale = computed(() => {
  if (!props.traces) return false;

  let dates = props.traces.map(trace => trace.date)
  let domain = d3.extent(dates)
  //let range = ["red", "blue"]
  let range = [0, 10] //blur
  let scale = d3.scaleTime().range(range).domain(domain)

  return dates.map(date => scale(date)) //returning the scale is not a function, so just return an array with all values in them (need to compute all anyway)
})*/

const popularityScale = computed(() => {
  if (!props.traces) return false;

  let scores = props.traces.map(trace => trace.score)
  let domain = d3.extent(scores)
  //let colorRange = ["blue", "red"]
  let strokeRange = [2, 20]
  //let colorScale = d3.scaleLinear().range(colorRange).domain(domain)
  let strokeScale = d3.scaleLinear().range(strokeRange).domain(domain)
  return {
    /*color: scores.map(score => {
      return { score: score, color: colorScale(score) }
    }),*/
    stroke: scores.map(score => {
      return { score: score, stroke: strokeScale(score) }
    }
    )
  }
})


const responseScale = computed(() => {
  if (!props.traces) return false;

  let responses = props.traces.map(trace => trace.responses && trace.responses.length ? trace.responses.length : 0)
  let domain = d3.extent(responses)
  let range = [0, 10]
  let scale = d3.scaleLinear().range(range).domain(domain)

  //return responses.map(response => Math.floor(scale(response)))
  return responses.map(response => {
    return {
      responses: response,
      strength: Math.floor(scale(response))
    }
  })
})

const traceClass = computed(() => {
  if (!resizedTraces) return false

  return resizedTraces.value.map(trace => {
    let classes = []

    if (patina.value.key == 'Responses' || patina.value.key == 'Everything') {

      //let traceIndex = props.traces.findIndex(propTrace => propTrace.id == trace.id)
      //if (trace.responses) console.log(trace)

      let elementInScale = responseScale.value.find(scaleElement => scaleElement.responses == trace.responses.length)
      let strength = elementInScale ? elementInScale.strength : null

      if (strength) {
        classes.push("shake-" + strength)
      }
    }

    if (highlightedTrace.value && highlightedTrace.value.id == trace.id) {
      classes.push('elevation-5')
      classes.push('fullOpacity')

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

  if (highlightedTrace.value && String(trace.id).startsWith(String(highlightedTrace.value.id))) {
    //if (highlightedTrace.value && trace.id.startsWith(`${highlightedTrace.value.id}`)) {
    style.opacity = 1
  } else if (highlightedTrace.value && highlightedTrace.value.id != trace.id) {
    style.opacity = .1
  } else {
    style.opacity = .3
  }

  //let traceIndex = props.traces.findIndex(propTrace => propTrace.id == trace.id) //need to pass an array of scaled colors and then find it (because function can not be passed in computed array for some reason)

  switch (patina.value.key) {
    case "Temporal":
      if (!traceIndex) {
        style.fillOpacity = 0.2
        style.fill = d3.rgb("#ff0000")
      } else {
        style.fill = d3.rgb("#ff0000")
        style.fillOpacity = 1
        //style.fill = d3.rgb(temporalScale.value[traceIndex])
        //style.filter = `blur(${temporalScale.value[traceIndex]}px)`
      }
      break;

    case "Activity":
      style.fill = d3.color("#ff0000")
      style.fillOpacity = .8
      style.border = "2px solid white"
      break;

    case "Responses":
      style.fill = d3.color("#ff0000")
      style.border = "2px solid white"
      style.fillOpacity = .8
      break;

    case "Relation":
      style.fill = d3.color("#ff0000")
      style.border = "2px solid white"
      style.fillOpacity = .8
      break;

    case "Popularity":
      style.opacity = .9
      style.fillOpacity = .5

      //let color = traceIndex >= 0 ? d3.rgb(popularityScale.value.color[traceIndex]) : d3.rgb("#000000")
      //let stroke = traceIndex ? popularityScale.value.stroke[traceIndex] : 0

      //let color = popularityScale.value.color.find(scaleElement => scaleElement.score == trace.score).color //no more color
      let stroke = popularityScale.value.stroke.find(scaleElement => scaleElement.score == trace.score).stroke

      //style.border = `${stroke}px solid ${color}`
      style.border = `${stroke}px solid rgba(237,106,99,1)`
      style.fill = d3.rgb("#ffffff")
      break;

    case "Category":
      let category = categories.value.find(category => trace.category[0] == category.key)
      if (category) {
        style.border = '5px solid ' + d3.color(category.color)
        style.fill = d3.color(category.color)
      }
      style.fillOpacity = 0.1
      style.opacity = 0.6
      break;

    case "Everything":
      style.fillOpacity = .2
      style.opacity = 1
      let evCategory = categories.value.find(category => trace.category[0] == category.key)
      let evStroke = popularityScale.value.stroke.find(scaleElement => scaleElement.score == trace.score).stroke
      let strokeColor = evCategory ? evCategory.color : "white"
      let strokeWidth = evStroke ? evStroke : 2

      style.border = `${strokeWidth}px solid ${d3.color(strokeColor)}`
      style.fill = d3.color(strokeColor)


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

  return `top: ${top}px; left: ${left}px; width: ${cardWidth}px;`
}

const expand = (trace) => {
  traceStore.writeInteraction({
    action: "expandTrace",
    target: trace.id
  })
  traceStore.expand(trace)
}

function onBeforeEnter(el) {
  el.style.opacity = 0
}

function onEnter(el, done) {
  gsap.timeline({
    defaults: { duration: 1 }
  }).to(el, {
    opacity: .3,
    delay: el.dataset.index * 0.01,
    //rotation: -120,
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.timeline({
    defaults: { duration: 1 }
  }).to(el, {
    opacity: 0,
    delay: el.dataset.index * 0.01,
    //rotation: 0,
    onComplete: done
  })
}


onUnmounted(() => {
  traceStore.setActivePatina("Activity")
})

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
  fromTraceToForm(e)
})

const fromTraceToForm = (e) => {
  if (cursor.drawing) {
    cursor.drawing = false
    cursor.drawn = true
    let exportTrace = {}
    let resizeKeys = ["x", "y", "width", "height"]

    resizeKeys.forEach(key => {
      exportTrace[key] = Math.round(newTrace[key] * 1 / dimensions.value.scale) //in case the image was resized, make sure the trace is recorded on the original size
    })

    allAnchors.value.push(exportTrace) //this is a bit hacky and inconsistent in terminology, but i need an array of new traces to support multiple anchors
    emit('export', allAnchors)



    newTrace.width = 0
    newTrace.height = 0
    newTrace.x = 0
    newTrace.y = 0
  }
  cursor.down = false
}

const mouseleave = ((e) => {
  fromTraceToForm(e)
}) //prevent buggy behavior when mouse leave canvas - still not perfect

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


watch(patina, newPatina => {
  lights.off = !(newPatina.key == "None")
})

const setHighlight = ((trace) => {
  if (!newTrace.drawing && patina.value.key != "None") {
    if (trace) trace.embedded = true

    traceStore.setHighlight(trace)
    if (trace) {
      traceStore.writeInteraction({
        action: "hoverEmbeddedTrace",
        target: trace.id
      })
    }
  }
})

</script>

<style scoped>
.traces {
  position: relative;
  opacity: 85%;
}

#newTrace,
#allAnchors {
  border: 2px solid black;
  position: absolute;
  overflow: hidden
}

.traces div {
  position: absolute;
  mix-blend-mode: darken;
  border-radius: 5px;
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

.fullOpacity {
  opacity: 1 !important;
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
  //animation: shake .0s ease 0s infinite normal forwards;
}

.shake-1 {
  animation: shake .2s ease 0s infinite normal forwards;
}

.shake-2 {
  animation: shake .18s ease 0s infinite normal forwards;
}

.shake-3 {
  animation: shake 1.6s ease 0s infinite normal forwards;
}

.shake-4 {
  animation: shake 1.4s ease 0s infinite normal forwards;
}

.shake-5 {
  animation: shake 1.2s ease 0s infinite normal forwards;
}

.shake-6 {
  animation: shake 1s ease 0s infinite normal forwards;
}

.shake-7 {
  animation: shake .8s ease 0s infinite normal forwards;
}

.shake-8 {
  animation: shake .6s ease 0s infinite normal forwards;
}

.shake-9 {
  animation: shake .4s ease 0s infinite normal forwards;
}

.shake-10 {
  animation: shake .2s ease 0s infinite normal forwards;
}

.wrapper {
  position: relative
}


@keyframes shake {
  0% {
    transform: translate(0) rotate(0deg);
  }

  40% {
    transform: translate(0px, 3px) rotate(0deg);
  }

  80% {
    transform: translate(-0px, -3px) rotate(-0deg);
  }

  100% {
    transform: translate(0);
  }
}
</style>
