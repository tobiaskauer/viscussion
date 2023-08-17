<template>
  <v-card :color="(trace.id == highlight) ? 'primary' : 'surface'" :id="'card-' + trace.id"
    :class="{ 'ml-5': props.response }">

    <v-card-text class="pa-0">
      <v-row no-gutters="">
        <v-col class="v-col-4" style="border-right: 1px solid lightgrey" v-if="props.avatar">
          <Avatar v-if="trace.anchors && trace.anchors.length > 0" :image="props.image" :trace="trace.anchors"
            :width="props.width" />
        </v-col>
        <v-col class="pl-5 pa-3" :class="['v-col-8' ? props.avatar : 'v-col-12']">
          <v-row>
            <v-col class="v-col-7">
              <div class="timeWrapper" :class="{ highlightTime: patina.key == 'Temporal' }">
                <small v-if="trace.date">

                  <Timeago :datetime="trace.date" />
                </small>
                <small v-else>
                  <Timeago :datetime="trace.createdAt" />
                </small>
              </div>
            </v-col>
            <v-col class="v-col-5" align="right"><v-chip @click="traceStore.setActivePatina('Category')"
                :class="{ categoryHighlight: patina.key == 'Category' }" v-if="category" :color="category.color"
                size="x-small">
                <v-icon>mdi-label-outline</v-icon>
                {{
                  category.name
                }}</v-chip></v-col>
          </v-row>


          <p class="my-3"><strong style="padding-right: 5px">{{ trace.author }}</strong>{{
            trace.text }}</p>

          <div align="right">
            <v-btn v-if="!props.response" size="small" density="compact" variant="text" @click="expand(trace)">
              <v-icon>mdi-comment-outline</v-icon>
              <span v-if="trace.responses && trace.responses.length">{{ trace.responses.length }}</span>
              <span v-else>0</span>
            </v-btn>
            <v-btn :class="{ activePopularity: patina.key == 'Popularity' }" size="small" density="compact" variant="text"
              @click="upvote(trace)">
              <v-icon>mdi-heart-outline</v-icon>
              <span v-if="trace.score">{{ trace.score }}</span>
              <span v-else>0</span>
            </v-btn>

          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { reactive, onMounted, computed, ref, watch } from 'vue'
import Avatar from './Avatar.vue'
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();
const props = defineProps(['trace', 'image', 'width', 'avatar', 'response'])

let newScore = ref(false)

const upvote = (e) => {
  traceStore.upvote(e)
  newScore.value = !newScore.value ? e.score + 1 : newScore.value++
}
const expand = (e) => {
  traceStore.expand(e)
}

const patina = computed(() => traceStore.activePatina)

const category = computed(() => {
  let categories = traceStore.getCategories

  return props.trace.category ? categories.find(category => category.key == props.trace.category[0]) : null
})

const highlight = computed(() => {

  return traceStore.getHighlight
})

const play = () => {

}

onMounted(() => {

})


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
  margin-bottom: 10px;
}

.categoryHighlight {
  border: 2px solid red;
}

.highlightTime {
  display: inline-flex;
  background: rgba(255, 0, 0, .2);
  border-radius: 2px;
}

.activePopularity {
  color: red;
}


.timeWrapper {
  padding: 2px;
}
</style>
