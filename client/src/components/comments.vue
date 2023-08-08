<template>
  <div>
    <v-btn @click="state.iterator++">Next</v-btn><br />
    <p v-if="state.mounted">
      <em>{{ state.comments[state.iterator].body }}</em><br>
      <span v-if="state.parent"><small><strong>Parent: </strong><em>{{ state.parent.body }}</em></small></span>
    </p>

  </div>
</template>
<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import * as d3 from "d3";

import { useRedditStore } from "../stores/redditStore.js";
const redditStore = useRedditStore();


const props = defineProps(['id'])
const state = reactive({
  comments: [],
  iterator: 0,
  mounted: false,
  parent: false
})

watch(state, (newValue, oldValue) => {
  if (state.comments[state.iterator].parent) {
    state.parent = state.comments.find(comment => comment.id == state.comments[state.iterator].parent)
  }

  redditStore.setComment(state.comments[state.iterator])
})






</script>


<style scoped></style>
