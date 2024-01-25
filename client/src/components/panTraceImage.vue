<template>
  <!--<div ref="wrapper" id="wrapper" :style="getZoomStyle()" @wheel="wheel">
asd</div>-->
  <div class="wrapper" style="position: relative">
    <div ref="viewport" class="viewport" :style="`max-height: 80vh`">
      <div id="myContent" ref="canvas" @mousedown="mouseDown" @mouseup="mouseUp" @mousemove="mouseMove"
        @mouseleave="mouseleave">
        <img :src="props.image.url" @load="onLoad" />
        <!--<span v-show="!state.imageLoaded">im here before the image is loaded</span>-->
        <div class="traces" v-if="computedTraces" @enter="onEnter" @leave="onLeave">
          <div v-for="(trace, index) in computedTraces" :key="'trace-' + trace.id" :class="traceClass[index]"
            :style="traceStyle(trace, patina)" @mouseenter="setHighlight(trace)" @mouseout="setHighlight()"
            @click="expand(trace)">
          </div>
          <div v-for="(trace, index) in newTrace.traceArray"
            :style="`border: 2px solid black; top: ${trace.y}px; left: ${trace.x}px; width: ${trace.width}px; height: ${trace.height}px;`">
            {{ trace
            }}
          </div>
        </div>

      </div>

    </div>

    <ul class="controls"
      style="position: absolute; top: 0; right: 0; padding: 10px; width: 130px; text-align: right; list-style-type: none;">
      <li><v-btn size="x-small" @click="control.up">Zoom in<v-icon>mdi-plus</v-icon></v-btn></li>
      <li><v-btn size="x-small" @click="control.down">Zoom out <v-icon>mdi-minus</v-icon></v-btn></li>
      <li><v-btn size="x-small" @click="control.OneToOne">Reset Zoom&nbsp;<v-icon>mdi-aspect-ratio</v-icon></v-btn></li>
      <li><v-btn size="x-small" :color="newTrace.tracingMode ? 'primary' : 'none'" @click="control.toggleTraceingMode">New
          comment<v-icon>mdi-plus-box-outline</v-icon></v-btn></li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUpdated, computed, toRaw, watch, onUnmounted } from 'vue'
import WZoom from 'vanilla-js-wheel-zoom'
import * as d3 from 'd3'



import { useTraceStore } from '../stores/traceStore';
const traceStore = useTraceStore()
const patina = computed(() => traceStore.activePatina)
const highlightedTrace = computed(() => traceStore.getHighlight)

const props = defineProps(['image', 'traces', 'lights', 'touchable'])
const emit = defineEmits(['export'])
const viewport = ref(null)
const canvas = ref(null)



const state = reactive({
  viewportHeight: 20,
  zoomInstance: null,
  imageLoaded: false,
  fitScale: null
})

const newTrace = reactive({
  traceArray: [],
  traceIndex: 0,

  tracingMode: false, //turned on when oressing the button OR pressing shift/CTRL
  drawing: false, //turned on when pressing the mouse or holding shift/CTLR
})


onUpdated(() => { })
onMounted(() => {
  window.addEventListener('keydown', e => {
    if (e.keyCode == 16 || e.keyCode == 17) {
      newTrace.tracingMode = true
      newTrace.drawing = true
    }
  });

  window.addEventListener('keyup', e => {
    if (e.keyCode == 16 || e.keyCode == 17) {
      newTrace.tracingMode = false
      newTrace.drawing = false
    }
  });
})
const onLoad = (e) => {
  initZoom();
}

const control = {
  up: () => { state.zoomInstance.zoomUp() },
  down: () => { state.zoomInstance.zoomDown() },
  OneToOne: () => { state.zoomInstance.transform(0, 0, state.fitScale) },
  toggleTraceingMode: () => {
    newTrace.tracingMode = !newTrace.tracingMode
    state.zoomInstance.options.dragScrollable = false
  }
}


const initZoom = () => {
  let bBox = viewport.value.getBoundingClientRect()

  state.fitScale = bBox.width / props.image.width

  //check if it fits horizontally, if not rescale
  let neccesaryViewportHeight = props.image.height * state.fitScale
  if (neccesaryViewportHeight > bBox.height) state.fitScale = bBox.height / props.image.height

  const el = document.getElementById('myContent');
  el.addEventListener('mousemove', event => newTrace.tracingMode && event.stopImmediatePropagation()); //disable panning when in tracing mode

  state.zoomInstance = WZoom.create(el, {
    type: 'html',
    smoothTime: .25,
    width: props.image.width,
    height: props.image.height,
    //minScale: minScale,
    minScale: state.fitScale * 0.95, //add some padding
    maxScale: 1.5,
    alignContent: "center",
    prepare: (instance) => {
      instance.content.currentScale = state.fitScale //make image fit container
    },
    dragScrollableOptions: {
      onGrab: () => { },
      onMove: () => { },
      onDrop: () => { console.log("canvas dropped") },
    }
  });
}


