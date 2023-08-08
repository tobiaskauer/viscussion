<template>
  <TransitionGroup tag="ul" name="list" ref="list" id="annotationList">
    <li v-for="(trace, index) in props.traces" :key="'tracelog-' + trace.id" @mouseenter="setHighlight(trace)"
      @mouseleave="setHighlight(null)">
      <v-card :color="(trace.id == highlight) ? 'primary' : 'surface'" :id="'card-' + trace.id">

        <v-card-text class="pa-0">
          <v-row no-gutters="">
            <v-col class="v-col-4 ma-0 pa-3">
              <!--TODO: have a slide vor each anchor-->
              <Avatar v-if="avatar.width && trace.anchors.length > 0" :image="props.image" :trace="trace.anchors[0]"
                :width="avatar.width" />
            </v-col>
            <v-col class="v-col-8 pl-5 pa-3">
              <div class="mb-2">
                <h5 v-if="!trace.author">{{ randomAnimal }}</h5>
                <h5 v-else>{{ trace.author }}</h5>
                (
                <Timeago :datetime="trace.createdAt" />)
              </div>

              <p v-if="trace.text">{{ trace.text }}</p>
              <p v-else>This area is interesting to me!</p>
              <!--<v-chip v-if="trace.category" size="small">{{ categories.find(category => category.key == trace.category).name }}</v-chip>-->

            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </li>
  </TransitionGroup>
</template>

<script setup>
//import original from '../assets/chess.webp'
import { reactive, onMounted, computed, ref, watch, nextTick, onUnmounted } from 'vue'
import Avatar from './Avatar.vue'
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();
const props = defineProps(['image', 'traces'])


const avatar = reactive({ width: null })
const list = ref(null)

const setHighlight = ((trace) => {
  if (trace) trace.embedded = false
  traceStore.setHighlight(trace)
})

const randomAnimal = computed(() => {
  return traceStore.getRandomAnimal //TODO Make this random for each instance
})


const highlight = computed(() => {
  return traceStore.getHighlight
})

watch(highlight, newHighlight => {
  if (!newHighlight) return false;

  /*let selector = 
  window.scrollTo({
    behavior: 'smooth',
    top:
      document.getElementById(selector).getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      100,
  })*/

  //let target = document.getElementById('card-' + newHighlight).getBoundingClientRect()


  //document.getElementById("annotationList").scrollTop += target.top

  /*document.getElementById('card-' + newHighlight).scrollIntoView({
    behavior: 'smooth',
    block: "end",
    inline: "nearest"*/
})


onMounted(() => {
  avatar.width = getWidth()
})

const getWidth = (() => {
  let width = Math.round(list.value.$el.clientWidth * .33333)
  return width
})

window.onresize = function () {
  avatar.width = getWidth()
}

</script>

<style scoped>
ul {
  height: 100vh;
  overflow: scroll;
}

h5 {
  display: inline;
}

li {
  list-style: none;
  padding-bottom: 10px;
}
</style>
