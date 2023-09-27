<template>
     <v-row>
          <v-col>
               <v-btn size="small" class="mr-3" v-for="patina in patinas" :key="patina.key" :active="patina.active"
                    @click="select(patina.key)">
                    <v-icon v-if="patina.icon">{{ patina.icon }}</v-icon>
                    {{ patina.key }}
               </v-btn>
          </v-col>
     </v-row>
     <v-row class="ma-0">
          <v-col class="ma-0">
               <template v-if="activePatina.key == 'None'">
                    The accumulation of people's comments gives visualizations a distinct look. We call this look
                    <strong><code>Patina</code></strong>. Select a patina above to see how people commented on this
                    visualization.</template>
               <template v-if="activePatina.key == 'Activity'">Each layer indicates a comment. Areas with a thick patina have
                    the highest activity.</template>
               <template v-if="activePatina.key == 'Responses'">The faster a box moves, the more responses were written to
                    it.</template>
               <template v-if="activePatina.key == 'Category'">Filter comments by category:</template>
               <template v-if="activePatina.key == 'Popularity'"><span
                         style="border: 1px solid red; background: rgba(255,0,0,.1); font-weight: bold;  border-radius: 2px; padding: 3px;">Red
                         comments</span> are more
                    popular according to their <v-icon>mdi-heart-outline</v-icon> score.</template>
               <template v-if="activePatina.key == 'Temporal'">Replay, how the center of attention has shifted over
                    time:</template>
               <template v-if="activePatina.key == 'Relation'">Linked comments are mentioned together</template>
          </v-col>
     </v-row>
</template>

<script setup>

import { computed } from 'vue';
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();

const patinas = computed(() => traceStore.patinas)
const activePatina = computed(() => traceStore.activePatina)

const select = (key) => {
     traceStore.writeInteraction({
          action: "switchPatina",
          target: key
     })
     traceStore.setActivePatina(key)
}

</script>

<style scoped></style>
