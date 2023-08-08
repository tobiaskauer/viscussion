<template>
  <v-card :width="props.width" :color="(trace.id == highlight) ? 'primary' : 'surface'" @mouseenter="setHighlight(trace)"
    @mouseleave="setHighlight(null)" :id="'card-' + trace.id">

    <v-card-text class="pa-0">
      <v-row no-gutters="">
        <v-col class="v-col-4 ma-0 pa-3" v-if="props.avatar">
          <!--TODO: have a slide vor each anchor-->
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
  </v-card>
</template>

<script setup>
import { reactive, onMounted, computed, ref, watch } from 'vue'
import Avatar from './Avatar.vue'
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();
const props = defineProps(['trace', 'image', 'width', 'avatar'])
const avatar = reactive({ width: null })

const setHighlight = ((trace) => {
  traceStore.setHighlight(trace)
})

const randomAnimal = computed(() => {
  return traceStore.getRandomAnimal //TODO Make this random for each instance
})

const highlight = computed(() => {
  return traceStore.getHighlight
})



onMounted(() => {
  avatar.width = props.width / 3
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
