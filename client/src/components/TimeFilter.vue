<template>
     <v-row class="pa-0 ma-0">

          <v-col class="v-col-4 ma-0">
               <v-slider show-ticks="always" :step="timeFrameSection / 2" tick-size="2" v-model="currentDate"
                    :min="timeFrame[0]" strict :max="timeFrame[1]">
               </v-slider>
          </v-col>
          <v-col class="ma-0">
               <v-btn rounded="xl" @click="play">
                    <v-icon v-if="timeControls.play">mdi-pause</v-icon>
                    <v-icon v-else>mdi-play</v-icon>
               </v-btn>
               <v-btn density="comfortable" @click="reset" icon="mdi-restart"></v-btn>
          </v-col>

     </v-row>
</template>

<script setup>

import { computed, ref, watch, onMounted } from 'vue';
import { useTraceStore } from "../stores/traceStore.js";

let currentDate = ref()
const traceStore = useTraceStore();
let timeControls = ref({ play: true })

const timeFrame = computed(() => {
     return traceStore.fullTimeFrame
})

const timeFrameSection = computed(() => {
     if (!timeFrame) return false
     return Math.ceil((timeFrame.value[1] - timeFrame.value[0]) / 10)
})

watch(timeFrame, newtimeFrame => { //wait for timeFrame to be mounted (onMounted was too fast)
     currentDate.value = newtimeFrame[0]
})


onMounted(() => {
     currentDate.value = timeFrame[0]
     run()
})


let interval
const run = () => {
     //currentDate.value = timeFrame.value[0]
     interval = setInterval(() => {
          if (currentDate.value > timeFrame.value[1] || !timeControls.value.play) {
               console.log("clear interval")
               clearInterval(interval)
          }
          currentDate.value = currentDate.value + timeFrameSection.value
     }, 350)
}

const play = () => {

     timeControls.value.play = !timeControls.value.play
     if (timeControls.value.play) {
          console.log("play")
          run()
     }
     traceStore.writeInteraction({
          action: "playTemporalPatina",
     })
}

const reset = () => {
     clearInterval(interval)
     currentDate.value = timeFrame.value[0]
     timeControls.value.play = true
     run()
     traceStore.writeInteraction({
          action: "resetTemporalPatina",
     })
}

watch(currentDate, newDate => {
     update(newDate)
})

watch(timeControls, newTimeControls => {
     console.log(newTimeControls)
     console.log(newTimeControls.value.play)
})



const update = (value) => {
     value = Math.ceil(value)


     let activeTimeFrame = [
          value - timeFrameSection.value,
          value + timeFrameSection.value
     ]

     traceStore.setActiveTimeFrame(activeTimeFrame.map(time => new Date(time * 1000)))

     /*if (JSON.stringify(arr) != JSON.stringify(tempArr)) { //dont trouble the store with too many updates
          tempArr = arr
          //traceStore.setActiveTimeFrame(arr.map(time => new Date(time * 1000)))
     }*/
}

</script>

<style scoped></style>
