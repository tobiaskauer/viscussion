<template>
  <div :style="'width: ' + (width) + 'px;'">

    <div class="traceAvatar" @mouseDown="mousedown" @mousemove="mousemove"
      :style="`background-image: url(${avatar.url}); background-size: ${avatar.zoom}px; background-position-x: ${avatar.x}%; background-position-y: ${avatar.y}%; height: ${avatar.height}px; width: ${avatar.width}px;`">
    </div>
  </div>

  <div v-if="props.trace.length > 1">
    <ul :style="`text-align: center; position: relative; margin-top: -30px; padding-bottom: 30px;`">
      <li v-for="anchor, i in props.trace" :key="'anchor' + i" style="display: inline-block" @click="avatarIndex = i">
        <v-icon color="white" size="small" style="opacity: .8; text-shadow: 0 0 5px black;" icon="mdi-circle"
          v-if="avatarIndex == i" />
        <v-icon v-else color="white" size="small" style="opacity: .8; text-shadow: 0 0 5px black;"
          icon="mdi-circle-outline" />
      </li>
    </ul>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
const props = defineProps(['trace', 'image', 'width', 'height'])

/*const avatarClass = computed(() => {
  if (!props.trace) return false
  let avatarClass = "cat-"
  avatarClass += props.trace.category && props.trace.category.length > 0 ? props.trace.category[0] : 'plain'
  return avatarClass
})*/

const avatarIndex = ref(0)

let avatar = computed(() => {
  if (!props.trace) return null
  let trace = props.trace[avatarIndex.value]
  let image = props.image
  let width = props.width
  let zoomFactor = width / trace.width
  let aspectRatio = trace.height / trace.width

  //TODO: check if height is over props.height and resize accordingly
  let height = props.height
  //if (avatar.height > height) { console.log('reverse it') }
  //avatar.zoom = zoomFactor * image.width * 0.9 //zoom out to correct for some errors
  //zoom out to correct for some errors

  let avatar = {
    height: width * aspectRatio,
    zoom: zoomFactor * image.width * 1,
    x: (trace.x + trace.width / 2) / image.width * 100,
    y: (trace.y + trace.height / 2) / image.height * 100,
    width: width,
    url: props.image.url
  }
  console.log(props)
  return avatar
})
</script>


<style scoped>
.traceAvatar {
  padding: 0;
  margin: 0;
}
</style>
