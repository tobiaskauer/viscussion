<template>
  <div class="avatar" ref="container" style="width: 120px;">


    <!--<div class="traceAvatar" @mouseDown="mousedown" @mousemove="mousemove"
      :style="`
background-image: url(${avatar.url});background-size: ${avatar.zoom}px;background-position-x: ${avatar.x}%;background-position-y: ${avatar.y}%;height: ${avatar.height}px;width: ${avatar.width}px;`">
    </div>-->
    <canvas id="mycanvas" ref="canvas" :width="dimensions.width" :height="dimensions.height"></canvas>
  </div>


  <div v-if="props.trace.length > 1">
    <ul :style="`text-align: center; position: relative; margin-top: -30px; padding-bottom: 30px;`">
      <li v-for="anchor, i in props.trace" :key="'anchor' + i" style="display: inline-block" @click="avatarIndex = i">
        <v-icon color="white" size="small" style="opacity: 0.8; text-shadow: 0 0 5px black;" icon="mdi-circle"
          v-if="avatarIndex == i" />
        <v-icon v-else color="white" size="small" style="opacity: .8; text-shadow: 0 0 5px black;"
          icon="mdi-circle-outline" />
      </li>
    </ul>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
const props = defineProps(['trace', 'image', 'width'])

watch(() => props.trace, (first, second) => {
  cropImage(0)
})

const container = ref(null)
const canvas = ref(null)
const avatarIndex = ref(0)
const dimensions = ref({
  width: 120,
  height: 120 //lets just do these fixed. only downside is that very long comments don't get to use the full height
})

const cropImage = (index) => {
  const context = canvas.value.getContext("2d")

  context.clearRect(0, 0, dimensions.value.width, dimensions.value.height);
  const croppedImage = new Image();
  croppedImage.src = props.image.url

  let currentAnchor = props.trace[index]
  //console.log(typeof currentAnchor, currentAnchor) //this somestimes is wrapped in an array. why?

  if (currentAnchor) {
    let scale = dimensions.value.width / currentAnchor.width
    let scaledHeight = currentAnchor.height * scale
    let scaledWidth = dimensions.value.width




    if (scaledHeight > dimensions.value.height) {
      scale = dimensions.value.height / currentAnchor.height
      scaledHeight = currentAnchor.height * scale
      scaledWidth = currentAnchor.width * scale
    }

    //center align
    let dx = scaledWidth < dimensions.value.width ? dimensions.value.width / 2 - scaledWidth / 2 : 0
    let dy = scaledHeight < dimensions.value.height ? dimensions.value.height / 2 - scaledHeight / 2 : 0

    let a = {
      image: croppedImage,//
      sx: parseInt(currentAnchor.x),//x position of anchor
      sy: parseInt(currentAnchor.y),//y position of anchor
      sWidth: parseInt(currentAnchor.width), //width of anchor,
      sHeight: parseInt(currentAnchor.height),//height of anchor,
      dx: parseInt(dx), //x translation in avatar
      dy: parseInt(dy), //y translation in avatar
      dWidth: parseInt(scaledWidth), //avatar width
      dHeight: parseInt(scaledHeight), //avatar height
    }

    croppedImage.onload = function () {
      //fix screen resolution for better downsampling
      const dpr = window.devicePixelRatio;
      const rect = canvas.value.getBoundingClientRect();

      canvas.value.width = rect.width * dpr;
      canvas.value.height = rect.height * dpr;

      context.scale(dpr, dpr);

      // Set the "drawn" size of the canvas
      canvas.value.style.width = `${rect.width}px`;
      canvas.value.style.height = `${rect.height}px`;

      context.drawImage(a.image, a.sx, a.sy, a.sWidth, a.sHeight, a.dx, a.dy, a.dWidth, a.dHeight)
    }

  }

}

onMounted(() => {
  cropImage(0)
})

watch(avatarIndex, newIndex => {
  cropImage(newIndex)
})



/*let avatar = computed(() => {
  if (!props.trace) return null

  let trace = props.trace[avatarIndex.value]
  if (!trace) return null



  let image = props.image
  let aspectRatio = trace.height / trace.width
  let width = props.width
  let height = width * aspectRatio

  //adapt height and width when height is very large (width is controlled by col width anyway)
  if (height > 200) {
    let decreaseFactor = height / 200
    width = width / decreaseFactor
    height = height / decreaseFactor
  }

  let zoomFactor = width / trace.width

  if (zoomFactor > 1) {
    let zoomRatio = zoomFactor / 1
    width = width / zoomRatio
    height = height / zoomRatio
    zoomFactor = 1
  }

  let backgroundPosition = {
    x: (trace.x + trace.width / 2) / image.width * 100,
    y: (trace.y + trace.height / 2) / image.height * 100,
  }


  Object.keys(backgroundPosition).forEach(value => {
    //oh my god. this is the hackiest bit in this project...yet
    let aRandomNagicNumber = value == 'x' ? 16 : 10 //this umber may differ from image to image (and maybe even dimension to dimension)
    let difference = backgroundPosition[value] - 50 //is it below or above center
    backgroundPosition[value] = backgroundPosition[value] + difference / aRandomNagicNumber //add a fraction of that difference 

  })


  let avatar = {
    height: width * aspectRatio,
    zoom: zoomFactor * image.width,
    //x: (trace.x) / image.width * 100,
    //y: (trace.y) / image.height * 100,
    x: backgroundPosition.x,
    y: backgroundPosition.y,

    width: width,
    url: props.image.url
  }

  if (props.trace[0].traceId == 282) {
    //console.log("trace.y:", trace.y, " - trace.height:", trace.height, " - image.height:", image.height)

    //console.log((trace.y) / image.height * 100, "better closer to 49,86") //281
    //console.log((trace.x + trace.width / 2) / image.width * 100, "shpuld be 100") //282 (Morocco)
    //console.log(trace.x + trace.width)
    //console.log(image.width)


  }

  return avatar
})*/

/*onMounted(() => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext('2d');

  let trace = props.trace[avatarIndex.value]
  console.log(trace)

  const img = new Image(); // Create new img element
  img.src = props.image.url; // Set source path

  img.onload = function () {
    let sourceX = trace.x
    let sourceY = trace.y
    let sourceW = trace.width
    let sourceH = trace.height
    let destinationX = 0
    let destinationY = 0
    let destinationW = 140
    let destinationH = 149

    context.drawImage(img, sourceX, sourceY, sourceW, sourceH, destinationX, destinationY, destinationW, destinationH)
  }
})*/
</script>


<style scoped></style>
