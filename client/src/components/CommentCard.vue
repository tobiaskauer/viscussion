<template>
  <!--  <v-card :width="props.width" :color="(trace.id == highlight) ? 'primary' : 'surface'" @mouseenter="setHighlight(trace)"
    @mouseleave="setHighlight(null)" :id="'card-' + trace.id">

    <v-card-text class="pa-0">
      <v-row no-gutters="">
        <v-col class="v-col-4 ma-0 pa-3" v-if="props.avatar">
          {{ props.trace.anchors }}
          <Avatar v-if="props.trace.anchors && props.trace.anchors.length > 0" :image="props.image"
            :trace="props.trace.anchors[0]" :width="avatar.width" />
        </v-col>
        <v-col class="pl-5 pa-3" :class="{ 'v-col-8': props.avatar }">
          <div class="mb-2">
            <p>
              <strong>{{ props.trace.author }}</strong>: {{ props.trace.text }}
            </p>
            <p class="mt-2"><small>
                <Timeago :datetime="props.trace.date" />&centerdot;
                <span v-if="props.trace.category && props.trace.category.length > 0">{{ props.trace.category[0] }}
                  &centerdot;</span>
              </small>
            </p>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>-->
  <v-card :color="(trace.id == highlight) ? 'primary' : 'surface'" :id="'card-' + trace.id">
    <v-card-text class="pa-0">
      <v-row no-gutters="">
        <v-col class="v-col-4">

          <Avatar v-if="trace.anchors.length > 0" :image="props.image" :trace="trace.anchors[0]" :width="props.width" />
        </v-col>
        <v-col class="v-col-8 pl-5 pa-3">
          <v-row>
            <v-col class="v-col-7">
              <small>
                <Timeago :datetime="trace.createdAt" />
              </small>
            </v-col>
            <v-col class="v-col-5" align="right"><v-chip v-if="trace.category" :color="trace.category.color"
                size="x-small">{{
                  trace.category.name
                }}</v-chip></v-col>
          </v-row>


          <p class="my-3"><strong style="padding-right: 5px">{{ trace.author }}</strong> {{ trace.text }}</p>

          <div align="right">
            <v-btn size="small" density="compact" variant="text" @click="upvote(trace)">
              <v-icon>mdi-heart-outline</v-icon> {{ trace.score }}
            </v-btn>
            <v-btn size="small" density="compact" variant="text" @click="expand(trace)">
              <v-icon>mdi-comment-outline</v-icon> {{ trace.responses.length }}
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
const props = defineProps(['trace', 'image', 'width'])

const upvote = (e) => {
  traceStore.upvote(e)
}
const expand = (e) => {
  if (e.responses.length > 0) { traceStore.expand(e) }

}


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
