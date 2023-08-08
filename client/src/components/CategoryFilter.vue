<template>
     <v-row class="px-0">
          <v-col class="p2-0">
               <v-chip-group v-model="selectedCategory.key" selected-class="text-deep-purple-accent-4">
                    <v-chip v-for="category in categories" :key="category.key" :value="category.key">{{ category.name
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

<style scoped></style>
