<template>
  <v-col class="v-col-8">
    <tracedImage :image="image" :traces="props.traces"></tracedImage>
    <!--<v-row v-if="props.image">
      
      <v-col id="wrapper" class="v-col-12">-->
        
        <!--<div id="inner" :style="'width: '+dimensions.width+'px; height: '+dimensions.height+'px;'">
            <v-img  id="original"  :src="props.image.url"></v-img>
            
            <transition name="lights"><v-img id="desaturated" :src="image.url"></v-img></transition>
              <transition name="lights"><div v-if="!lights.on" id="overlay"></div></transition>-->
              
            
            
            <!--<div id="traces" ref="traceRef" @mousedown="mouseDown" @mouseup="mouseUp" @mousemove="mouseMove">
              <div id="newTrace" class="untouchable" v-if="newTrace.drawing || newTrace.drawn" :style="'top: '+newTrace.onScreen.y+'px; left: '+newTrace.onScreen.x+'px; width: '+newTrace.onScreen.width+'px; height: '+newTrace.onScreen.height+'px;'"></div>
              <TransitionGroup
                tag="ul"
                :css="false"
                @before-enter="onBeforeEnter"
                @enter="onEnter"
              >  
            <li
              v-for="(trace, index) in traces"
              :key="'trace-'+trace.id"
              class="trace"
              :class="liClass(trace)"
              
              @mouseleave="setHighlight(null)"
              @mouseenter="setHighlight(trace.id)"
              :data-index="index"
              :style="'top: '+trace.y+'px; left: '+trace.x+'px; width: '+trace.width+'px; height: '+trace.height+'px;'"></li>
            </TransitionGroup>
            </div>-->
            <!--<TraceForm :display="form.display" :trace="newTrace.original" :image="image" @close="close"/>
        </div>-->
     <!-- </v-col>
      <v-btn :variant="lights.on ? 'tonal' : 'outlined'" @click="lights.on = !lights.on">
        lights
        <template v-if="lights.on">off</template>
        <template v-else>on</template>
      </v-btn>
    </v-row>-->
  </v-col>
</template>

<script setup>
//import original from '../assets/chess.webp'
import { reactive, onMounted, computed, ref, onUnmounted } from 'vue'
import TraceForm from './TraceForm.vue'
import { useTraceStore } from "../stores/traceStore.js";
import tracedImage from "./tracedImage.vue";
import { gsap } from 'gsap';

const traceStore = useTraceStore()
const props = defineProps(['image','traces'])
const traceRef = ref(null)

const liClass = (input) => {
  console.log(input)
  //:class="{'untouchable': newTrace.drawing, 'elevation-10': (trace.id == highlight)}"
  return "untouchable elevation10"
  
}

const close = (() => {
  form.display = false


}) 

//const traceStore = useTraceStore();

const setHighlight = ((id) => {
  if(!newTrace.drawing) {
    traceStore.setHighlight(id)
  }
})

const highlight = computed(() => {
  return traceStore.getHighlight
})

onMounted(() => {
  //setDimensions()
})

const newTrace = reactive({
  drawing: false,
  drawn: false,
  startX: 0,
  startY: 0,

  original: {},
  onScreen: {}
})

const dimensions = reactive({
  width: 0,
  height: 0,
  ratio: 0,
})

const lights = reactive({
  on: false,
})

const form = reactive({
  display: false
})

function onBeforeEnter(el) {
  el.style.opacity = 0
  //wel.style.height = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    //height: '1.6em',
    delay: el.dataset.index * 0.1,
    onComplete: done
  })
}



const traces = computed(() => {
  if(!dimensions.ratio || !props.traces) return false;

  let originalTraces = props.traces //integrate into resizeTraces (and make that work both directions)
  let resizeKeys = ["x","y","width","height"]
  let resizedTraces=[]
  originalTraces.forEach((trace,i) => {
    resizedTraces[i] = {id: trace.id}
    resizeKeys.forEach(key => {
      resizedTraces[i][key] = trace[key] * dimensions.ratio //in case the image was resized, make sure the trace is recorded on the original size
    })
  })
  return resizedTraces;
});


const setDimensions = (() => {
  let aspectRatio = props.image.width/props.image.height
  //let maxHeight = window.innerHeight * 0.8
  let maxHeight = window.innerHeight

  let wrapperWidth = document.getElementById("wrapper").offsetWidth  //account for border
  let ratio = wrapperWidth / props.image.width
  let wrapperHeight = props.image.height * ratio
  
/*  if(wrapperHeight >= maxHeight) {
    wrapperHeight = maxHeight
    wrapperWidth = wrapperHeight * aspectRatio
    ratio = wrapperHeight / props.image.height
  }*/ 

  dimensions.width = wrapperWidth
  dimensions.height = wrapperHeight
  dimensions.ratio = ratio
})


window.onresize = function() {
  //setDimensions()
}


const mouseDown = ((e) => {
  //let rect = e.target.getBoundingClientRect();
  let rect = traceRef.value.getBoundingClientRect()

  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  newTrace.onScreen.height = 0
  newTrace.onScreen.width = 0
  
  newTrace.drawing=true
  newTrace.onScreen.startX = x
  newTrace.onScreen.startY = y
  newTrace.onScreen.x = x
  newTrace.onScreen.y = y

})

const mouseMove = ((e) => {
  //TODO implement vue3-touch-events to differentiate between clicking a trace and dragging a new one
  if(newTrace.drawing) {
    //let rect = e.target.getBoundingClientRect();
    let rect = traceRef.value.getBoundingClientRect()

    let currentX = e.clientX - rect.left;
    let currentY = e.clientY - rect.top;
    
    if(currentX >= newTrace.onScreen.startX) {
      newTrace.onScreen.width = currentX - newTrace.onScreen.startX
    } else {
      newTrace.onScreen.x = currentX
      newTrace.onScreen.width = newTrace.onScreen.startX - currentX
    }


    if(currentY >= newTrace.onScreen.startY) {
      newTrace.onScreen.height = currentY - newTrace.onScreen.startY
    }else {
      newTrace.onScreen.y = currentY
      newTrace.onScreen.height = newTrace.onScreen.startY - currentY
    }
  }

})

const mouseUp = (() => {
  newTrace.drawing=false
  newTrace.drawn = true
  form.display = true
  newTrace.original = resizeTrace(newTrace.onScreen)
})

const resizeTrace = ((originalTrace) => {
  let resizedTrace = originalTrace
  let resizeKeys = ["x","y","width","height"]
  
  resizeKeys.forEach(key => {
    resizedTrace[key] = Math.round(originalTrace[key] * 1/dimensions.ratio) //in case the image was resized, make sure the trace is recorded on the original size
  })
  
  return resizedTrace
})
</script>

<style scoped>
.lights-enter-active,
.lights-leave-active {
  transition: opacity 0.5s ease;
}

.lights-enter-from,
.lights-leave-to {
  opacity: 0;
}


#wrapper {    
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0;

}

#inner {
  position: relative;
  border: 1px solid black;
}
.untouchable {
  pointer-events: none;
}

.v-img, #overlay, #canvas, #traces {
  position: absolute;
  width: 100%;

  height: inherit;
}
.trace {
  position: absolute;
  background: rgba(237,106,99,0.1);
  border: 2px solid #ED6A63;
  list-style-type: none;

}

.trace.comment {
  border: 1px solid black;
}

#overlay {
  background: rgba(0,0,0,.2);
}


#newTrace {
  position: absolute;
  border: 2px solid #ED6A63;
  background: rgba(237,106,99,0.2)
}

#desaturated {
  filter: saturate(0);
  opacity: .5;
}
</style>
