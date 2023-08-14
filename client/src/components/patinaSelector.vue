<template>
     <v-row>
          <v-col>
               <v-btn class="mr-1" v-for="patina in patinas" :key="patina.key" :active="patina.active"
                    @click="traceStore.setActivePatina(patina.key)">
                    {{ patina.key }}
               </v-btn>

          </v-col>
     </v-row>
</template>

<script setup>

import { computed } from 'vue';
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();

const patinas = computed(() => traceStore.patinas)


</script>

<style scoped></style>
