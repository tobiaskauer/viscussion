<template>
    <div ref="wrapper" v-resize="onResize" :style="'height: '+state.height+'px'">
        <img :src="props.image.url" :style="'width: '+state.width+'px'"/>
        <transition name="lights">
            <div class="lights" v-if="lights.off">
                <img :src="props.image.url" class="desaturated" :style="'width: '+state.width+'px'"/>
                <div class="overlay" :style="`width: ${state.width}px; height: ${state.height}px`"></div>
            </div>
        </transition>
        
            <TransitionGroup
                tag="div"
                class="traces"
                v-if="resizedTraces"
                :css="false"
                @before-enter="onBeforeEnter"
                @enter="onEnter"
              >  
            <div
                v-for="(trace, index) in resizedTraces"
                :data-index="index"
                :key="'trace-'+trace.id"
                :class="'cat-'+trace.category"
                :style="style(trace)"></div>
            </TransitionGroup>
    </div>
    
</template>

<script setup>
import { ref, reactive, onMounted, onUpdated, computed, watch, onUnmounted } from 'vue'
import { gsap } from 'gsap';
//import { useTraceStore } from '../stores/traceStore';
const props = defineProps(['image','traces', 'lights'])

const lights = reactive({off: true})
const wrapper = ref(null)
const state = reactive({
    width: 0,
    height: 0,
    scale: 0,
})

const resizedTraces = computed(() => {
    if(!props.traces) return false
    let traces = []
    props.traces.forEach(trace => {
        traces.push({
            x: Math.round(trace.x * state.scale),
            y: Math.round(trace.y * state.scale),
            width: Math.round(trace.width * state.scale),
            height: Math.round(trace.height * state.scale),
            category: trace.category.length > 0 ? trace.category[0] : 'plain' //TODO adapt this for multiple categories
        })
    })
    return traces
})

const style = (trace) => {
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
    delay: el.dataset.index * 0.1,
    onComplete: done
  })
}

</script>

<style scoped>
.traces div {
    position: absolute;
}
img, .lights  {
    position: absolute;
}

.overlay {
    background: rgba(0,0,0,0.2)
}

.desaturated {
  filter: saturate(0);
  opacity: .5;
}

.cat-plain {background: rgba(var(--v-theme-plain), .1); border: 2px solid rgb(var(--v-theme-plain));}
.cat-obs {background: rgba(var(--v-theme-problem), .1); border: 2px solid rgb(var(--v-theme-problem));}
.cat-hyp {background: rgba(var(--v-theme-hypothesis), .1); border: 2px solid rgb(var(--v-theme-hypothesis));}
.cat-que {background: rgba(var(--v-theme-question), .1); border: 2px solid rgb(var(--v-theme-question));}
.cat-pro {background: rgba(var(--v-theme-problem), .1); border: 2px solid rgb(var(--v-theme-problem));}
.cat-con {background: rgba(var(--v-theme-context), .1); border: 2px solid rgb(var(--v-theme-context));}
.cat-per {background: rgba(var(--v-theme-personal), .1); border: 2px solid rgb(var(--v-theme-personal));}
.cat-opi {background: rgba(var(--v-theme-opinion), .1); border: 2px solid rgb(var(--v-theme-opinion));}
.cat-cri {background: rgba(var(--v-theme-critique), .1); border: 2px solid rgb(var(--v-theme-critique));}
</style>
