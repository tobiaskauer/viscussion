<template>
  <div class="avatarWrapper">
    <div :style="'width: '+(width)+'px; padding: '+padding+'px; background: #ED6A63; float: left;'">
      <div class="traceAvatar" :style="'padding: 0; margin: 0; background-image: url('+avatar.url+'); background-size: '+avatar.zoom+'px; background-position-x: '+avatar.x+'%; background-position-y: '+avatar.y+'%; height: '+avatar.height+'px; width: '+avatar.width+'px;'"></div>
     </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps(['trace','image','width', 'height'])

let padding = 10

let avatar = computed(()  => {
  let trace  = props.trace
    let image = props.image
    let width = props.width - (padding*2) //
    let height = props.height
    let avatar = {}
    
    let zoomFactor = width/trace.width
    let aspectRatio = trace.height / trace.width
    
    avatar.height = width * aspectRatio
    //TODO: check if height is over props.height and resize accordingly
    if(avatar.height > height) {console.log('reverse it')}
    avatar.zoom = zoomFactor * image.width * 0.95 //zoom out to correct for some errors

    avatar.x = trace.x / image.width * 107 //this should be 100 but css is a wild language
    avatar.y = trace.y / image.height * 107



    avatar.width = width
    avatar.url = props.image.url
    return avatar
})

    
</script>


<style scoped>
</style>
