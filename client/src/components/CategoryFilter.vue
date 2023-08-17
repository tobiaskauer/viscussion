<template>
     <v-row class="pa-0 ma-0">

          <v-col class="pa-0 ma-0">
               <v-chip-group v-model="selectedCategory.key" selected-class="selected">
                    <v-chip v-for="category in categories" :key="category.key"
                         :style="`background-color: ${category.color}; border: 2px solid ${category.color}; color: white;`"
                         :value="category.key">{{
                              category.name
                         }}</v-chip>
               </v-chip-group>
          </v-col>
     </v-row>
</template>

<script setup>

import { computed, reactive, watch } from 'vue';
import { useTraceStore } from "../stores/traceStore.js";
const traceStore = useTraceStore();


const categories = computed(() => traceStore.getCategories)
const selectedCategory = reactive({ key: null })
watch(selectedCategory, updated => {
     traceStore.setActiveCategories([updated.key])
})

</script>

<style scoped>
.selected {
     background: white !important;
     font-weight: bold;
     color: black !important;
}

.v-chip__underlay {
     opacity: .5 !important;
}
</style>
