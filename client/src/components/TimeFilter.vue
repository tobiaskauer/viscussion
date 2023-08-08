<template>
     <v-row class="px-0">
          <v-col class="p2-0">
               <v-range-slider v-model="activeTimeFrame" @update:modelValue="update" :min="timeFrame[0]" strict
                    :max="timeFrame[1]" step="3600">
               </v-range-slider>

               <input type="text" class="js-range-slider" name="my_range" value="" />

          </v-col>
     </v-row>
</template>

<script setup>

import { computed, ref, watch, onMounted } from 'vue';
import { useTraceStore } from "../stores/traceStore.js";



const traceStore = useTraceStore();

const timeFrame = computed(() => {
     return traceStore.fullTimeFrame

})


let activeTimeFrame = ref([])

/*onMounted(() => {
     activeTimeFrame[0] = timeFrame[0]
     activeTimeFrame[1] = timeFrame[1]
     console.log(timeFrame)

})*/
watch(timeFrame, newTimeFrame => {
     activeTimeFrame[0] = timeFrame[0]
     activeTimeFrame[1] = timeFrame[1]
})
let tempArr = []
const update = (arr) => {
     if (JSON.stringify(arr) != JSON.stringify(tempArr)) { //dont trouble the store with too many updates
          tempArr = arr
          traceStore.setActiveTimeFrame(arr.map(time => new Date(time * 1000)))
     }
}
/*const unixTimeToString = (unix) => {
     let date = new Date(unix * 1000)
     return date.toLocaleString("us-US", {
          timeZone: "UTC"
     })
}*/



</script>

<style scoped></style>