const computedTraces = computed(() => {
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
        //x: Math.round(anchor.x * dimensions.value.scale),
        //y: Math.round(anchor.y * dimensions.value.scale),
        //width: Math.round(anchor.width * dimensions.value.scale),
        //height: Math.round(anchor.height * dimensions.value.scale)

        x: anchor.x,
        y: anchor.y,
        width: anchor.width,
        height: anchor.height
      })
    })

  })

  return traces.sort((a, b) => a.x * a.y - b.x * b.y)//sort by size
})


/* 
####
MOUSE INTERACTION
####
*/

const mouseDown = ((e) => {
  if (newTrace.tracingMode) {


    let trace = {
      startX: e.clientX - canvas.value.getBoundingClientRect().left,
      startY: e.clientY - canvas.value.getBoundingClientRect().top,
      currentX: null,
      currentY: null
    }

    newTrace.traceArray[newTrace.traceIndex] = trace

    newTrace.drawing = true
  }
})

const mouseMove = ((e) => {
  if (newTrace.drawing) {

    newTrace.traceArray[newTrace.traceIndex].currentX = (e.clientX - canvas.value.getBoundingClientRect().left) * state.zoomInstance.content.currentScale;
    newTrace.traceArray[newTrace.traceIndex].currentY = (e.clientY - canvas.value.getBoundingClientRect().top) * state.zoomInstance.content.currentScale;
    newTrace.drawing = true

    traceStore.setHighlight(null)
  }
})

watch(newTrace, update => { //transform cursor positions to  trace x,y,w,h 
  let threshold = 5
  let trace = update.traceArray[newTrace.traceIndex]
  if (
    newTrace.drawing
    && trace
    && trace.startX
    && Math.abs(trace.startX - trace.currentX) >= threshold
    && Math.abs(trace.startY - trace.currentY) >= threshold
  ) {
    if (trace.currentX >= trace.startX) {
      trace.width = trace.currentX - trace.startX
      trace.x = trace.startX
    } else {
      trace.x = trace.currentX
      trace.width = trace.startX - trace.currentX
    }

    if (trace.currentY >= trace.startY) {
      trace.height = trace.currentY - trace.startY
      trace.y = trace.startY
    } else {
      trace.y = trace.currentY
      trace.height = trace.startY - trace.currentY
    }

    update.traceArray[newTrace.traceIndex] = trace
  }
})

const mouseUp = ((e) => {
  //fromTraceToForm(e)
  newTrace.drawing = false

  newTrace.traceArray[0] = {}

})

const mouseleave = ((e) => {
  //fromTraceToForm(e)
}) //prevent buggy behavior when mouse leave canvas - still not perfect



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



/*
####
trace appearance
####
*/




const traceClass = computed(() => {
  if (!props.traces) return false

  return props.traces.map(trace => {
    let classes = []

    if (patina.value.key == 'Responses' || patina.value.key == 'Everything') {
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
    style.opacity = 1
  } else if (highlightedTrace.value && highlightedTrace.value.id != trace.id) {
    style.opacity = .1
  } else {
    style.opacity = .3
  }

  switch (patina.value.key) {
    case "Temporal":
      if (!traceIndex) {
        style.fillOpacity = 0.2
        style.fill = d3.rgb("#ff0000")
      } else {
        style.fill = d3.rgb("#ff0000")
        style.fillOpacity = 1
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
      let stroke = popularityScale.value.stroke.find(scaleElement => scaleElement.score == trace.score).stroke
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

  let styleString = `
    background: ${style.fill.rgb()};
    top: ${trace.y}px;
    left: ${trace.x}px;
    width: ${trace.width}px;
    height: ${trace.height}px;
    border: ${style.border};
    opacity: ${style.opacity}
    `
  return styleString
}

</script>

<style scoped>
.viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: white;
}

#myContent {
  position: relative;
  display: flex;
  align-items: center;
}

#myContent img {
  display: block;
  width: auto;
  height: auto;
  margin: auto;
  align-self: center;
  flex-shrink: 0;
  border: 1px solid lightgray;
}

.traces {
  position: absolute;
  top: 0;
  left: 0;
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

.controls li {
  margin-bottom: 3px;
}
</style>
