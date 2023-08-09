<template>
  <v-card :color="(trace.id == highlight) ? 'primary' : 'surface'" :id="'card-' + trace.id"
    :class="{ 'ml-5': props.response }" @click="expand(trace)">

    <v-card-text class="pa-0">
      <v-row no-gutters="">
        <v-col class="v-col-4" style="border-right: 1px solid lightgrey" v-if="props.avatar">
          <Avatar v-if="trace.anchors && trace.anchors.length > 0" :image="props.image" :trace="trace.anchors[0]"
            :width="props.width" />
        </v-col>
        <v-col class="pl-5 pa-3" :class="['v-col-8' ? props.avatar : 'v-col-12']">
          <v-row>
            <v-col class="v-col-7">
              <small v-if="trace.date">
                <Timeago :datetime="trace.date" />
              </small>
              <small v-else>
                <Timeago :datetime="trace.createdAt" />
              </small>
            </v-col>
            <v-col class="v-col-5" align="right"><v-chip v-if="category" :color="category.color" size="x-small">{{
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
            <v-btn size="small" density="compact" variant="text" @click="upvote(trace)">
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



const upvote = (e) => {
  traceStore.upvote(e)
}
const expand = (e) => {
  traceStore.expand(e)
}

const category = computed(() => {
  let categories = traceStore.getCategories

  return props.trace.category ? categories.find(category => category.key == props.trace.category[0]) : null
})

const highlight = computed(() => {

  return traceStore.getHighlight
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
</style>
