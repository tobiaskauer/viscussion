<template>
    <v-row >
      <v-col class="v-col-8">
      <TransitionGroup tag="ul" name="list">
        <li v-for="(trace, index) in props.traces" :key="'tracelog-'+trace.id">
          <v-card color="surface">
            
            <v-card-text class="pa-0">
            <Avatar :image="props.image" :trace="trace" width="120" />
            
            <strong>new avatar</strong> Anonymous Penguin created a trace <Timeago :datetime="trace.createdAt" />
            
            </v-card-text>
          </v-card>
        </li>
      </TransitionGroup>
    </v-col>
    </v-row>  
</template>

<script setup>
//import original from '../assets/chess.webp'
import { reactive, onMounted, computed, nextTick, onUnmounted } from 'vue'
import Avatar from './Avatar.vue'
import { useTraceStore } from "../stores/traceStore.js";

const store = useTraceStore();
const props = defineProps(['image', 'traces'])

const clipWidth = 120


/*const traces = computed(() => {
  let traces = props.traces
  traces.forEach(trace => {
    trace.avatar = createAvatar({
      trace: trace,
      image: props.image,
      width: 120
    })
  })
  return traces
});*/


</script>

<style scoped>
li {
  list-style: none;
  margin-bottom: 10px;
}
</style>
