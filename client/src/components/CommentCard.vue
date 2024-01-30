<template>
  <v-container class="pa-0">
    <v-card :color="(trace.id == highlight) ? 'primary' : 'surface'" :id="'card-' + trace.id"
      :class="{ 'ml-5': props.response }">

      <v-card-text class="pa-0">

        <v-row no-gutters="">
          <v-col class="v-col-4" v-if="props.avatar">
            <Avatar v-if="trace.anchors && trace.anchors.length > 0" :image="props.image" :trace="trace.anchors" />
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


            <a class="my-3" @click="expand(trace)" style="cursor: pointer !important"><strong
                style="padding-right: 5px">{{
                  trace.author }}</strong>{{
    trace.text }}</a>

            <!--            <br>x: {{ trace.anchors[0].x }}; width: {{ trace.anchors[0].width }}
            <br>y: {{ trace.anchors[0].y }}; height: {{ trace.anchors[0].height }}-->
            <div align="right">
              <v-btn v-if="!props.response" size="small" density="compact" variant="text" @click="expand(trace)">
                <v-icon>mdi-comment-outline</v-icon>
                <span v-if="trace.responses && trace.responses.length">{{ trace.responses.length }}</span>
                <span v-else>0</span>
              </v-btn>
              <v-btn :class="{ activePopularity: patina.key == 'Popularity' }" size="small" density="compact"
                variant="text" :disabled="state.disableLike" @click="upvote(trace, $event)">
                <v-icon>mdi-heart-outline</v-icon>
                <span v-if="trace.score">{{ trace.score }}</span>
                <span v-else>0</span>
              </v-btn>

            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive, onMounted, computed, ref, watch, onActivated } from 'vue'
import Avatar from './Avatar.vue'
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();
const props = defineProps(['trace', 'image', 'avatar', 'response'])

const state = reactive({
  disableLike: false
})

const avatar = ref(null)
/*const avatarWidth = ref(null)
onMounted(() => {
  avatarWidth.value = avatar.value ? avatar.value.$el.getBoundingClientRect().width - 1 : null
})*/

const upvote = (trace) => {
  traceStore.upvote(trace)
  state.disableLike = true
  trace.score++

  traceStore.writeInteraction({
    action: "upvote",
    target: e.id
  })
}
const expand = (e) => {
  traceStore.expand(e)
  traceStore.writeInteraction({
    action: "expandTrace",
    target: e.id
  })

}

const patina = computed(() => traceStore.activePatina)

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
