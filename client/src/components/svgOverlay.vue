<template>
  <div class="overlayWrapper">

    <div class="highlight" v-if="trace && trace.x"
      :style="`top: ${trace.y + trace.height}px; left: ${trace.x + trace.width + dimensions.offsetX}px`">
      <!--<commentCard />-->
      asd
    </div>
  </div>
</template>

<script setup>


import { computed, onMounted } from "vue";
import commentCard from './CommentCard.vue'
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();

const trace = computed(() => {
  return traceStore.getHighlight
})

/*const cardStyle = (trace) => {
  if (!trace) return 'display: none'
  let style = `top: ${trace.y + trace.height + dimensions.top}px; left: ${trace.x}px;`
  console.log(style)
  return style
}*/

const dimensions = computed(() => traceStore.dimensions)


</script>

<style scoped>
.highlight {
  position: absolute;

}

div.overlayWrapper {
  position: absolute;
  top: 0;
  pointer-events: none;
  background: rgba(0, 255, 0, .1);
  z-index: 9999;
  width: 100%;
  height: 100%;
}
</style>
